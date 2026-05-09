import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        backgroundBase: "#16051F",
        deepPlum: "#230A33",
        aubergine: "#35104A",
        sunsetCoral: "#FF7A5C",
        solarOrange: "#FF9F43",
        peachGlow: "#FFC3A1",
        fluxPink: "#F472D0",
        magentaViolet: "#B45CFF",
        softLavender: "#D8B4FE",
        creamWhite: "#FFF7ED",
        warmMutedText: "#E9D5C8",
        warmGlass: "rgba(42, 15, 48, 0.58)",
        warmGlassSoft: "rgba(255, 195, 161, 0.08)",
        warmBorder: "rgba(255, 195, 161, 0.22)",
        signalCyan: "#67E8F9",
        void: "#16051F",
        graphite: "#230A33",
        graphiteSoft: "#35104A",
        softInk: "#230A33",
        panelInk: "rgba(35, 10, 51, 0.52)",
        glassBorder: "rgba(255, 195, 161, 0.22)",
        glassLight: "rgba(255, 247, 237, 0.08)",
        softWhite: "#FFF7ED",
        mutedGrey: "#E9D5C8",
        mutedText: "#E9D5C8",
        electricCyan: "#67E8F9",
        atmosphereCyan: "#D8B4FE",
        skyTeal: "#B45CFF",
        mistBlue: "#FFC3A1",
        signalBlue: "#B45CFF",
        fluxViolet: "#F472D0",
        riskAmber: "#FF9F43",
        criticalRed: "#FF7A5C",
        deepViolet: "#35104A",
      },
      fontFamily: {
        display: [
          '"Space Grotesk"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: [
          '"JetBrains Mono"',
          "ui-monospace",
          "SFMono-Regular",
          "monospace",
        ],
      },
      boxShadow: {
        glowCyan:
          "0 0 52px rgba(255, 122, 92, 0.22), 0 0 100px rgba(255, 195, 161, 0.08)",
        glowBlue:
          "0 0 56px rgba(180, 92, 255, 0.26), 0 0 96px rgba(244, 114, 208, 0.12)",
        glowViolet:
          "0 0 48px rgba(244, 114, 208, 0.28), 0 0 88px rgba(180, 92, 255, 0.14)",
        glowCoral:
          "0 0 52px rgba(255, 122, 92, 0.38), 0 0 92px rgba(255, 159, 67, 0.2)",
        glowWarm:
          "0 0 48px rgba(255, 159, 67, 0.2), 0 0 110px rgba(244, 114, 208, 0.14)",
        glowMagenta:
          "0 0 52px rgba(244, 114, 208, 0.32), 0 0 96px rgba(180, 92, 255, 0.18)",
        panel:
          "0 0 0 1px rgba(255, 195, 161, 0.14), 0 28px 90px rgba(22, 4, 31, 0.48), 0 0 90px rgba(244, 114, 208, 0.07)",
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to right, rgba(216,180,254,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,195,161,0.06) 1px, transparent 1px)",
        "cta-primary":
          "linear-gradient(135deg, #FF7A5C 0%, #F472D0 48%, #B45CFF 100%)",
        "cta-warm":
          "linear-gradient(115deg, #FF7A5C 0%, #FF9F43 38%, #F472D0 100%)",
        "nav-active":
          "linear-gradient(90deg, rgba(244,114,208,0.14) 0%, rgba(255,122,92,0.12) 42%, rgba(180,92,255,0.14) 100%)",
      },
      animation: {
        "pulse-slow": "pulseGlow 4s ease-in-out infinite",
        scan: "scanLine 3s linear infinite",
        drift: "particleDrift 8s ease-in-out infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.45", filter: "blur(0px)" },
          "50%": { opacity: "1", filter: "blur(1px)" },
        },
        scanLine: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        particleDrift: {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "50%": { transform: "translate(4px,-6px) scale(1.05)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
