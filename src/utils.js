export const applyClassName = (baseClass, removeBaseClass, className) =>
  `${!removeBaseClass ? baseClass : ""} ${className || ""}`;
