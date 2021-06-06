// import { TailwindComponents as InternalTailwindComponents } from "../tailwind-design-system/TailwindComponents";
// import { HybridStyledTailwindLibrary } from "../styled-component-design-system/HybridStyledTailwindLibrary";
// import { HybridStyledTailwindObject } from "../styled-component-design-system/HybridStyledTailwindObject";
import { Input as TailwindInput } from "../hybrid-design-system/exports/tailwind/Input";
import { Input as StyledComponentsInput } from "../hybrid-design-system/exports/styled-components/Input";
import twConfig from "../hybrid-design-system/tailwind.config";
import defaultTWConfig from "../hybrid-design-system/default-tailwind.config";

import React, { useState } from "react";
import { convertTWtoSCTheme } from "../hybrid-design-system/convertTWtoSCTheme";
import { ThemeProvider } from "styled-components";

export default {
  title: "DesignSystems"
};

// export const TailwindComponents = InternalTailwindComponents;
// export const HybridStyledComponentsWithTWClasses = HybridStyledTailwindLibrary;
// export const HybridStyledComponentsWithCustomObject = HybridStyledTailwindObject;

export const Tailwind = () => {
  const [value, setValue] = useState("");
  return (
    <TailwindInput
      type="text"
      value={value}
      onChange={e => setValue(e.target.value)}
      id="text-input"
      name="text-input"
      labelText="Your Name"
    />
  );
};

export const StyledComponents = () => {
  const [value, setValue] = useState("");
  console.log(convertTWtoSCTheme(defaultTWConfig, twConfig));
  return (
    <ThemeProvider theme={convertTWtoSCTheme(defaultTWConfig, twConfig)}>
      <StyledComponentsInput
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        id="text-input"
        name="text-input"
        labelText="Your Name"
      />
    </ThemeProvider>
  );
};
