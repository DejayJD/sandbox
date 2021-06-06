import { Input as InputLogic } from "../base-logic/Input";
import {
  InputElementStyles,
  InputErrorStyles,
  InputLabelStyles,
  InputWrapperStyles
} from "../../internal/styles/sc-input";
import styled from "styled-components";

export const Input = styled(InputLogic)`
  ${({ theme }) => `
    ${InputWrapperStyles(theme)}
    .input-element {
      ${InputElementStyles(theme)}  
    }
    .input-label {
      ${InputLabelStyles(theme)}
    }
    .input-error {
      ${InputErrorStyles(theme)}
    } 
  `}
`;
