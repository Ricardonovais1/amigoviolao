import Reveal from "./Reveal";

const courses = [
  { title: "Curso para Crianças", href: "/cursos/criancas" },
  { title: "Curso para Iniciantes", href: "/cursos/iniciantes" },
  { title: "Curso de Clássico", href: "/cursos/classico" },
  { title: "Para Professores", href: "/cursos/professores" },
];

export default function Courses() {
  return (
    <section id="cursos" className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <Reveal>
          <h2 className="text-2xl font-extrabold text-charcoal sm:text-3xl">
            Conheça os Cursos Amigo Violão:
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((course, i) => (
            <Reveal key={course.href} delay={i * 60}>
              <a
                href={course.href}
                className="block rounded-2xl border border-black/10 px-6 py-8 font-semibold text-charcoal shadow-sm transition-[transform,border-color,box-shadow] duration-200 ease-snappy [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-1 [@media(hover:hover)_and_(pointer:fine)]:hover:border-primary [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-md active:scale-[0.97]"
              >
                {course.title}
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
