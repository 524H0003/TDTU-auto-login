import { execute } from ".";

execute<{ url: string }>({
  usernameField: "user",
  passwordField: "pass",
  url: () =>
    "https://stdportal.tdtu.edu.vn/Login/SignIn?ReturnURL=" +
    window.location.origin +
    window.location.pathname,
  postFunc: async ({ url }) => {
    window.location.href = url;
  },
  conditionFunc: async () => {
    try {
      const response = await fetch(
        "https://stdportal.tdtu.edu.vn/Alert/ThongBaoNotification",
        { method: "Post" },
      );

      if (!response.ok) return false;
      else {
        const data = await response.text();

        return data !== "[]";
      }
    } catch {
      return true;
    }
  },
});
