import { applyClassName } from "../../utils";
import React, { useEffect, useState } from "react";

// Wrapper container
export const InputWrapper = ({ children, className, removeBaseClass }) => (
  <div className={`${!removeBaseClass ? "input-wrapper" : ""} ${className}`}>
    {children}
  </div>
);

// Label Text
export const InputLabel = ({
  children,
  className,
  removeBaseClass,
  htmlFor
}) => (
  <label
    className={applyClassName("input-label", removeBaseClass, className)}
    htmlFor={htmlFor}
  >
    {children}
  </label>
);

// Error Text
export const InputError = ({ children, className, removeBaseClass }) => (
  <div className={applyClassName("input-error", removeBaseClass, className)}>
    {children}
  </div>
);

// Input Element
export const InputElement = ({ className, removeBaseClass, ...rest }) => (
  <input
    className={`${!removeBaseClass ? "input" : ""} ${className}`}
    {...rest}
  />
);

export const Input = ({
  name,
  labelText,
  id,
  type,
  onChange,
  value,
  className,
  removeBaseClass,
  render = null
}) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    const error = value.match(/[A-z]+/g) ? "Must be letter" : null;
    setError(error);
  }, [value]);

  const inputComponentProps = {
    type: type,
    name: name,
    id: id,
    onChange: onChange,
    value: value
  };
  const inputWrapperProps = {
    className: `${!removeBaseClass ? "input-wrapper" : ""} ${className}`
  };
  return (
    <>
      {render ? (
        render(InputWrapper, InputElement, InputLabel, InputError)
      ) : (
        <InputWrapper {...inputWrapperProps}>
          {error && <InputError> {error} </InputError>}
          <InputElement {...inputComponentProps} />
          <InputLabel> {labelText} </InputLabel>
        </InputWrapper>
      )}
    </>
  );
};
