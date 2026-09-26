type SectionHeaderProps = {
  id?: string;
  title: string;
  subtitle?: string;
};

export default function SectionHeader({
  id,
  title,
  subtitle,
}: SectionHeaderProps) {
  return (
    <div className="mb-3">
      <h2 id={id} className="text-[15px] font-semibold text-slate-900">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
      ) : null}
    </div>
  );
}
