import colors from "tailwindcss/colors";

const tokenValues = {
  spacing: {
    p1: "0.5rem",
    p2: "1rem",
    p4: "2rem"
  },
  height: {
    "16": "6rem",
    "32": "8rem"
  },
  colors
};

const shadeRange = [100, 200, 300, 400, 500, 600, 700];

const titleCase = string => string.charAt(0).toUpperCase() + string.slice(1);

const makeBackgroundColorRule = (colorKey, shade, colorValue) => ({
  [`bg${titleCase(colorKey)}${shade}`]: `background-color: ${colorValue};`
});

const makeTextColorRule = (colorKey, shade, colorValue) => ({
  [`text${titleCase(colorKey)}${shade}`]: `color: ${colorValue};`
});

const makeRingColorRUle = (colorKey, shade, colorValue) => ({
  [`ring${titleCase(
    colorKey
  )}${shade}`]: `ring-opacity:1; ring-color: ${colorValue};`
});

const generateColorRules = (colorKey, colorTokenValue, shade = "") => ({
  ...makeBackgroundColorRule(colorKey, shade, colorTokenValue),
  ...makeTextColorRule(colorKey, shade, colorTokenValue),
  ...makeRingColorRUle(colorKey, shade, colorTokenValue)
});

const generateColorShadeRules = (colorKey, colorThemeName) => {
  return shadeRange.reduce((acc, shade) => {
    const colorTokenValue = tokenValues.colors[colorThemeName][shade];
    return {
      ...acc,
      ...generateColorRules(colorKey, colorTokenValue, shade)
    };
  }, {});
};

const makePaddingRules = paddingKey => {
  const paddingKeyNumber = paddingKey.replace(/\w/, "");
  return {
    [`p${paddingKeyNumber}`]: `padding: ${tokenValues.spacing[paddingKey]}`,
    [`px${paddingKeyNumber}`]: `padding-left: ${tokenValues.spacing[paddingKey]};\n padding-right: ${tokenValues.spacing[paddingKey]};`,
    [`py${paddingKeyNumber}`]: `padding-top: ${tokenValues.spacing[paddingKey]};\n padding-bottom: ${tokenValues.spacing[paddingKey]};`
  };
};

export const tokens = {
  //Padding
  ...Object.keys(tokenValues.spacing).reduce(
    (acc, key) => ({ ...acc, ...makePaddingRules(key) }),
    {}
  ),
  //Height
  h16: `height: ${tokenValues.height["16"]};`,
  h32: `height: ${tokenValues.height["32"]};`,
  //Colors
  ...generateColorShadeRules("gray", "coolGray"),
  ...generateColorShadeRules("blue", "lightBlue"),
  ...generateColorShadeRules("red", "rose"),
  ...generateColorShadeRules("pink", "fuchsia"),
  ...generateColorRules("white", "white")
};
