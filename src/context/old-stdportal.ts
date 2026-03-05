import { execute } from ".";

execute({
  usernameField: "user",
  passwordField: "pass",
  url: () =>
    "https://old-stdportal.tdtu.edu.vn/Login/SignIn?ReturnURL=" +
    window.location.origin +
    window.location.pathname,
  postFunc: async (res) => {
    window.location.href = (await res.json()).url;
  },
  conditionFunc: async ({ username }) => {
    try {
      const response = await fetch(
        "https://old-stdportal.tdtu.edu.vn/main/thongtinsinhvien/family_getall",
        { method: "Post" },
      );

      if (response.ok) {
        const data = (await response.json()) as object[];

        return (
          !data.some((i) => i["StudentID"] == username) &&
          window.location.pathname !== "/Login/Index"
        );
      }
    } catch (e) {
      console.log(e);
    }

    return true;
  },
});

export const runOnUpdate = true;
