import { type IAccount } from "../types";

export interface IExecute {
  usernameField: string;
  passwordField: string;
  url: string | (() => string);
  postFunc?: (input: Response) => void | Promise<void>;
  conditionFunc?: (data: IAccount) => Promise<boolean> | boolean;
  handleError?: () => void;
  extendFields?: (formData: FormData | URLSearchParams) => void | Promise<void>;
  isFormData?: boolean;
}

export async function execute({
  usernameField,
  passwordField,
  url,
  postFunc = () => {},
  conditionFunc = () => true,
  extendFields = () => {},
  handleError = () => {},
  isFormData = true,
}: IExecute) {
  if (typeof window === "undefined") return;

  window.initAutoLogin = async (data: IAccount) => {
    if (data.username && data.password) {
      if (!(await conditionFunc(data))) return;
      const formData = isFormData ? new FormData() : new URLSearchParams();
      formData.append(usernameField, data.username);
      formData.append(passwordField, data.password);

      extendFields(formData);

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
        console.log("Lỗi kết nối khi gửi POST\n", error);
        handleError();
      }
    }
  };
}
