import { execute, getHiddenInput } from ".";

function redirectTo() {
  window.location.href += "";
}

execute({
  usernameField: "username",
  passwordField: "password",
  url: () => {
    const hostUrl = "https://elink.tdtu.edu.vn:8443/cas/login",
      url = new URL(hostUrl),
      params = new URLSearchParams(window.location.search),
      service = params.get("service");

    if (service !== null) {
      url.searchParams.append("service", service);
    }

    return url.toString();
  },
  isFormData: false,
  extendFields(formData) {
    formData.append("execution", getHiddenInput('input[name="execution"]'));
    formData.append("_eventId", "submit");
    formData.append("geolocation", "");
    formData.append("submit", "LOGIN");
  },
  handleError: redirectTo,
});

export const runOnUpdate = true;
