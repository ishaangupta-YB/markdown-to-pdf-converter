import {
  createContext,
  FC,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useMemo,
} from "react";

interface TextContextProps {
  text: string;
  setText: Dispatch<SetStateAction<string>>;
  editorFont: string;
  setEditorFont: Dispatch<SetStateAction<string>>;
  editorColor: string;
  setEditorColor: Dispatch<SetStateAction<string>>;
}

interface ContextProviderProps {
  children: ReactNode;
}

export const EDITOR_FONTS = [
  { label: "Geist Mono", value: '"Geist Mono", monospace' },
  { label: "JetBrains Mono", value: '"JetBrains Mono", monospace' },
  { label: "Geist Sans", value: '"Geist", system-ui, sans-serif' },
  { label: "Instrument Serif", value: '"Instrument Serif", Georgia, serif' },
  { label: "Fraunces", value: '"Fraunces", Georgia, serif' },
] as const;

export const Context = createContext<TextContextProps | undefined>(undefined);

export const ContextProvider: FC<ContextProviderProps> = ({ children }) => {
  const [text, setText] = useState<string>(initialText);
  const [editorFont, setEditorFont] = useState<string>(EDITOR_FONTS[0].value);
  const [editorColor, setEditorColor] = useState<string>("#1b1a17");

  const contextValue = useMemo(
    () => ({
      text,
      setText,
      editorFont,
      setEditorFont,
      editorColor,
      setEditorColor,
    }),
    [text, editorFont, editorColor]
  );

  return (
    <Context.Provider value={contextValue}>{children}</Context.Provider>
  );
};
const initialText = `# Markdown to PDF Converter

> Transform your Markdown files into stunning PDFs effortlessly!
\`\`\`diff
- Concerned about privacy when uploading files online?
+ Use our secure, offline web application instead!
\`\`\`

## How to Use the Markdown to PDF Converter?
1. Click the **Upload** button to select a \`.md\` file.
2. Edit your content in the left-hand panel with real-time preview.
3. Click the **Print PDF** button!
4. Set “Destination” to **Save as PDF**.
5. **For best results, use Chrome**.

## Key Features
- Real-time Markdown preview for instant feedback.
- No need to upload files to a server, everything happens locally.
- Supports HTML tags for advanced styling.
<blockquote>Transform your content with beautiful formatting!</blockquote>

## About Me
- GitHub: [@ishaangupta-YB](https://github.com/ishaangupta-YB)
- Project: Markdown to PDF Converter

## Example Code Snippets
\`\`\`javascript
// Example: app.js
function welcomeMessage() {
  console.log('Welcome to the Markdown to PDF Converter!');
}
welcomeMessage();
\`\`\`

Or in Python:

\`\`\`python
# Sample: main.py
def greet():
    print('Welcome to this amazing tool!')
greet()
\`\`\`

Get started now and enjoy seamless Markdown to PDF conversion!
`;
