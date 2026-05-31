import React, { useContext, useState } from "react";
import { Context } from "../context/ContextProvider";

const handleFileDownload = () => {
  window.print();
};

const Header: React.FC = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("An error occurred");
  }

  const { setText } = context;
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setText(text);
      };
      reader.readAsText(file);
    }
  };

  const handlePdfImport = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError(null);
    setIsConverting(true);
    try {
      const { pdfToMarkdown } = await import("../utils/pdfToMarkdown");
      const result = await pdfToMarkdown(file);
      if (!result.hadText) {
        setError("No selectable text found — the PDF may be scanned images.");
        return;
      }
      const heading = `# ${file.name.replace(/\.pdf$/i, "")}\n\n`;
      setText(heading + result.markdown);
    } catch (err) {
      console.error("PDF conversion failed:", err);
      setError("Could not convert this PDF. Please try another file.");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <header className="flex flex-wrap items-center justify-between gap-y-3 px-5 sm:px-8 py-4 border-b-[4px] border-double border-rule bg-paper text-ink print:hidden select-none">
      <div className="flex items-baseline gap-3 sm:gap-4">
        <h1 className="text-2xl sm:text-3xl font-semibold italic font-display tracking-tight select-none">
          Markdown to PDF
        </h1>
        <span className="hidden sm:inline-block font-mono text-[9px] tracking-widest text-neutral border border-rule px-2 py-0.5 rounded bg-paper-2 font-medium">
          Built in 2022
        </span>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <a
          href="https://github.com/ishaangupta-YB/markdown-to-pdf-converter"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 font-mono text-xs text-muted hover:text-accent transition-colors duration-200 border-b border-transparent hover:border-accent pb-0.5"
        >
          <svg
            className="size-4 fill-current"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.85.54 1.71 0 1.24-.01 2.23-.01 2.53 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          <span className="hidden md:inline font-semibold">Source Code</span>
        </a>

        <div className="flex items-center gap-2 sm:gap-3">
          <label
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 border font-mono text-xs tracking-wider uppercase rounded transition-all duration-200 shadow-sm select-none ${
              isConverting
                ? "border-rule text-neutral bg-paper-2 cursor-wait"
                : "border-rule hover:border-accent text-ink hover:text-accent bg-paper-2 hover:shadow cursor-pointer"
            }`}
          >
            {isConverting ? (
              <svg
                className="size-3.5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
                />
              </svg>
            ) : (
              <svg
                className="size-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 13h6m-6 4h4"
                />
              </svg>
            )}
            <span className="font-semibold hidden sm:inline">
              {isConverting ? "Converting…" : "PDF to MD"}
            </span>
            <input
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handlePdfImport}
              disabled={isConverting}
            />
          </label>

          <label className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-rule hover:border-accent text-ink hover:text-accent font-mono text-xs tracking-wider uppercase bg-paper-2 rounded transition-all duration-200 shadow-sm hover:shadow cursor-pointer select-none">
            <svg
              className="size-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            <span className="font-semibold hidden sm:inline">Upload md</span>
            <input
              type="file"
              accept=".md,.markdown,.txt"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>

          <button
            type="button"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-ink hover:bg-accent text-paper font-mono text-xs tracking-wider uppercase border border-ink hover:border-accent rounded transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer select-none"
            onClick={handleFileDownload}
          >
            <svg
              className="size-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            <span className="font-semibold hidden sm:inline">Print PDF</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="w-full">
          <p
            role="alert"
            className="font-mono text-[11px] text-paper bg-[oklch(52%_0.17_28)] px-3 py-1.5 rounded inline-flex items-center gap-2"
          >
            <svg
              className="size-3.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </p>
        </div>
      )}
    </header>
  );
};

export default Header;
