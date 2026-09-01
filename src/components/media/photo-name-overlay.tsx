type PhotoNameOverlayProps = {
  names?: readonly string[];
  className?: string;
};

export function PhotoNameOverlay({ names, className }: PhotoNameOverlayProps) {
  if (!names?.length) return null;

  return (
    <div
      className={
        className ??
        "border-t border-white/10 bg-slate-950 px-3 py-2.5 sm:px-4"
      }
    >
      <ul className="space-y-0.5">
        {names.map((name) => (
          <li
            key={name}
            className="text-xs font-semibold leading-snug text-white sm:text-sm"
          >
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}
