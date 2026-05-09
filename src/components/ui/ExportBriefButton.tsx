import { useState } from "react";
import { FileDown } from "lucide-react";
import { GlowButton } from "./GlowButton";

type ExportBriefButtonProps = {
  onExport: () => void;
  className?: string;
};

export function ExportBriefButton({
  onExport,
  className = "",
}: ExportBriefButtonProps) {
  const [done, setDone] = useState(false);

  function handleClick() {
    onExport();
    setDone(true);
    window.setTimeout(() => setDone(false), 1500);
  }

  return (
    <GlowButton
      variant="ghost"
      type="button"
      onClick={handleClick}
      className={["text-sm", className].join(" ")}
    >
      <FileDown className="h-4 w-4" />
      {done ? "Brief Generated" : "Generate Executive Brief"}
    </GlowButton>
  );
}
