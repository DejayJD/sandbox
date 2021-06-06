import React from "react";

/**
 *
 * @param className
 * @param children
 * @param icon
 * @param iconPosition
 * @param removeBaseClass
 * @returns {*}
 * @constructor
 */
export const Button = ({
  className,
  children,
  icon,
  iconPosition = "left",
  removeBaseClass = false
}) => {
  return (
    <button className={`${!removeBaseClass ? "btn" : ""} ${className}`}>
      {icon && iconPosition === "left" && icon}
      {children}
      {icon && iconPosition === "right" && icon}
    </button>
  );
};
