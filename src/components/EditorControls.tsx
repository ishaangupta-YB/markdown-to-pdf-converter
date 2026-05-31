import { useContext } from "react";
import { Context, EDITOR_FONTS } from "../context/ContextProvider";

const EditorControls = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error("An error occurred");
  }

  const { editorFont, setEditorFont, editorColor, setEditorColor } = context;

  return (
    <div className="flex items-center gap-3 select-none">
      <label className="flex items-center gap-1.5">
        <span className="font-mono text-[9px] tracking-widest text-neutral uppercase">
          Font
        </span>
        <select
          value={editorFont}
          onChange={(e) => setEditorFont(e.target.value)}
          className="font-mono text-[11px] text-ink bg-paper border border-rule rounded px-2 py-1 cursor-pointer hover:border-accent focus:border-accent focus:outline-none transition-colors"
          aria-label="Editor font family"
        >
          {EDITOR_FONTS.map((font) => (
            <option key={font.label} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-1.5">
        <span className="font-mono text-[9px] tracking-widest text-neutral uppercase">
          Color
        </span>
        <span className="relative inline-flex items-center justify-center size-6 rounded border border-rule overflow-hidden hover:border-accent transition-colors">
          <input
            type="color"
            value={editorColor}
            onChange={(e) => setEditorColor(e.target.value)}
            className="absolute inset-0 size-8 -translate-x-1 -translate-y-1 cursor-pointer border-0 bg-transparent p-0"
            aria-label="Editor text color"
          />
        </span>
      </label>
    </div>
  );
};

export default EditorControls;
