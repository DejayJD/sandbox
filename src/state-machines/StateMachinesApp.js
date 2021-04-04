import { useFormik } from "formik";
import { useMachine } from "@xstate/react";
import { Machine } from "xstate";
import * as Yup from "yup";
import {useEffect, useState} from "react";
import "./stateMachines.scss";
import { hasFormErrors, mockAPICall } from "./utils";

// Button states for the state machine
const BUTTON_STATES = {
  FOCUS: "FOCUS",
  READY: "READY",
  LOADING: "LOADING",
  DISABLED: "DISABLED",
  ERROR: "ERROR",
  CANCELLED: "CANCELLED"
};

// Events sent to the state machine
const BUTTON_EVENTS = {
  form: {
    READY: "FORM_READY",
    NOT_READY: "FORM_NOT_READY"
  },
  api: {
    REQUESTED: "API_REQUESTED",
    SUCCESS: "API_SUCCESS",
    CANCELLED: "API_CANCELLED",
    FAILED: "API_FAILED"
  }
};

// Button state machine
const buttonStateMachine = Machine({
  id: "buttonStates",
  initial: BUTTON_STATES.DISABLED,
  states: {
    [BUTTON_STATES.DISABLED]: {
      on: { [BUTTON_EVENTS.form.READY]: BUTTON_STATES.READY }
    },
    [BUTTON_STATES.READY]: {
      on: {
        [BUTTON_EVENTS.form.NOT_READY]: BUTTON_STATES.DISABLED,
        [BUTTON_EVENTS.api.REQUESTED]: BUTTON_STATES.LOADING
      }
    },
    [BUTTON_STATES.LOADING]: {
      on: {
        [BUTTON_EVENTS.api.SUCCESS]: BUTTON_STATES.READY,
        [BUTTON_EVENTS.api.CANCELLED]: BUTTON_STATES.CANCELLED,
        [BUTTON_EVENTS.api.FAILED]: BUTTON_STATES.ERROR
      }
    },
    [BUTTON_STATES.ERROR]: {
      on: { [BUTTON_EVENTS.form.READY]: BUTTON_STATES.READY }
    },
    [BUTTON_STATES.CANCELLED]: {
      on: {
        [BUTTON_EVENTS.form.NOT_READY]: BUTTON_STATES.DISABLED,
        [BUTTON_EVENTS.api.REQUESTED]: BUTTON_STATES.LOADING
      }
    }
  }
});

// Our button text changes depending on the button state
const getButtonText = buttonState => {
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

// Form values
const initialFormValues = {
  firstName: "",
  middleName: "",
  lastName: "",
  phoneNumber: "",
  email: "",
  succeedAfter: 2500,
  cancelAfter: "",
  failAfter: ""
};

// Form Validation
const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("Required"),
  middleName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  phoneNumber: Yup.string().required("Required"),
  email: Yup.string().required("Required")
});

// A hacky little global render count tracker
let renderCount = 0;

export const StateMachinesApp = () => {
  renderCount += 1;
  // Set up our state machine using the hook
  const [buttonState, sendButtonStateEvent] = useMachine(buttonStateMachine);
  const [displaySuccessMessage, setDisplaySuccessMessage] = useState(false);

  // Form submit handler
  const onSubmitHandler = async (data, { setFieldError }) => {
    try {
      sendButtonStateEvent(BUTTON_EVENTS.api.REQUESTED);
      await mockAPICall(data.succeedAfter, data.cancelAfter, data.failAfter);
      sendButtonStateEvent(BUTTON_EVENTS.api.SUCCESS);
      setDisplaySuccessMessage(true);
      setTimeout(()=>{setDisplaySuccessMessage(false)}, 2000)
    } catch (e) {
      if (e === "cancelled") {
        sendButtonStateEvent(BUTTON_EVENTS.api.CANCELLED);
      }
      if (e === "error") {
        setFieldError("firstName", "API didnt like this value :(");
        sendButtonStateEvent(BUTTON_EVENTS.api.FAILED);
      }
    }
  };

  // Formik stuff
  const { handleChange, handleSubmit, values, errors, touched } = useFormik({
    initialValues: initialFormValues,
    onSubmit: onSubmitHandler,
    validationSchema,
    validateOnMount: true
  });

  // Send events to the button state machine whenever our error state changes
  // This feels like a potential performance issue since these will be firing a lot (on any input change)
  // It could maybe be re-configured to use on blur or something
  // It definitely feels weird connecting the dots using an effect hook here, feels like a messy side effect, wonder if there's a better way?
  useEffect(() => {
    if (!hasFormErrors(errors)) {
      sendButtonStateEvent(BUTTON_EVENTS.form.READY);
    } else {
      sendButtonStateEvent(BUTTON_EVENTS.form.NOT_READY);
    }
  }, [errors, values, sendButtonStateEvent]);

  // Render form
  return (
    <>
      <a href="https://github.com/DejayJD/sandbox/tree/main/src/state-machines  "><h3> Source Code </h3></a>
      <form onSubmit={handleSubmit} className="form-container">
        <h3> Form </h3>
        <div className="triple-input-container">
          <div className="flex-col">
            <input
              type="text"
              placeholder="First Name"
              name="firstName"
              value={values.firstName}
              onChange={handleChange}
            />
            {errors.firstName && touched.firstName && errors.firstName}
          </div>
          <div className="flex-col">
            <input
              type="text"
              placeholder="Middle Name"
              name="middleName"
              value={values.middleName}
              onChange={handleChange}
            />
            {errors.middleName && touched.middleName && errors.middleName}
          </div>
          <div className="flex-col">
            <input
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={values.lastName}
              onChange={handleChange}
            />
            {errors.lastName && touched.lastName && errors.lastName}
          </div>
        </div>
        <div className="flex-col">
          <input
            type="phone"
            placeholder="Phone"
            name="phoneNumber"
            maxLength={10}
            onChange={handleChange}
          />
          {errors.phoneNumber && touched.phoneNumber && errors.phoneNumber}
        </div>
        <div className="flex-col">
          <input
            type="text"
            placeholder="Email"
            name="email"
            onChange={handleChange}
          />
          {errors.email && touched.email && errors.email}
        </div>
        <button
          type="submit"
          style={{
            background:
              buttonState.value === BUTTON_STATES.ERROR ? "#e24e4e82" : "white"
          }}
          disabled={
            buttonState.value === BUTTON_STATES.DISABLED ||
            buttonState.value === BUTTON_STATES.LOADING
          }
        >
          {getButtonText(buttonState.value)}
        </button>
        {displaySuccessMessage && "Success!"}
        <h3> Configure the API Response </h3>
        <div className="triple-input-container">
          <div className="flex-col">
            <input
              type="number"
              placeholder="Succeed After (ms)"
              name="succeedAfter"
              value={values.succeedAfter}
              onChange={handleChange}
            />
            {errors.succeedAfter && touched.succeedAfter && errors.succeedAfter}
          </div>
          <div className="flex-col">
            <input
              type="text"
              placeholder="Cancel After (ms)"
              name="cancelAfter"
              value={values.cancelAfter}
              onChange={handleChange}
            />
            {errors.cancelAfter && touched.cancelAfter && errors.cancelAfter}
          </div>
          <div className="flex-col">
            <input
              type="text"
              placeholder="Fail After (ms)"
              name="failAfter"
              value={values.failAfter}
              onChange={handleChange}
            />
            {errors.failAfter && touched.failAfter && errors.failAfter}
          </div>
        </div>
      </form>
      <h3> Render Count: {renderCount} </h3>
    </>
  );
};
