import { execute, getHiddenInput } from ".";

execute({
  url: location.origin + "/forms/user_login",
  isFormData: false,
  extendFields(formData) {
    formData.append("ok", "Log In");
    formData.append("origurl", getHiddenInput('input[name="origurl"]'));
  },
  handleError() {
    window.open("", "_self", "");
    window.close();
  },
});

export const runOnUpdate = true;
