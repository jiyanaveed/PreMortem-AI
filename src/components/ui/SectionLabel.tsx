import type { ReactNode } from "react";

type SectionLabelProps = {
  children: ReactNode;
  className?: string;
};

export function SectionLabel({ children, className = "" }: SectionLabelProps) {
  return (
    <div
      className={[
        "font-mono text-[10px] uppercase tracking-[0.35em] text-mutedGrey",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
