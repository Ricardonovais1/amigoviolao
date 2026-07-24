import Link from "next/link";
import type { ProfessorCardData } from "@/lib/professores";
import ProfessorPhoto from "./ProfessorPhoto";

export default function ProfessorCard({ professor }: { professor: ProfessorCardData }) {
  return (
    <Link
      href={`/professores/${professor.slug}`}
      className="group flex flex-col items-center rounded-2xl border border-black/5 bg-white p-6 text-center shadow-sm transition-shadow duration-200 hoverable:shadow-md"
    >
      <ProfessorPhoto src={professor.photo} alt={professor.name} size={112} />
      <h2 className="mt-4 text-lg font-bold text-dark transition-colors group-hover:text-primary">
        {professor.title}
      </h2>
      {professor.city ? (
        <p className="mt-1 text-sm font-semibold text-teal-text">{professor.city}</p>
      ) : null}
      <p className="mt-3 line-clamp-3 text-sm text-charcoal/70">{professor.description}</p>
    </Link>
  );
}
