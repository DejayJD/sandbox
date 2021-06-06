export const InputWrapperStyles = theme => `
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-end;
`;

export const InputElementStyles = theme => `
  border: solid 1px;
  border-color: ${theme.colors.gray["300"]};
  padding: ${theme.spacing["1"]} ${theme.spacing["2"]};
  &:hover {
    border-color: ${theme.colors.blue["300"]};
  }
  &[error] {
    color: ${theme.colors.red["500"]};
  }
  &:focus ~ .input-label {
    color ${theme.colors.black};
  }
`;

export const InputErrorStyles = theme => `
  color: ${theme.colors.red["500"]};
`;

export const InputLabelStyles = theme => `
  transition: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  color: ${theme.colors.gray["500"]};
`;

export const PrimaryButton = theme => `
  background-color: ${theme.colors.blue["500"]};
  color: ${theme.colors.white};
  &:focus {
    box-shadow: 0 0 2px ${theme.colors.blue["400"]};
    background-color: ${theme.colors.blue["700"]};
  }
  &:hover {
    background-color: ${theme.colors.blue["700"]};
  }
`;
