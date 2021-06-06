import { applyClassName } from "../../../utils";

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
export const InputError = ({ children, className, removeBaseClass }) => (
  <div className={applyClassName("input-error", removeBaseClass, className)}>
    {children}
  </div>
);

export const InputWrapper = ({ children, className, removeBaseClass }) => (
  <div className={`${!removeBaseClass ? "input-wrapper" : ""} ${className}`}>
    {children}
  </div>
);

export const InputElement = ({ className, removeBaseClass, ...rest }) => (
  <input
    className={`${!removeBaseClass ? "input-element" : ""} ${className}`}
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
  error,
  className
}) => {
  const inputComponentProps = {
    type: type,
    name: name,
    id: id,
    onChange: onChange,
    value: value,
    error: error
  };
  return (
    <InputWrapper className={className}>
      {error && <InputError> {error} </InputError>}
      <InputElement {...inputComponentProps} />
      <InputLabel> {labelText} </InputLabel>
    </InputWrapper>
  );
};
