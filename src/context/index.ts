import { type IAccount } from "../types";

export interface IExecute {
  usernameField: string;
  passwordField: string;
  url: string;
}

export function execute({ usernameField, passwordField, url }: IExecute) {
  chrome.storage.local.get<IAccount>(["username", "password"], async (data) => {
    if (data.username && data.password) {
      const formData = new FormData();
      formData.append(usernameField, data.username);
      formData.append(passwordField, data.password);

      try {
        const response = await fetch(url, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          console.error("Gửi POST thất bại, mã lỗi:", response.status);
        }
      } catch (error) {
        console.error("Lỗi kết nối khi gửi POST:", error);
      }
    }
  });
}
