import { Context } from "../context/ContextProvider";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { useContext } from "react";

const TextEditor = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error("An error occurred");
  }

  const { text, setText } = context;

  return (
    <div className="editor-container h-full w-full print:hidden bg-white shadow-inner rounded-lg p-2">
      <CodeMirror
        className="text-base h-full min-h-full"
        theme="dark"
        value={text}
        minHeight="100%"
        height="100%"
        extensions={[markdown()]}
        onChange={(value) => setText(value)}
        autoFocus={true}
      />
    </div>
  );
};

export default TextEditor; 