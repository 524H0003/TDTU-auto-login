import { type IAccount } from "../types";

export interface IExecute<Response extends object | null = null> {
  usernameField: string;
  passwordField: string;
  url: string | (() => string);
  postFunc?: (input: Response) => void | Promise<void>;
  conditionFunc?: () => Promise<boolean> | boolean;
}

export async function execute<T extends object = null>({
  usernameField,
  passwordField,
  url,
  postFunc = () => {},
  conditionFunc = () => true,
}: IExecute<T>) {
  if (!(await conditionFunc())) return;

  chrome.storage.local.get<IAccount>(["username", "password"], async (data) => {
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
          try {
            const data = await response.json();
            await postFunc(data);
          } catch (parseError) {
            console.error(
              "Lỗi khi phân tích JSON từ phản hồi POST\n",
              parseError,
            );
          }
        }
      } catch (error) {
        console.error("Lỗi kết nối khi gửi POST\n", error);
      }
    }
  });
}
