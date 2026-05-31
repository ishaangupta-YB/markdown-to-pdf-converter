import { useCallback, useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import TextEditor from "./components/TextEditor";
import TextPreview from "./components/TextPreview";
import EditorControls from "./components/EditorControls";

const MIN_PCT = 20;
const MAX_PCT = 80;

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [splitPct, setSplitPct] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isVertical, setIsVertical] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768
  );

  useEffect(() => {
    const onResize = () => setIsVertical(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const raw = isVertical
        ? ((event.clientY - rect.top) / rect.height) * 100
        : ((event.clientX - rect.left) / rect.width) * 100;
      setSplitPct(Math.min(MAX_PCT, Math.max(MIN_PCT, raw)));
    },
    [isVertical]
  );

  const stopDragging = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", stopDragging);
  }, [handlePointerMove]);

  const startDragging = useCallback(
    (event: React.PointerEvent) => {
      event.preventDefault();
      setIsDragging(true);
      document.body.style.cursor = isVertical ? "row-resize" : "col-resize";
      document.body.style.userSelect = "none";
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", stopDragging);
    },
    [handlePointerMove, stopDragging, isVertical]
  );

  const handleKeyResize = useCallback(
    (event: React.KeyboardEvent) => {
      const step = 2;
      const decKey = isVertical ? "ArrowUp" : "ArrowLeft";
      const incKey = isVertical ? "ArrowDown" : "ArrowRight";
      if (event.key === decKey) {
        event.preventDefault();
        setSplitPct((p) => Math.max(MIN_PCT, p - step));
      } else if (event.key === incKey) {
        event.preventDefault();
        setSplitPct((p) => Math.min(MAX_PCT, p + step));
      }
    },
    [isVertical]
  );

  useEffect(() => () => stopDragging(), [stopDragging]);

  const firstSize = `${splitPct}%`;
  const secondSize = `${100 - splitPct}%`;

  return (
    <div className="flex flex-col h-screen max-h-screen min-h-screen overflow-hidden print:h-auto print:max-h-none print:flex print:flex-col bg-paper">
      <Header />

      <div
        ref={containerRef}
        className={`flex flex-grow overflow-hidden print:flex print:flex-col ${
          isVertical ? "flex-col" : "flex-row"
        }`}
      >
        <section
          className="flex flex-col min-h-0 min-w-0 print:hidden overflow-hidden bg-paper-2"
          style={isVertical ? { height: firstSize } : { width: firstSize }}
        >
           
          <div className="flex-grow overflow-auto min-h-0">
            <TextEditor />
          </div>
        </section>

        <button
          type="button"
          aria-label="Resize panels"
          title="Drag to resize"
          onPointerDown={startDragging}
          onKeyDown={handleKeyResize}
          className={`group relative appearance-none m-0 border-0 p-0 shrink-0 print:hidden bg-rule/60 hover:bg-accent/60 outline-none transition-colors focus-visible:bg-accent before:content-[''] before:absolute before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-neutral/50 before:transition-colors hover:before:bg-paper ${
            isDragging ? "bg-accent" : ""
          } ${
            isVertical
              ? "h-1.5 w-full cursor-row-resize before:h-0.5 before:w-10"
              : "w-1.5 h-full cursor-col-resize before:w-0.5 before:h-10"
          }`}
        />

        <section
          className="flex flex-col min-h-0 min-w-0 print:w-full print:h-full overflow-hidden bg-paper"
          style={isVertical ? { height: secondSize } : { width: secondSize }}
        >
          <div className="flex-grow overflow-auto min-h-0 print:h-auto print:overflow-visible">
            <TextPreview />
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
