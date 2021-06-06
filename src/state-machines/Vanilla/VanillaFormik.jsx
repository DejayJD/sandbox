import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import "../stateMachines.scss";
import { hasFormErrors, mockAPICall } from "../utils";

// Our button text changes depending on the button state
const getButtonText = (
  isAPILoading,
  isFormReady,
  isAPICancelled,
  isAPIErrored
) => {
  if (isAPILoading) {
    return "Loading...";
  }
  if (isAPICancelled) {
    return "Someone rudely interrupted, try again?";
  }
  if (isAPIErrored) {
    return "Error! Fix it pls";
  }

  return "Submit";
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

export const NoStateMachine = () => {
  renderCount += 1;
  // Set up our state machine using the hook
  const [displaySuccessMessage, setDisplaySuccessMessage] = useState(false);

  const [isAPILoading, setIsAPILoading] = useState(false);
  const [isFormReady, setIsFormReady] = useState(false);
  const [isAPICancelled, setIsAPICancelled] = useState(false);
  const [isAPIErrored, setIsAPIErrored] = useState(false);

  // Form submit handler
  const onSubmitHandler = async (data, { setFieldError }) => {
    try {
      // EASY TO CAUSE BUG RIGHT HERE <-------
      setIsAPIErrored(false);
      setIsAPICancelled(false);
      // END
      setIsAPILoading(true);
      await mockAPICall(data.succeedAfter, data.cancelAfter, data.failAfter);
      setIsAPILoading(false);
      setDisplaySuccessMessage(true);
      setTimeout(() => {
        setDisplaySuccessMessage(false);
      }, 2000);
    } catch (e) {
      if (e === "cancelled") {
        setIsAPICancelled(true);
        setIsAPILoading(false);
      }
      if (e === "error") {
        setIsAPIErrored(true);
        setFieldError("firstName", "API didnt like this value :(");
        setIsAPILoading(false);
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
    if (!hasFormErrors(errors) && !isFormReady) {
      setIsFormReady(true);
      setIsAPIErrored(false);
    } else if (isFormReady && hasFormErrors(errors)) {
      setIsFormReady(false);
    }
  }, [errors, values, setIsFormReady]);
  // EASY TO CAUSE BUG HERE
  // }, [errors, values, isFormReady, setIsFormReady]); <---------

  // Render form
  return (
    <>
      <p style={{ fontSize: "20px", maxWidth: "700px" }}>
        This example is without a state machine and with solely booleans.
        Looking at this, I'm already getting a headache about how to test that
        all the states appear in the order they're supposed to. There's also a
        lot of weird priority in the button text which assumes the component is
        correctly managing the button state.
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
          className={`btn ${isAPIErrored ? "btn-danger" : "btn-primary"}`}
          type="submit"
          style={{
            background: isAPIErrored ? "#e24e4e82" : "white"
          }}
          disabled={!isFormReady || isAPILoading}
        >
          {getButtonText(
            isAPILoading,
            isFormReady,
            isAPICancelled,
            isAPIErrored
          )}
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
