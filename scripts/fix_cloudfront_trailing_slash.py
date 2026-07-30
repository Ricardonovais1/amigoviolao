"""
Corrige a CloudFront Function amigo-violao-staging-url-rewrite: URLs com barra
final (ex: /quizzes/) buscavam "<path>/index.html", que nao existe no export
estatico deste projeto (gera "<path>.html" flat). Isso causava 403 do S3 (OAC
sem ListBucket), convertido pelo custom error response (403 -> /index.html,
200) num fallback silencioso pra Home.

Uso: python scripts/fix_cloudfront_trailing_slash.py
"""

import boto3

FUNCTION_NAME = "amigo-violao-staging-url-rewrite"
DISTRIBUTION_ID = "E2Q2YNHFJ1GG9P"

NEW_CODE = '''function handler(event) {
  var request = event.request;
  var uri = request.uri;

  if (uri === "/") {
    request.uri = "/index.html";
  } else if (uri.endsWith("/")) {
    request.uri = uri.slice(0, -1) + ".html";
  } else if (!uri.includes(".")) {
    request.uri += ".html";
  }

  return request;
}
'''

def main():
    c = boto3.client("cloudfront", region_name="us-east-1")

    dev = c.get_function(Name=FUNCTION_NAME, Stage="DEVELOPMENT")
    print("DEV ETag:", dev["ETag"])

    updated = c.update_function(
        Name=FUNCTION_NAME,
        IfMatch=dev["ETag"],
        FunctionConfig={
            "Comment": "Append .html/index.html for extensionless static export URLs",
            "Runtime": "cloudfront-js-2.0",
        },
        FunctionCode=NEW_CODE.encode("utf-8"),
    )
    print("Updated DEV. New ETag:", updated["ETag"])

    test_event = {
        "version": "1.0",
        "context": {"eventType": "viewer-request"},
        "viewer": {"ip": "1.2.3.4"},
        "request": {
            "method": "GET",
            "uri": "/quizzes/",
            "querystring": {},
            "headers": {},
            "cookies": {},
        },
    }
    import json

    test_resp = c.test_function(
        Name=FUNCTION_NAME,
        IfMatch=updated["ETag"],
        Stage="DEVELOPMENT",
        EventObject=json.dumps(test_event).encode("utf-8"),
    )
    output = json.loads(test_resp["TestResult"]["FunctionOutput"])
    rewritten_uri = output["request"]["uri"]
    print("Test /quizzes/ ->", rewritten_uri)
    assert rewritten_uri == "/quizzes.html", f"Unexpected rewrite: {rewritten_uri}"

    published = c.publish_function(Name=FUNCTION_NAME, IfMatch=updated["ETag"])
    print("Published to LIVE. ETag:", published["ETag"])

    inv = c.create_invalidation(
        DistributionId=DISTRIBUTION_ID,
        InvalidationBatch={
            "CallerReference": f"fix-trailing-slash-{updated['ETag']}",
            "Paths": {"Quantity": 1, "Items": ["/*"]},
        },
    )
    print("Invalidation created:", inv["Invalidation"]["Id"])
    print("\nDone. Teste em alguns segundos: https://staging.amigoviolao.com/quizzes/")


if __name__ == "__main__":
    main()
