import { type IAccount } from "../types";

chrome.storage.local.get<IAccount>(["username", "password"], async (data) => {
  if (data.username && data.password) {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("password", data.password);
    formData.append("anchor", "");

    try {
      const response = await fetch(
        "https://elearning.tdtu.edu.vn/login/index.php",
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        console.error("Gửi POST thất bại, mã lỗi:", response.status);
      }
    } catch (error) {
      console.error("Lỗi kết nối khi gửi POST:", error);
    }
  }
});
