import { NavLink } from "react-router-dom";
import { Activity, GitBranch, RotateCcw, ShieldCheck } from "lucide-react";
import { SectionLabel } from "../ui/SectionLabel";
import { useDemoReset } from "../../context/DemoContext";

const links = [
  { to: "/", label: "01 / INPUT SIGNAL", icon: Activity },
  { to: "/failure-map", label: "02 / FAILURE MAP", icon: GitBranch },
  { to: "/fix-plan", label: "03 / RESOLUTION PATH", icon: ShieldCheck },
];

export function Sidebar() {
  const resetDemo = useDemoReset();

  return (
    <aside className="sticky top-0 z-20 hidden h-screen w-64 shrink-0 flex-col border-r border-warmBorder/50 bg-deepPlum/75 backdrop-blur-xl md:flex">
      <div className="border-b border-warmBorder/35 px-5 py-6">
        <div className="font-display text-lg font-semibold tracking-tight text-softWhite">
          PreMortem AI
        </div>
        <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-mutedGrey">
          Intelligence layer
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3 py-6">
        <SectionLabel className="px-2">Navigate</SectionLabel>
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                "group flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-all",
                isActive
                  ? "bg-nav-active text-softWhite shadow-glowWarm ring-1 ring-warmBorder/50"
                  : "text-mutedGrey hover:bg-warmGlassSoft hover:text-softWhite",
              ].join(" ")
            }
          >
            <Icon className="h-4 w-4 text-signalCyan opacity-80 group-hover:opacity-100" />
            <span className="font-mono text-[11px] uppercase tracking-wide">
              {label}
            </span>
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-warmBorder/35 px-5 py-4 space-y-2">
        <button
          type="button"
          onClick={resetDemo}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-warmBorder bg-warmGlassSoft px-3 py-2 font-mono text-[10px] uppercase tracking-wide text-mutedGrey transition hover:border-peachGlow/40 hover:text-softWhite"
        >
          <RotateCcw className="h-3.5 w-3.5 text-signalCyan" />
          Reset demo
        </button>
        <div className="rounded-lg border border-warmBorder bg-warmGlass px-3 py-2 font-mono text-[10px] text-mutedGrey backdrop-blur-md">
          Chaos → signal → resolution
        </div>
      </div>
    </aside>
  );
}
