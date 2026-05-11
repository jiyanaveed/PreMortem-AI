import { memo } from "react";
import { motion } from "framer-motion";
import type { PremortemAnalysis } from "../../types/analysis";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

type RiskScoreOrbProps = {
  score: PremortemAnalysis["riskScore"];
  level: PremortemAnalysis["riskLevel"];
};

function RiskScoreOrbInner({ score, level }: RiskScoreOrbProps) {
  const reducedMotion = usePrefersReducedMotion();
  const hue =
    level === "High"
      ? "from-sunsetCoral/95 via-solarOrange/80 to-fluxPink/75"
      : level === "Elevated"
        ? "from-solarOrange/88 to-fluxPink/70"
        : "from-fluxPink/75 to-magentaViolet/65";

  return (
    <div className="relative flex flex-col items-center gap-3">
      <motion.div
        className={[
          "relative flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br p-[2px] md:h-44 md:w-44",
          level === "High" ? "shadow-glowCoral" : "shadow-glowWarm",
          hue,
        ].join(" ")}
        animate={
          reducedMotion ? { rotate: 0 } : { rotate: [0, 2, -2, 0] }
        }
        transition={
          reducedMotion
            ? { duration: 0 }
            : { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-deepPlum/90 backdrop-blur-sm ring-1 ring-warmBorder/45">
          <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-mutedGrey">
            Risk score
          </span>
          <span className="font-mono text-4xl font-semibold text-softWhite md:text-5xl">
            {score}
          </span>
          <span className="font-mono text-xs uppercase tracking-wide text-peachGlow">
            /100
          </span>
          <span className="mt-2 rounded-full border border-warmBorder bg-warmGlass px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-sunsetCoral">
            {level}
          </span>
        </div>
      </motion.div>
      <div className="max-w-[220px] text-center font-mono text-[10px] uppercase tracking-[0.28em] text-mutedGrey">
        Quantized exposure · mock demo output
      </div>
    </div>
  );
}

export const RiskScoreOrb = memo(RiskScoreOrbInner);
