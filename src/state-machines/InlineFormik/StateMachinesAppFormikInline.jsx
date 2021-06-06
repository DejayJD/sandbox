import { useFormik } from "formik";
import { useMachine } from "@xstate/react";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import "../stateMachines.scss";
import { hasFormErrors, mockAPICall } from "../utils";
import {
  BUTTON_STATES,
  BUTTON_EVENTS,
  buttonStateMachine
} from "../machines/buttonStateMachine";

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

export const StateMachinesAppFormikInline = () => {
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
      setTimeout(() => {
        setDisplaySuccessMessage(false);
      }, 2000);
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
      <p style={{ fontSize: "20px", maxWidth: "700px" }}>
        This example is using a single component with forms handled by Formik
        and using the <code>useMachine</code> hook in the same component. As you
        can see by the render count below the example, it gets very messy and is
        very sub-optimal.
      </p>
      <a
        href="https://github.com/DejayJD/sandbox/tree/main/src/state-machines"
        target="_blank"
      >
        <h3> Source Code </h3>
      </a>
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
          className={`btn ${
            buttonState.value === BUTTON_STATES.ERROR
              ? "btn-danger"
              : "btn-primary"
          }`}
          type="submit"
          disabled={
            buttonState.value === BUTTON_STATES.NOT_READY ||
            buttonState.value === BUTTON_STATES.LOADING ||
            buttonState.value === BUTTON_STATES.ERROR
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
