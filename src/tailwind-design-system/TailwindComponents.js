import { Button } from "./components/Button";
import React, { useState } from "react";
import "./tailwind.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { coldarkDark as codeSyntaxTheme } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { Input } from "./components/Input";

const GridSpacer = () => <div className="col-span-2 h-16" />;

export const TailwindComponents = () => {
  const [inputValue, setInputValue] = useState("");
  return (
    <div className="twoColumnGrid">
      {/*Start*/}
      <h1 className="col-span-2"> Defaults (no modifications) </h1>
      <div className="h-full flex items-center">
        <Button>Submit</Button>
      </div>
      <SyntaxHighlighter
        language="javascript"
        style={codeSyntaxTheme}
        wrapLines={true}
        wrapLongLines={true}
      >
        {`<Button>Submit</Button>`}
      </SyntaxHighlighter>
      <GridSpacer />
      {/*End*/}
      {/*Start*/}
      <h1 className="col-span-2"> Cascading a one-off style </h1>
      <div className="container flex gap-4">
        <Button className="h-32 bg-ugly-500">Submit</Button>
      </div>
      <SyntaxHighlighter
        language="javascript"
        style={codeSyntaxTheme}
        wrapLines={true}
        wrapLongLines={true}
      >
        {`<Button className="h-32">Submit</Button>`}
      </SyntaxHighlighter>
      <GridSpacer />
      {/*End*/}
      {/*Start*/}
      <h1 className="col-span-2"> Cascading a new abstraction </h1>
      <div className="container flex gap-4">
        <Button className="btn-primary">Submit</Button>
      </div>
      <SyntaxHighlighter
        language="javascript"
        style={codeSyntaxTheme}
        wrapLines={true}
        wrapLongLines={true}
      >
        {`<Button className="btn-primary">Submit</Button>`}
      </SyntaxHighlighter>
      <GridSpacer />
      {/*End*/}
      {/*Start*/}
      <h1 className="col-span-2"> Overriding all existing styles </h1>
      <div className="container flex gap-4">
        <Button className="btn-primary" removeBaseClass>
          Submit
        </Button>
      </div>
      <SyntaxHighlighter
        language="javascript"
        style={codeSyntaxTheme}
        wrapLines={true}
        wrapLongLines={true}
      >
        {`<Button className="btn-primary" removeBaseClass>Submit</Button>`}
      </SyntaxHighlighter>
      <GridSpacer />
      {/*End*/}
      {/*Start*/}
      <h1 className="col-span-2"> Multiple renders - no customizations </h1>
      <div className="container flex gap-4">
        <Input
          labelText="First Name"
          value={inputValue}
          onChange={event => setInputValue(event.target.value)}
          id="fname"
          name="fname"
          type="text"
          className="input-text"
          // error="Enter your first name"
        />
      </div>
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
        <Input
          render={(
            InputWrapper,
            InputElement,
            InputLabel,
            InputError,
            someInternalStuff
          ) => (
            <div className="flex flex-col">
              <InputElement
                name="fname"
                id="fname"
                type="text"
                className="input-text"
                value={inputValue}
                onChange={event => setInputValue(event.target.value)}
              />
              <label className="text-blue-500" htmlFor="fname">
                {" "}
                First Name{" "}
              </label>
            </div>
          )}
        />
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
  ) => (
    <div className="flex flex-col">
      <InputElement
        name="fname"
        id="fname"
        type="text"
        className="input-text"
        value={inputValue}
        onChange={event => setInputValue(event.target.value)}
      />
      <label className="text-blue-500" htmlFor="fname"> First Name </label>
    </div>
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
      <div className="container flex gap-4"></div>
      <SyntaxHighlighter
        language="javascript"
        style={codeSyntaxTheme}
        wrapLines={true}
        wrapLongLines={true}
      >
        {`<Input>
  <Input.Label htmlFor="fname"></Input.Label>
  <Input.Element 
    name="fname"
    id="fname"
    type="text"
    className="input-text"
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
}
<Input invalid={isInvalid} />`}
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
          Changing the tokens that your app's version of{" "}
          <code>.btn</code> uses
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
        <p>
          While there is no vanilla way to do this, you can use Sass.
        </p>
      </div>
      <SyntaxHighlighter
        language="javascript"
        style={codeSyntaxTheme}
        wrapLines={true}
        wrapLongLines={true}
      >
        {`.app-btn {
  @extend .btn;
  @apply px-4 py-2 ..etc;
}`}
      </SyntaxHighlighter>
      <GridSpacer />
      {/*End*/}
    </div>
  );
};
