import { execute, getHiddenInput } from ".";

execute({
  url: location.origin,
  handleError() {
    window.open("", "_self", "");
    window.close();
  },
  isFormData: false,
  extendFields(formData) {
    formData.append("4Tredir", getHiddenInput('input[name="4Tredir"]'));
    formData.append("magic", getHiddenInput('input[name="magic"]'));
    formData.set("username", "thekhach1");
    formData.set("password", "tdtulib198@");
  },
  postFunc() {
    window.open("", "_self", "");
    window.close();
  },
});

export const runOnUpdate = true;
