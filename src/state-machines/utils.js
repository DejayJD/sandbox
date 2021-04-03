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
