import { useMachine } from "@xstate/react";
import * as Yup from "yup";
import { useEffect, useMemo, useState } from "react";
import "../stateMachines.scss";
import { mockAPICall, useYupValidationResolver } from "../utils";
import {
  BUTTON_STATES,
  BUTTON_EVENTS,
  buttonStateMachine
} from "../machines/buttonStateMachine";
import { useForm } from "react-hook-form";
import {
  formatInitialValues,
  formatValidationSchema,
  makeButtonFocusTextMachine,
  resolveInputType
} from "./dynamicFormUtils";
import isEqual from "lodash/isEqual";
import ReactJson from "react-json-view";

// Our button text changes depending on the button state
const getButtonText = (buttonState, buttonFocusState, focusMessages = {}) => {
  if (buttonFocusState !== "NO_FOCUS") {
    const inputName = buttonFocusState.replace("FOCUS_", "");
    return focusMessages[inputName];
  }
  switch (buttonState) {
    case BUTTON_STATES.LOADING:
      return "Loading...";
    case BUTTON_STATES.READY:
      return "Submit";
    case BUTTON_STATES.ERROR:
      return "Error! Fix it pls";
    case BUTTON_STATES.CANCELLED:
      return "Someone rudely interrupted, try again?";
    default:
      return "Submit";
  }
};

// To make this feel more like a real world situation,
// I'm assuming that the array order isn't the order we want to rely on so I added an index param.
const formSchema = [
  {
    index: 0,
    type: "text",
    name: "firstName",
    placeholder: "First Name",
    focusText: "Enter your First Name",
    initialValue: "",
    validation: Yup.string().required("Required")
  },
  {
    index: 1,
    type: "text",
    name: "middleName",
    placeholder: "Middle Name",
    focusText: "Enter your Middle Name",
    initialValue: "",
    validation: Yup.string().required("Required")
  },
  {
    index: 2,
    type: "text",
    name: "lastName",
    focusText: "Enter your Last Name",
    placeholder: "Last Name",
    initialValue: "",
    validation: Yup.string().required("Required")
  },
  {
    index: 3,
    type: "phone",
    name: "phone",
    placeholder: "Phone",
    focusText: "Enter a valid Phone Number",
    initialValue: "",
    validation: Yup.string().required("Required")
  },
  {
    index: 4,
    type: "text",
    name: "email",
    focusText: "Enter a valid Email",
    placeholder: "Email",
    initialValue: "",
    validation: Yup.string().required("Required")
  }
];

// A hacky little global render count tracker
let renderCount = 0;

export const DynamicForm = () => {
  renderCount += 1;

  // Set up our form objects driven by the schema
  const sortedFormSchema = useMemo(
    () => formSchema.sort((a, b) => a.index - b.index),
    [formSchema]
  );
  const initialValues = useMemo(() => formatInitialValues(sortedFormSchema), [
    sortedFormSchema
  ]);
  const validationSchema = useMemo(
    () => formatValidationSchema(sortedFormSchema),
    [sortedFormSchema]
  );
  const focusTextMessages = useMemo(
    () =>
      sortedFormSchema.reduce(
        (acc, input) => ({ ...acc, [input.name]: input.focusText }),
        {}
      ),
    [sortedFormSchema]
  );
  const formValidationResolver = useYupValidationResolver(validationSchema);
  const buttonFocusTextMachine = useMemo(
    () => makeButtonFocusTextMachine(sortedFormSchema),
    [sortedFormSchema]
  );

  // Set up our state machine using the hook
  const [buttonState, sendButtonStateEvent] = useMachine(buttonStateMachine);
  const [buttonFocusState, sendButtonFocusEvent] = useMachine(
    buttonFocusTextMachine,
    { devTools: true }
  );
  const [displaySuccessMessage, setDisplaySuccessMessage] = useState(false);
  const [previousFieldState, setPreviousFieldState] = useState({
    errors: {},
    touchedFields: {}
  });

  // Set up RHF Form
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isDirty, touchedFields }
  } = useForm({
    mode: "onBlur",
    resolver: formValidationResolver,
    defaultValues: initialValues
  });

  // Only send our form events whenever
  if (
    !isEqual(previousFieldState.touchedFields, touchedFields) ||
    !isEqual(previousFieldState.errors, errors)
  ) {
    Object.keys(touchedFields).forEach(key => {
      sendButtonFocusEvent(`${key}_${errors[key] ? "INVALID" : "VALID"}`);
    });

    setPreviousFieldState({
      touchedFields: { ...touchedFields },
      errors: { ...errors }
    });
  }

  // Form submit handler
  const onSubmitHandler = async data => {
    try {
      sendButtonStateEvent(BUTTON_EVENTS.api.REQUESTED);
      await mockAPICall(data.succeedAfter, data.cancelAfter, data.failAfter);
      sendButtonStateEvent(BUTTON_EVENTS.api.SUCCESS);
      setDisplaySuccessMessage(true);
      setTimeout(() => {
        setDisplaySuccessMessage(false);
      }, 2000);
    } catch (e) {
      if (e === "cancelled") {
        sendButtonStateEvent(BUTTON_EVENTS.api.CANCELLED);
      }
      if (e === "error") {
        setError("firstName", "API didnt like this value :(");
        sendButtonStateEvent(BUTTON_EVENTS.api.FAILED);
      }
    }
  };

  // Send events to the button state machine whenever our error state changes
  // This feels like a potential performance issue since these will be firing a lot (on any input change)
  // It could maybe be re-configured to use on blur or something
  // It definitely feels weird connecting the dots using an effect hook here, feels like a messy side effect, wonder if there's a better way?
  useEffect(() => {
    if (isValid && isDirty) {
      sendButtonStateEvent(BUTTON_EVENTS.form.READY);
    } else {
      sendButtonStateEvent(BUTTON_EVENTS.form.NOT_READY);
    }
  }, [isValid, isDirty, sendButtonStateEvent]);

  // Render form
  return (
    <>
      <p style={{ fontSize: "20px", maxWidth: "700px" }}>
        This example is using a RHF-based form (a little Yup validation), but
        any entirely dynamic form system. My goal was to see how XState handled
        more dynamic things beyond my static form examples.
      </p>
      <a
        href="https://github.com/DejayJD/sandbox/tree/main/src/state-machines"
        target="_blank"
      >
        <h3> Source Code </h3>
      </a>
      <form onSubmit={handleSubmit(onSubmitHandler)} className="form-container">
        <h3> Form </h3>
        {sortedFormSchema.map(input => (
          <div className="flex-col">
            {resolveInputType(input, errors, register)}
          </div>
        ))}
        <button
          className={`btn ${
            buttonState.value === BUTTON_STATES.ERROR
              ? "btn-danger"
              : "btn-primary"
          }`}
          type="submit"
          disabled={buttonState.value === BUTTON_STATES.LOADING}
        >
          {getButtonText(
            buttonState.value,
            buttonFocusState.value,
            focusTextMessages
          )}
        </button>
        {displaySuccessMessage && "Success!"}
        <h3> Configure the API Response </h3>
        <div className="triple-input-container">
          <div className="flex-col">
            <input
              defaultValue={2500}
              type="number"
              placeholder="Succeed After (ms)"
              name="succeedAfter"
              {...register("succeedAfter")}
            />
            {errors.succeedAfter && errors.succeedAfter}
          </div>
          <div className="flex-col">
            <input
              type="text"
              placeholder="Cancel After (ms)"
              name="cancelAfter"
              {...register("cancelAfter")}
            />
            {errors.cancelAfter && errors.cancelAfter}
          </div>
          <div className="flex-col">
            <input
              type="text"
              placeholder="Fail After (ms)"
              name="failAfter"
              {...register("failAfter")}
            />
            {errors.failAfter && errors.failAfter}
          </div>
        </div>
      </form>
      <h3> Render Count: {renderCount} </h3>
      <h3> Form Schema Used </h3>
      <ReactJson src={formSchema} />
    </>
  );
};
