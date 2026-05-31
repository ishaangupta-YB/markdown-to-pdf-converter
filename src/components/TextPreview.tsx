import { useContext } from "react";
import { Context } from "../context/ContextProvider";
import MarkdownPreview from "@uiw/react-markdown-preview";

const TextPreview = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error("An error occurred");
  }

  const { text } = context;

  if (!text) {
    return (
      <div className="flex items-center justify-center h-full text-muted font-mono text-xs uppercase tracking-wider bg-paper-2">
        Awaiting input…
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-auto bg-paper p-6 md:p-12 select-none print:bg-white print:p-0">
      <div className="preview-to-print bg-white border border-rule shadow-md shadow-neutral/5 w-full max-w-[210mm] mx-auto min-h-[297mm] p-12 md:p-16 select-text flex flex-col rounded">
        <MarkdownPreview
          wrapperElement={{
            "data-color-mode": "light",
          }}
          source={text}
        />
      </div>
    </div>
  );
};

export default TextPreview;
