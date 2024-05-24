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
    return <p>Loading...</p>;
  } 

  return (
    <div className="preview overflow-auto p-2 bg-white shadow-inner rounded-lg">
      <MarkdownPreview
        wrapperElement={{
          "data-color-mode": "light",
        }}
        source={text}
      />
    </div>
  );
};

export default TextPreview;
