/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://staging.amigoviolao.com",
  output: "export",
  generateRobotsTxt: true,
  changefreq: "weekly",
};
