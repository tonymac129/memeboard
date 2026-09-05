import Link from "next/link";

interface SectionProps {
  children: React.ReactNode;
  href: string;
  title: string;
  description: string;
}

function Section({ children, href, title, description }: SectionProps) {
  return (
    <Link
      href={href}
      className="min-w-50 rounded border-2 border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-900 flex flex-col p-4
       gap-y-2 flex-1"
    >
      {children}
      <h2 className="text-green-600 dark:text-green-500 font-bold text-lg">
        {title}
      </h2>
      <p className="text-black dark:text-zinc-300 text-sm">{description}</p>
    </Link>
  );
}

export default Section;
