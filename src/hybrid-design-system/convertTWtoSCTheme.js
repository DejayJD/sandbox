import merge from "lodash/merge";
import omit from "lodash/omit";

export const convertTWtoSCTheme = (baseTheme, themeObject) => ({
  ...baseTheme.theme,
  ...merge(baseTheme.theme, themeObject.extends),
  ...omit(themeObject.theme, "extends")
});
