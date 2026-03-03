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
    if (!sesskey) return true;

    try {
      const xhr = new XMLHttpRequest();

      xhr.open(
        "POST",
        `https://elearning.tdtu.edu.vn/lib/ajax/service.php?sesskey=${
          sesskey
        }&info=core_course_get_enrolled_courses_by_timeline_classification`,
        false,
      );

      xhr.send(
        JSON.stringify([
          {
            index: 0,
            methodname:
              "core_course_get_enrolled_courses_by_timeline_classification",
            args: {
              offset: 0,
              limit: 0,
              classification: "all",
              sort: "fullname",
              customfieldname: "",
              customfieldvalue: "",
            },
          },
        ]),
      );

      if (xhr.status === 200) {
        return JSON.parse(xhr.responseText)[0].error;
      }

      return true;
    } catch {
      return true;
    }
  },
});

export const runOnUpdate = true;
