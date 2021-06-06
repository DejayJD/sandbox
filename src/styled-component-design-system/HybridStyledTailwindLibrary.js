import { Button as TWButton } from "../tailwind-design-system/components/Button";
import { tokens } from "./tokens";
import styled from "styled-components";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark as codeSyntaxTheme } from "react-syntax-highlighter/dist/esm/styles/prism";
import React from "react";
import styledTW from "tailwind-styled-components";

const GridSpacer = styled.div`
  h-16
`;

export const HybridStyledTailwindLibrary = () => {
  return (
    <div className="twoColumnGrid">
      {/*Start*/}
      <h1 className="col-span-2">
        Making use of{" "}
        <a href="https://www.npmjs.com/package/tailwind-styled-components" className="underline text-blue-400">
          tailwind-styled-components{" "}
        </a>
        to preserve TW token names
      </h1>
      <h1 className="col-span-2"> Defaults (no modifications) </h1>
      <div className="h-full flex items-center">
        <TWButton>Submit</TWButton>
      </div>
      <SyntaxHighlighter
        language="javascript"
        style={codeSyntaxTheme}
        wrapLines={true}
        wrapLongLines={true}
      >
        {`<Button>Submit</Button>`}
      </SyntaxHighlighter>
      {/*End*/}
      <GridSpacer />
      {/*Start*/}
      <h1 className="col-span-2"> Cascading a one-off style </h1>
      <div className="h-full flex items-center"></div>
      <SyntaxHighlighter
        language="javascript"
        style={codeSyntaxTheme}
        wrapLines={true}
        wrapLongLines={true}
      >
        {`const OneOffTWButton = styledTW(Button)\`
  h-32
\`;
<OneOffTWButton> Submit </OneOffTWButton>`}
      </SyntaxHighlighter>
      {/*End*/}
      <GridSpacer />
      {/*Start*/}
      <h1 className="col-span-2"> Cascading a new abstraction </h1>
      <div className="h-full flex items-center"></div>
      <SyntaxHighlighter
        language="javascript"
        style={codeSyntaxTheme}
        wrapLines={true}
        wrapLongLines={true}
      >
        {`const PrimaryButton = styledTW(TWButton)\`
  bg-blue-400
  text-white
  focus:ring-blue-400
  focus:bg-blue-400
  hover:bg-blue-700
\`;
<PrimaryButton> Submit </PrimaryButton>
`}
      </SyntaxHighlighter>
      {/*End*/}
      <GridSpacer />
      {/*Start*/}
      <h1 className="col-span-2"> Overriding existing styles </h1>
      <div className="h-full flex items-center"></div>
      <SyntaxHighlighter
        language="javascript"
        style={codeSyntaxTheme}
        wrapLines={true}
        wrapLongLines={true}
      >
        {`<PrimaryButton removeBaseClass> Submit </PrimaryButton>`}
      </SyntaxHighlighter>
      {/*End*/}

      <GridSpacer />
    </div>
  );
};
