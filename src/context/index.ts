import { type IAccount } from "../types";

export interface IExecute {
  usernameField: string;
  passwordField: string;
  url: string | (() => string);
  postFunc?: (input: Response) => void | Promise<void>;
  conditionFunc?: () => Promise<boolean> | boolean;
}

export async function execute({
  usernameField,
  passwordField,
  url,
  postFunc = () => {},
  conditionFunc = () => true,
}: IExecute) {
  window.initAutoLogin = async (data: IAccount) => {
    if (!(await conditionFunc())) return;

    if (data.username && data.password) {
      const formData = new FormData();
      formData.append(usernameField, data.username);
      formData.append(passwordField, data.password);

      try {
        const targetUrl = typeof url === "function" ? url() : url,
          response = await fetch(targetUrl, {
            method: "POST",
            body: formData,
          });

        if (!response.ok) {
          console.error("Gửi POST thất bại, mã lỗi:", response.status);
        } else {
          await postFunc(response);
        }
      } catch (error) {
        console.error("Lỗi kết nối khi gửi POST\n", error);
      }
    }
  };
}
