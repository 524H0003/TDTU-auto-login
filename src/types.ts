export interface IAccount {
  username: string;
  password: string;
}

export interface IAppSetting {
  interval: number;
  active: boolean;
}

export interface LocalStorage extends IAccount, IAppSetting {}
