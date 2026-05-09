import { AnimatePresence, motion } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { DemoProvider } from "./context/DemoContext";
import { AppShell } from "./components/layout/AppShell";
import { FailureMap } from "./pages/FailureMap";
import { FixPlan } from "./pages/FixPlan";
import { ScenarioSimulator } from "./pages/ScenarioSimulator";

export default function App() {
  const location = useLocation();

  return (
    <DemoProvider>
      <div className="cinematic-bg">
        <div className="noise-overlay" aria-hidden />
        <AppShell>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="min-h-full"
            >
              <Routes location={location}>
                <Route path="/" element={<ScenarioSimulator />} />
                <Route path="/failure-map" element={<FailureMap />} />
                <Route path="/fix-plan" element={<FixPlan />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </AppShell>
      </div>
    </DemoProvider>
  );
}
