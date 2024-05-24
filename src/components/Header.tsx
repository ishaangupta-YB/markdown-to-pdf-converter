import React, { useContext } from "react";
import { Context } from "../context/ContextProvider";

const Header: React.FC = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("An error occurred");
  }

  const { setText } = context;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setText(text);
      };
      reader.readAsText(file);
    }
  };

  const handleFileDownload = () => {
    window.print();
  };

  return (
    <header className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg print:hidden">
      <h1 className="text-3xl font-extrabold">Markdown to PDF</h1>
      <div className="space-x-4">
        <label className="upload-file-btn inline-block px-5 py-2 bg-white text-blue-600 font-semibold hover:bg-gray-100 rounded-lg cursor-pointer transition duration-300 ease-in-out shadow-md">
          Upload File
          <input
            type="file"
            accept=".md"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
        <button
          className="download-pdf-btn px-5 py-2 bg-white text-blue-600 font-semibold hover:bg-gray-100 rounded-lg cursor-pointer transition duration-300 ease-in-out shadow-md"
          onClick={handleFileDownload}
        >
          Download PDF
        </button>
      </div>
    </header>
  );
};

export default Header;
