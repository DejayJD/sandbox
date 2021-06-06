import { StateMachinesAppFormikInline } from "../state-machines/InlineFormik/StateMachinesAppFormikInline";
import { NoStateMachine as NoStateMachineComponent } from "../state-machines/Vanilla/VanillaFormik";
import { StateMachineRHF } from "../state-machines/ReactHookForms/StateMachineRHF";
import { DynamicForm as DynamicRHFForm } from "../state-machines/DynamicForms/DynamicForm";
import "../tailwind-design-system/tailwind.css";

export default {
  title: "StateMachines"
};

export const StateMachineFormikInline = StateMachinesAppFormikInline;
export const NoStateMachine = NoStateMachineComponent;
export const StateMachineReactHookForm = StateMachineRHF;
export const DynamicForm = DynamicRHFForm;
