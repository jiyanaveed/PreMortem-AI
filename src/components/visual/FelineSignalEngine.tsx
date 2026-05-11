import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import type { FelineSignalEngineState } from "../../types/analysis";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

export type FelineSignalEngineProps = {
  state?: FelineSignalEngineState;
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
};

const sizeMap = {
  sm: 200,
  md: 320,
  lg: 420,
} as const;

const PARTICLE_KEYS = [0, 1, 2, 3, 4, 5, 6, 7] as const;

const FAILURE_NODE_COORDS = [
  { cx: 34, cy: 96 },
  { cx: 166, cy: 92 },
  { cx: 48, cy: 154 },
  { cx: 158, cy: 150 },
  { cx: 100, cy: 44 },
] as const;

function FelineSignalEngineInner({
  state = "idle",
  size = "md",
  showLabels = false,
}: FelineSignalEngineProps) {
  const dim = sizeMap[size];
  const reducedMotion = usePrefersReducedMotion();
  const isAnalyzing = state === "analyzing";
  const eyesCyan = state !== "idle";

  const whiskersBright =
    state === "scenarioSelected" ||
    state === "analyzing" ||
    state === "failureDetected" ||
    state === "resolved";

  const failureNodes = state === "failureDetected";
  const resolvedGlow = state === "resolved";
  const idleDim = state === "idle";

  const idleOuterMotion = useMemo(
    () =>
      reducedMotion
        ? { opacity: idleDim ? 0.85 : 1, scale: 1 }
        : { opacity: idleDim ? 0.65 : 1, scale: idleDim ? 0.98 : 1 },
    [idleDim, reducedMotion],
  );

  const idleOuterTransition = useMemo(
    () =>
      reducedMotion
        ? { duration: 0 }
        : { duration: 2.4, repeat: idleDim ? Infinity : 0, repeatType: "reverse" as const },
    [idleDim, reducedMotion],
  );

  return (
    <div className="relative flex flex-col items-center">
      {showLabels && (
        <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.35em] text-mutedGrey">
          Feline Signal Engine
        </div>
      )}
      <motion.div
        className="relative"
        style={{ width: dim, height: dim }}
        animate={idleOuterMotion}
        transition={idleOuterTransition}
      >
        {!reducedMotion &&
          PARTICLE_KEYS.map((i) => (
            <motion.span
              key={i}
              className="pointer-events-none absolute h-1 w-1 rounded-full bg-peachGlow/80"
              style={{
                left: `${12 + (i % 4) * 22}%`,
                top: `${10 + Math.floor(i / 4) * 70}%`,
              }}
              animate={{
                opacity: [0.2, 0.85, 0.35],
                y: [0, -6, 0],
              }}
              transition={{
                duration: 3 + i * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}

        <svg
          width={dim}
          height={dim}
          viewBox="0 0 200 200"
          className="drop-shadow-[0_0_28px_rgba(244,114,208,0.18)]"
          aria-hidden
        >
          <defs>
            <linearGradient id="warmCore" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFC3A1" stopOpacity="0.85" />
              <stop offset="45%" stopColor="#F472D0" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#D8B4FE" stopOpacity="0.45" />
            </linearGradient>
            <linearGradient id="ringMist" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D8B4FE" stopOpacity="0.42" />
              <stop offset="55%" stopColor="#FFC3A1" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#F472D0" stopOpacity="0.14" />
            </linearGradient>
            <linearGradient id="riskGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF7A5C" />
              <stop offset="45%" stopColor="#FF9F43" />
              <stop offset="100%" stopColor="#F472D0" />
            </linearGradient>
            <filter id="blurGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="eyeGlow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="2.2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <motion.g
            animate={
              reducedMotion
                ? { opacity: isAnalyzing ? 0.55 : failureNodes ? 0.55 : 0.35, scale: 1 }
                : isAnalyzing
                  ? { opacity: [0.3, 0.85, 0.35], scale: [0.96, 1.02, 0.98] }
                  : failureNodes
                    ? { opacity: 0.55 }
                    : { opacity: 0.35 }
            }
            transition={
              reducedMotion || !isAnalyzing
                ? { duration: 0.4 }
                : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
            }
            style={{ transformOrigin: "100px 100px" }}
          >
            {[56, 72, 88].map((r) => (
              <circle
                key={r}
                cx="100"
                cy="105"
                r={r}
                fill="none"
                stroke="url(#ringMist)"
                strokeWidth="0.75"
                opacity={0.55}
              />
            ))}
          </motion.g>

          <motion.g
            style={{ transformOrigin: "100px 105px" }}
            animate={
              reducedMotion || !isAnalyzing ? { rotate: 0 } : { rotate: 360 }
            }
            transition={
              isAnalyzing && !reducedMotion
                ? { duration: 3, repeat: Infinity, ease: "linear" }
                : { duration: 0.3 }
            }
          >
            <path
              d="M100 105 L160 105 A60 60 0 0 1 130 155 Z"
              fill="url(#warmCore)"
              opacity={isAnalyzing ? 0.14 : 0}
            />
          </motion.g>

          <path
            d="M62 78 L52 48 L78 62 Z"
            fill="none"
            stroke={idleDim ? "#7c6b8a" : "#D8B4FE"}
            strokeWidth="1.4"
            strokeLinejoin="miter"
            opacity={idleDim ? 0.42 : 0.88}
          />
          <path
            d="M138 78 L148 48 L122 62 Z"
            fill="none"
            stroke={idleDim ? "#7c6b8a" : "#D8B4FE"}
            strokeWidth="1.4"
            strokeLinejoin="miter"
            opacity={idleDim ? 0.42 : 0.88}
          />

          <path
            d="M100 70 C68 70 52 96 52 118 C52 142 72 158 100 158 C128 158 148 142 148 118 C148 96 132 70 100 70 Z"
            fill="none"
            stroke={
              resolvedGlow ? "#D8B4FE" : idleDim ? "#6b5c78" : "#FFC3A1"
            }
            strokeWidth="1.5"
            opacity={idleDim ? 0.48 : 0.95}
            filter={resolvedGlow ? "url(#blurGlow)" : undefined}
          />

          <g
            stroke={whiskersBright ? "#D8B4FE" : "#8b7a96"}
            strokeWidth="1"
            opacity={whiskersBright ? 0.95 : 0.35}
          >
            <path d="M58 118 L24 112" />
            <path d="M58 128 L22 128" />
            <path d="M58 138 L26 144" />
            <path d="M142 118 L176 112" />
            <path d="M142 128 L178 128" />
            <path d="M142 138 L174 144" />
          </g>

          <ellipse
            cx="82"
            cy="108"
            rx="9"
            ry="6"
            fill={eyesCyan ? "#67E8F9" : "#4a3d56"}
            opacity={eyesCyan ? 1 : 0.45}
            filter={eyesCyan ? "url(#eyeGlow)" : undefined}
          />
          <ellipse
            cx="118"
            cy="108"
            rx="9"
            ry="6"
            fill={eyesCyan ? "#67E8F9" : "#4a3d56"}
            opacity={eyesCyan ? 1 : 0.45}
            filter={eyesCyan ? "url(#eyeGlow)" : undefined}
          />
          <ellipse cx="82" cy="108" rx="4" ry="3" fill="#230A33" opacity={0.68} />
          <ellipse cx="118" cy="108" rx="4" ry="3" fill="#230A33" opacity={0.68} />

          <motion.circle
            cx="100"
            cy="124"
            r="5"
            fill="url(#warmCore)"
            animate={{
              opacity: isAnalyzing
                ? reducedMotion
                  ? 0.85
                  : [0.5, 1, 0.55]
                : resolvedGlow
                  ? 0.95
                  : 0.75,
              scale: isAnalyzing && !reducedMotion ? [1, 1.15, 1] : 1,
            }}
            transition={
              isAnalyzing && !reducedMotion
                ? { duration: 1.2, repeat: Infinity }
                : { duration: 0.4 }
            }
          />

          {failureNodes &&
            FAILURE_NODE_COORDS.map((p, idx) => (
              <motion.circle
                key={`${p.cx}-${p.cy}`}
                cx={p.cx}
                cy={p.cy}
                r="5"
                fill="url(#riskGrad)"
                initial={
                  reducedMotion
                    ? { opacity: 0.85, scale: 1 }
                    : { opacity: 0, scale: 0.5 }
                }
                animate={
                  reducedMotion
                    ? { opacity: 0.85, scale: 1 }
                    : { opacity: [0.7, 1, 0.75], scale: [1, 1.1, 1] }
                }
                transition={
                  reducedMotion
                    ? { duration: 0.2 }
                    : {
                        duration: 1.8,
                        repeat: Infinity,
                        delay: idx * 0.15,
                      }
                }
              />
            ))}
        </svg>
      </motion.div>
      <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-mutedGrey">
        {state === "idle" && "Standby"}
        {state === "documentLoaded" && "Signal lock"}
        {state === "scenarioSelected" && "Stress condition armed"}
        {state === "analyzing" && "Decoding operational entropy"}
        {state === "failureDetected" && "Failure field mapped"}
        {state === "resolved" && "Resolution path stable"}
      </div>
    </div>
  );
}

export const FelineSignalEngine = memo(FelineSignalEngineInner);
