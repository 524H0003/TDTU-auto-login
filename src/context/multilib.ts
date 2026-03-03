import { execute } from ".";

execute({
  usernameField: "USERID",
  passwordField: "USERPASSWORD",
  url: "https://multilib.tdtu.edu.vn/Login/CheckLogin",
  conditionFunc: async () => {
    try {
      const response = await fetch(
        "https://multilib.tdtu.edu.vn/media/video?id=2398",
        { method: "GET" },
      );

      if (response.ok) {
        return (
          (await response.text()).includes("<form") ||
          window.location.pathname == "/Login/Index"
        );
      }
    } catch (e) {
      console.log(e);
    }

    return true;
  },
  postFunc: () => {
    const params = new URLSearchParams(window.location.search),
      returnUrl = params.get("returnurl");

    window.location.href = window.location.origin + returnUrl;
  },
});

export const runOnUpdate = true;
