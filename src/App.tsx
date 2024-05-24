import Header from "./components/Header";
import TextEditor from "./components/TextEditor";
import TextPreview from "./components/TextPreview";
function App() {
  return (
    <div className="flex flex-col h-screen max-h-screen min-h-screen overflow-hidden print:h-auto print:max-h-none print:flex print:flex-col bg-gray-100">
      <Header />
      <br />
      <div className="flex flex-grow overflow-hidden print:flex print:flex-col">
        <div className="w-1/2 h-full overflow-auto border-r print:hidden">
          <TextEditor />
        </div>
        <div className="w-1/2 h-full overflow-auto print:w-full print:h-full">
          <TextPreview />
        </div>
      </div>
    </div>
  );
}
export default App;
