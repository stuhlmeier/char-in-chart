import { InjectionKey } from "vue";

export const SET_ERROR_MESSAGE: InjectionKey<(message: string) => void> =
  Symbol("setErrorMessage");
