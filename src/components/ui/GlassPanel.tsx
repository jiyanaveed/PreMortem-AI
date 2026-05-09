import type { ReactNode } from "react";

type GlassPanelProps = {
  children: ReactNode;
  className?: string;
  glow?: "cyan" | "blue" | "violet" | "none";
};

const glowClass = {
  cyan: "shadow-glowCyan",
  blue: "shadow-glowBlue",
  violet: "shadow-glowViolet",
  none: "",
};

export function GlassPanel({
  children,
  className = "",
  glow = "none",
}: GlassPanelProps) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-2xl border border-warmBorder bg-warmGlass shadow-panel backdrop-blur-2xl",
        "before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top,_rgba(244,114,208,0.12),_transparent_55%,rgba(255,195,161,0.06),_transparent_70%)]",
        glowClass[glow],
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
