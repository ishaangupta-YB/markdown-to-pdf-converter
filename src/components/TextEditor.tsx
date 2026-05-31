import { Context } from "../context/ContextProvider";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { useContext, useMemo } from "react";
import { buildEditorTheme } from "./editorTheme";

const TextEditor = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error("An error occurred");
  }

  const { text, setText, editorFont, editorColor } = context;

  const extensions = useMemo(
    () => [markdown(), buildEditorTheme(editorFont, editorColor)],
    [editorFont, editorColor]
  );

  return (
    <div className="editor-container h-full w-full print:hidden bg-paper-2 select-text flex flex-col">
      <CodeMirror
        className="text-sm h-full min-h-full flex-grow focus:outline-none"
        value={text}
        minHeight="100%"
        height="100%"
        extensions={extensions}
        onChange={(value) => setText(value)}
        autoFocus={true}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
          foldGutter: false,
        }}
      />
    </div>
  );
};

export default TextEditor;