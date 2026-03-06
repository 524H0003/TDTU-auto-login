export interface IAccount {
  username: string;
  password: string;
}

export interface IAppSetting {
  interval: number;
  active: boolean;
  notOpenRefreshCookieTab: boolean;
}

export interface LocalStorage extends IAccount, IAppSetting {}

declare global {
  interface Window {
    initAutoLogin: (input: IAccount) => Promise<void>;
  }
}
