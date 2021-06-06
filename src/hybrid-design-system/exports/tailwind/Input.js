import {
  InputLabel,
  InputError,
  InputElement,
  InputWrapper,
  Input as InputLogic
} from "../../internal/logic/Input";

// A pre-packaged component with the className you need added
export const Input = props => (
  <InputLogic {...props} className={`input-wrapper ${props.className}`} />
);
// Export the internals directly
export { InputElement, InputError, InputWrapper, InputLabel };
