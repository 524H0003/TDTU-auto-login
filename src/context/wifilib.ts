import { execute, getHiddenInput } from ".";

execute({
  usernameField: "username",
  passwordField: "password",
  url: location.origin,
  handleError() {
    window.open("", "_self", "");
    window.close();
  },
  isFormData: false,
  extendFields(formData) {
    formData.append("4Tredir", getHiddenInput('input[name="4Tredir"]'));
    formData.append("magic", getHiddenInput('input[name="magic"]'));
  },
});

export const runOnUpdate = true;
