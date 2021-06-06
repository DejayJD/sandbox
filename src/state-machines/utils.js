import {useCallback} from "react";

export const mockAPICall = (succeedAfter = null, cancelAfter = null, failAfter = null) =>
  new Promise((resolve, reject) => {
    if (succeedAfter) {
      setTimeout(() => {
        resolve("Success");
      }, succeedAfter);
    }
    if (cancelAfter) {
      setTimeout(() => {
        reject("cancelled");
      }, cancelAfter);
    }
    if (failAfter) {
      setTimeout(() => {
        reject("error");
      }, failAfter);
    }
  });

export const hasFormErrors = errors => Object.keys(errors).length > 0;


export const useYupValidationResolver = validationSchema =>
  useCallback(
    async data => {
      try {
        const values = await validationSchema.validate(data, {
          abortEarly: false
        });

        return {
          values,
          errors: {}
        };
      } catch (errors) {
        return {
          values: {},
          errors: errors.inner.reduce(
            (allErrors, currentError) => ({
              ...allErrors,
              [currentError.path]: {
                type: currentError.type ?? "validation",
                message: currentError.message
              }
            }),
            {}
          )
        };
      }
    },
    [validationSchema]
  );
