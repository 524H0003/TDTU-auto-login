import { execute } from ".";

execute({
  url: location.origin + "/Logon/DoLogOn",
  isFormData: true,
  handleError() {
    window.location.href = location.origin + "/datphongsv"
  }
});

export const runOnUpdate = true;
