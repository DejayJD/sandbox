import { useMachine } from "@xstate/react";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import "../stateMachines.scss";
import { mockAPICall } from "../utils";
import {
  BUTTON_STATES,
  BUTTON_EVENTS,
  buttonStateMachine
} from "../machines/buttonStateMachine";
import { useForm } from "react-hook-form";

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

// TODO: connect all of these
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

// TODO: hook this up
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

export const StateMachineRHF = () => {
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

  // RHF stuff
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty }
  } = useForm({ mode: "onBlur" });

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
        During the Formik example I noticed that in the Formik example I was
        having lots of rerenders, mostly due to Formik sending events on every.
        This example is to see how XState would interact with React-Hook-Form
        which does a lot of performance optimizations by letting you decided
        what mode to rerender on (blur/change/submit/etc).
      </p>
      <a
        href="https://github.com/DejayJD/sandbox/tree/main/src/state-machines"
        target="_blank"
      >
        <h3> Source Code </h3>
      </a>
      <form onSubmit={handleSubmit(onSubmitHandler)} className="form-container">
        <h3> Form </h3>
        <div className="triple-input-container">
          <div className="flex-col">
            <input
              type="text"
              placeholder="First Name"
              name="firstName"
              {...register("firstName", { required: true })}
            />
            {errors.firstName && "first name is required"}
          </div>
          <div className="flex-col">
            <input
              type="text"
              placeholder="Middle Name"
              name="middleName"
              {...register("middleName", { required: true })}
            />
            {errors.middleName && "middle name is required"}
          </div>
          <div className="flex-col">
            <input
              type="text"
              placeholder="Last Name"
              name="lastName"
              {...register("lastName", { required: true })}
            />
            {errors.lastName && "last name is required"}
          </div>
        </div>
        <div className="flex-col">
          <input
            type="phone"
            placeholder="Phone"
            name="phoneNumber"
            maxLength={10}
            {...register("phoneNumber", { required: true })}
          />
          {errors.phoneNumber && "phone number is required"}
        </div>
        <div className="flex-col">
          <input
            type="text"
            placeholder="Email"
            name="email"
            {...register("email", { required: true })}
          />
          {errors.email && "email is required"}
        </div>
        <button
          className={`btn ${
            buttonState.value === BUTTON_STATES.ERROR ? "btn-danger" : "btn-primary"
          }`}
          type="submit"
          disabled={
            buttonState.value === BUTTON_STATES.NOT_READY ||
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
              defaultValue={initialFormValues.succeedAfter}
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
    </>
  );
};
