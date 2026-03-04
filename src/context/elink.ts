import { execute } from ".";

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

    url.searchParams.append("service", service);

    return url.toString();
  },
  isFormData: false,
  extendFields(formData) {
    const executionInput = document.querySelector<HTMLInputElement>(
      'input[name="execution"]',
    );

    if (executionInput) {
      const executionValue = executionInput.value;
      formData.append("execution", executionValue);
    } else {
      console.error('Không tìm thấy inputinput[name="execution"]');
    }

    formData.append("_eventId", "submit");
    formData.append("geolocation", "");
    formData.append("submit", "LOGIN");
  },
  handleError: redirectTo,
});

export const runOnUpdate = true;
