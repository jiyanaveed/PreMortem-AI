import type { ButtonHTMLAttributes, ReactNode } from "react";

type GlowButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "ghost";
};

export function GlowButton({
  children,
  variant = "primary",
  className = "",
  ...props
}: GlowButtonProps) {
  const base =
    "relative inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40";
  const styles =
    variant === "primary"
      ? "bg-cta-primary text-creamWhite shadow-glowWarm hover:brightness-110 hover:shadow-glowCoral"
      : "border border-warmBorder bg-warmGlassSoft text-softWhite backdrop-blur-md hover:border-peachGlow/45 hover:bg-peachGlow/10";

  return (
    <button type="button" className={[base, styles, className].join(" ")} {...props}>
      {children}
    </button>
  );
}
