import {
  createContext,
  FC,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface TextContextProps {
  text: string;
  setText: Dispatch<SetStateAction<string>>;
}

interface ContextProviderProps {
  children: ReactNode;
}

export const Context = createContext<TextContextProps | undefined>(undefined);

export const ContextProvider: FC<ContextProviderProps> = ({ children }) => {
  const [text, setText] = useState<string>(initialText);

  return (
    <Context.Provider value={{ text, setText }}>{children}</Context.Provider>
  );
};
const initialText = `# Markdown to PDF Converter

> Transform your Markdown files into stunning PDFs effortlessly!
\`\`\`diff
- Concerned about privacy when uploading files online?
+ Use our secure, offline web application instead!
\`\`\`

## How to Use the Markdown to PDF Converter?
1. Click the **Upload File** button to select a \`.md\` file.
2. Edit your content in the left-hand panel with real-time preview.
3. Click the **Download PDF** button!
4. Set 'Destination' to **Save as PDF**.
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
