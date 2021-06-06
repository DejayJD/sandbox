// Button states for the state machine
import { Machine } from "xstate";

export const BUTTON_STATES = {
  FOCUS: "FOCUS",
  READY: "READY",
  LOADING: "LOADING",
  NOT_READY: "NOT_READY",
  ERROR: "ERROR",
  CANCELLED: "CANCELLED"
};

// Events sent to the state machine
export const BUTTON_EVENTS = {
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
export const buttonStateMachine = Machine({
  id: "buttonStates",
  initial: BUTTON_STATES.NOT_READY,
  states: {
    [BUTTON_STATES.NOT_READY]: {
      on: { [BUTTON_EVENTS.form.READY]: BUTTON_STATES.READY }
    },
    [BUTTON_STATES.READY]: {
      on: {
        [BUTTON_EVENTS.form.NOT_READY]: BUTTON_STATES.NOT_READY,
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
        [BUTTON_EVENTS.form.NOT_READY]: BUTTON_STATES.NOT_READY,
        [BUTTON_EVENTS.api.REQUESTED]: BUTTON_STATES.LOADING
      }
    }
  }
});
