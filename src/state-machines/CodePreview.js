import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark as codeSyntaxTheme } from "react-syntax-highlighter/dist/esm/styles/prism";


// TODO: figure out how to show the code in here inside of Storybook
export const CodePreview = ({ code }) => (
  <SyntaxHighlighter
    language={"javascript"}
    style={codeSyntaxTheme}
    wrapLines={true}
    wrapLongLines={true}
  >
    {code}
  </SyntaxHighlighter>
);
