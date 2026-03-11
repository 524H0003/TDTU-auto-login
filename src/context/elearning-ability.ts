import { execute } from ".";

execute({
  usernameField: "UserID",
  passwordField: "UserPassword",
  url: "https://elearning-ability.tdtu.edu.vn/Login/CheckLogin",
  postFunc: () => {
    location.reload();
  },
  conditionFunc: async ({ username }) => {
    try {
      const response = await fetch(
        "https://elearning-ability.tdtu.edu.vn/Home/GetAllCourseWarning?_=" +
          Math.floor(Date.now()),
        { method: "GET" },
      );

      if (response.ok) {
        return (await response.json())["listEnrollmentStudent"].some(
          (i: object) => i["StudentID"] != username,
        );
      }
    } catch (e) {
      console.log(e);
    }

    return true;
  },
});

export const runOnUpdate = true;
