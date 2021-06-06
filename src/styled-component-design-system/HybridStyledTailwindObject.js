import { Button as TWButton } from "../tailwind-design-system/components/Button";
import { tokens } from "./tokens";
import styled from "styled-components";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark as codeSyntaxTheme } from "react-syntax-highlighter/dist/esm/styles/prism";
import React from "react";
import { Input } from "../tailwind-design-system/components/Input";

const GridSpacer = styled.div`
  ${tokens.h16};
`;

export const OneOffTWButton = styled(TWButton)`
  ${tokens.h32};
`;

export const PrimaryButton = styled(TWButton)`
  ${tokens.bgBlue400}
  ${tokens.textWhite}
  &:focus {
    ${tokens.ringBlue400}
    ${tokens.bgBlue600}
  }
  &:hover {
    ${tokens.bgBlue700}
  }
`;

export const HybridStyledTailwindObject = () => {
  return (
    <div className="twoColumnGrid">
      {/*Start*/}
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
      <div className="h-full flex items-center">
        <OneOffTWButton> Submit </OneOffTWButton>
      </div>
      <SyntaxHighlighter
        language="javascript"
        style={codeSyntaxTheme}
        wrapLines={true}
        wrapLongLines={true}
      >
        {`const OneOffTWButton = styled(Button)\`
  \${tokens.h32};
\`;
<OneOffTWButton> Submit </OneOffTWButton>

// OR - if using the Babel Plugin, there is no need to make a new component due to the added css prop 

<Button css={\`
  \${tokens.h32}
\`}> 
  Submit 
</Button>
`}
      </SyntaxHighlighter>
      {/*End*/}
      <GridSpacer />
      {/*Start*/}
      <h1 className="col-span-2"> Cascading a new abstraction </h1>
      <div className="h-full flex items-center">
        <PrimaryButton> Submit </PrimaryButton>
      </div>
      <SyntaxHighlighter
        language="javascript"
        style={codeSyntaxTheme}
        wrapLines={true}
        wrapLongLines={true}
      >
        {`const PrimaryButton = styled(TWButton)\`
  \${tokens.bgBlue400}
  \${tokens.textWhite}
  &:focus {
    \${tokens.ringBlue400}
    \${tokens.bgBlue600}
  }
  &:hover {
    \${tokens.bgBlue700}
  }
\`;
<PrimaryButton> Submit </PrimaryButton>
`}
      </SyntaxHighlighter>
      {/*End*/}
      <GridSpacer />
      {/*Start*/}
      <h1 className="col-span-2"> Overriding existing styles </h1>
      <div className="h-full flex items-center">
        <PrimaryButton removeBaseClass> Submit </PrimaryButton>
      </div>
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
      {/*Start*/}
      <h1 className="col-span-2"> Multiple renders - no customizations </h1>
      <div className="container flex gap-4"></div>
      <SyntaxHighlighter
        language="javascript"
        style={codeSyntaxTheme}
        wrapLines={true}
        wrapLongLines={true}
      >
        {`<Input
  labelText="First Name"
  value={inputValue}
  onChange={event => setInputValue(event.target.value)}
  id="fname"
  name="fname"
  type="text"
  className="input-text"
/>`}
      </SyntaxHighlighter>
      <GridSpacer />
      {/*End*/}
      {/*Start*/}
      <h1 className="col-span-2">
        {" "}
        Multiple renders - customized - Method 1: Render Prop
      </h1>
      <div className="container flex gap-4">
        <p>
          {" "}
          This one doesn't really work in the context of styled-components
          because you would have to remake a styled component inside the render
          loop with no way to memoize it - so it's not feasible.
        </p>
      </div>
      <SyntaxHighlighter
        language="javascript"
        style={codeSyntaxTheme}
        wrapLines={true}
        wrapLongLines={true}
      >
        {`<Input
  render={(
    InputWrapper,
    InputElement,
    InputLabel,
    InputError,
    someInternalStuff
  ) => {
    const Wrapper = styled.div\`
        display: flex;
        flex-direction: column;
    \`;
    return (
      <Wrapper>
        <InputElement
          name="fname"
          id="fname"
          type="text"
          value={inputValue}
          onChange={event => setInputValue(event.target.value)}
        />
        <InputLabel htmlFor="fname"> First Name </InputLabel>
      </Wrapper>
  )}
/>`}
      </SyntaxHighlighter>
      <GridSpacer />
      {/*End*/}
      {/*Start*/}
      <h1 className="col-span-2">
        {" "}
        Multiple renders - customized - Method 2: Compound Component
      </h1>
      <div className="container flex gap-4">
        <p>
          This one works the best with styled-components because the static
          imports can be statically wrapped
        </p>
      </div>
      <SyntaxHighlighter
        language="javascript"
        style={codeSyntaxTheme}
        wrapLines={true}
        wrapLongLines={true}
      >
        {`
const StyledInputLabel = styled(Input.Label)\`
  ...styling
\`;
<Input>
  <StyledInputLabel htmlFor="fname"></StyledInputLabel>
  <Input.Element 
    name="fname"
    id="fname"
    type="text"
    value={inputValue}
    onChange={event => setInputValue(event.target.value)}
  />
  {error && <Input.Error>{error}</Input.Error>}
</Input>`}
      </SyntaxHighlighter>
      <GridSpacer />
      {/*End*/}
      {/*Start*/}
      <h1 className="col-span-2">
        {" "}
        Multiple renders - customized - Method 3: Hook
      </h1>
      <div className="container flex gap-4"></div>
      <SyntaxHighlighter
        language="javascript"
        style={codeSyntaxTheme}
        wrapLines={true}
        wrapLongLines={true}
      >
        {`const {
  InputWrapper,
  InputElement,
  InputLabel,
  InputError,
  someInternalStuff
} = useInput();
return (
  <InputWrapper className="flex flex-col">
    <InputElement
      name="fname"
      id="fname"
      type="text"
      className="input-text"
      value={inputValue}
      onChange={event => setInputValue(event.target.value)}
    />
    <InputLabel className="text-blue-500" htmlFor="fname"> First Name </InputLabel>
    {error && <InputError>{error}</InputError>}
  </InputWrapper>
)`}
      </SyntaxHighlighter>
      <GridSpacer />
      {/*End*/}
      {/*Start*/}
      <h1 className="col-span-2">Variants/Meta States - Custom DOM props</h1>
      <div className="container flex gap-4"> </div>
      <SyntaxHighlighter
        language="javascript"
        style={codeSyntaxTheme}
        wrapLines={true}
        wrapLongLines={true}
      >
        {`.input {
  &[invalid] {
    @apply border-red-500;
  }
}`}
      </SyntaxHighlighter>
      <GridSpacer />
      {/*End*/}
      {/*Start*/}
      <h1 className="col-span-2">Variants/Meta States - Custom Variants</h1>
      <div className="container flex gap-4"> </div>
      <SyntaxHighlighter
        language="javascript"
        style={codeSyntaxTheme}
        wrapLines={true}
        wrapLongLines={true}
      >
        {``}
      </SyntaxHighlighter>
      <GridSpacer />
      {/*End*/}
      {/*Start*/}
      <h1 className="col-span-2">
        Changing The Tokens - Overriding an abstraction
      </h1>
      <div className="container flex gap-4"></div>
      <SyntaxHighlighter
        language="javascript"
        style={codeSyntaxTheme}
        wrapLines={true}
        wrapLongLines={true}
      >
        {`.btn {
  @apply p-4;
}`}
      </SyntaxHighlighter>
      <GridSpacer />
      {/*End*/}
      {/*Start*/}
      <h1 className="col-span-2">
        Changing The Tokens - Context-based changes
      </h1>
      <div className="container flex gap-4">
        {" "}
        This is probably impossible with Tailwind
      </div>
      <SyntaxHighlighter
        language="javascript"
        style={codeSyntaxTheme}
        wrapLines={true}
        wrapLongLines={true}
      >
        {``}
      </SyntaxHighlighter>
      <GridSpacer />
      {/*End*/}
      {/*Start*/}
      <h1 className="col-span-2">Global Changes - Token Config Changes</h1>
      <div className="container flex gap-4"></div>
      <SyntaxHighlighter
        language="javascript"
        style={codeSyntaxTheme}
        wrapLines={true}
        wrapLongLines={true}
      >
        {`module.exports = {
  theme: {
    colors: {
      gray: colors.coolGray,

...etc`}
      </SyntaxHighlighter>
      <GridSpacer />
      {/*End*/}
      {/*Start*/}
      <h1 className="col-span-2">Global Changes - Abstraction Overrides</h1>
      <div className="container flex gap-4">
        {" "}
        <p>
          Changing the tokens that your app's version of <code>.btn</code> uses
        </p>
      </div>
      <SyntaxHighlighter
        language="javascript"
        style={codeSyntaxTheme}
        wrapLines={true}
        wrapLongLines={true}
      >
        {`.btn {
  @apply px-4 py-2 ...etc;
}`}
      </SyntaxHighlighter>
      <GridSpacer />
      {/*End*/}
      {/*Start*/}
      <h1 className="col-span-2">Global Changes - Abstraction Cascading</h1>
      <div className="container flex gap-4">
        <p>Again have to </p>
      </div>
      <SyntaxHighlighter
        language="javascript"
        style={codeSyntaxTheme}
        wrapLines={true}
        wrapLongLines={true}
      >
        {`const AppButton = styled(Button)\`
  \${tokens.px4}
  \${tokens.py2}
\` `}
      </SyntaxHighlighter>
      <GridSpacer />
      {/*End*/}
    </div>
  );
};
