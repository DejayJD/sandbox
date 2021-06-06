import React from "react";
import * as Yup from "yup";
import { Machine } from "xstate";

export const resolveInputType = (input, errors, register) => {
  return (
    <>
      <input
        type={input.type}
        placeholder={input.placeholder}
        name={input.name}
        {...register(input.name)}
      />
      {errors[input.name] && errors[input.name].message}
    </>
  );
};

export const formatValidationSchema = formSchema =>
  Yup.object().shape(
    formSchema.reduce(
      (acc, input) => ({ ...acc, [input.name]: input.validation }),
      {}
    )
  );

export const formatInitialValues = formSchema =>
  formSchema.reduce(
    (acc, input) => ({ ...acc, [input.name]: input.initialValue }),
    {}
  );

export const makeButtonFocusTextMachine = formSchema => {
  const inputNames = formSchema.map(input => input.name);
  const states = formSchema.reduce(
    (acc, input) => {
      const newPreviousInputs = [...acc.previousInputs, input.name];
      const newNextInputs = formSchema
        .map(input => input.name)
        .filter(inputName => !newPreviousInputs.includes(inputName));

      const previousInputStates = acc.previousInputs.reduce(
        (acc, previousInputName) => ({
          ...acc,
          [`${previousInputName}_INVALID`]: `FOCUS_${previousInputName}`
        }),
        {}
      );
      const nextInputStates = {
        [`${input.name}_VALID`]: newNextInputs[0]
          ? `FOCUS_${newNextInputs[0]}`
          : "NO_FOCUS"
      };
      return {
        previousInputs: newPreviousInputs,
        nextInputs: newNextInputs,
        finalStates: {
          ...acc.finalStates,
          NO_FOCUS: {
            on: {
              ...acc.finalStates.NO_FOCUS.on,
              [`${input.name}_INVALID`]: `FOCUS_${input.name}`
            }
          },
          [`FOCUS_${input.name}`]: {
            on: {
              ...previousInputStates,
              ...nextInputStates
            }
          }
        }
      };
    },
    {
      previousInputs: [],
      nextInputs: formSchema.map(input => input.name),
      finalStates: { NO_FOCUS: { on: {} } }
    }
  );
  // console.log(states);
  const initialState = `FOCUS_${inputNames[0]}`;
  const machineObject = {
    id: "buttonFocusMachine",
    initial: initialState,
    states: states.finalStates
  };
  console.log(machineObject);
  // console.log(JSON.stringify(machineObject));
  // console.log(machineObject);
  return Machine(machineObject);
};

