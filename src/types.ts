export interface IAccount {
  username: string;
  password: string;
}

export interface IAppSetting {
  interval: number;
}

export interface LocalStorage extends IAccount, IAppSetting {}