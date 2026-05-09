import { NavLink } from "react-router-dom";
import { useDemo } from "../../context/DemoContext";
import { analysisSourceBadgeLabel } from "../../utils/analysisSourceLabel";

const mobileLinks = [
  { to: "/", label: "Input" },
  { to: "/failure-map", label: "Failure Map" },
  { to: "/fix-plan", label: "Fix Plan" },
];

export function TopBar() {
  const { mode, demoFallbackUsed, cachedAnalysis } = useDemo();
  const badgeLabel = analysisSourceBadgeLabel(
    mode,
    demoFallbackUsed,
    cachedAnalysis,
  );

  return (
    <header className="sticky top-0 z-30 border-b border-warmBorder/40 bg-deepPlum/65 backdrop-blur-2xl">
      <div className="flex items-center justify-between px-4 py-4 md:px-8">
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
        <span className="font-display text-base font-semibold tracking-tight md:text-lg">
          PreMortem AI{" "}
          <span className="text-mutedGrey font-normal">by Meowvate</span>
        </span>
        <span className="hidden shrink-0 rounded-full border border-warmBorder/70 bg-warmGlassSoft px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.28em] text-softLavender md:inline">
          {badgeLabel}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signalCyan opacity-[0.35]" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-signalCyan" />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-softLavender md:text-[11px]">
          Feline Signal Engine // Online
        </span>
      </div>
      </div>
      <nav className="flex gap-2 overflow-x-auto border-t border-warmBorder/30 bg-deepPlum/40 px-4 py-2 backdrop-blur-md md:hidden">
        {mobileLinks.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              [
                "whitespace-nowrap rounded-lg px-3 py-2 font-mono text-[10px] uppercase tracking-wide",
                isActive
                  ? "bg-nav-active text-creamWhite shadow-glowWarm ring-1 ring-warmBorder/45"
                  : "text-mutedGrey",
              ].join(" ")
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
