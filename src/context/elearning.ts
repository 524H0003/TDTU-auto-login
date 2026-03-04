import { execute } from ".";

execute({
  usernameField: "username",
  passwordField: "password",
  url: "https://elearning.tdtu.edu.vn/login/index.php",
  postFunc: async () => {
    window.location.href = window.location.origin + "/my";
  },
  conditionFunc: async () => {
    // @ts-expect-error M is global on TDTU elearning
    const sesskey = typeof M !== "undefined" ? M.cfg.sesskey : null;
    if (!sesskey)
      return !window.location.pathname.split("/")[1].includes(".php");

    const userDiv = document.querySelector<HTMLDivElement>("div[data-user-id]");

    if (!userDiv) return true;

    try {
      const xhr = new XMLHttpRequest();

      xhr.open(
        "POST",
        `https://elearning.tdtu.edu.vn/lib/ajax/service.php?sesskey=${
          sesskey
        }&info=core_course_get_recent_courses`,
        false,
      );

      xhr.send(
        JSON.stringify([
          {
            index: 0,
            methodname: "core_course_get_recent_courses",
            args: { userid: userDiv.dataset.userId, limit: 10 },
          },
        ]),
      );

      if (xhr.status === 200) {
        return JSON.parse(xhr.responseText)[0].data === undefined;
      }
    } catch (e) {
      console.log(e);
    }
    return true;
  },
});

export const runOnUpdate = true;
