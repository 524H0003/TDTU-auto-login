import { useEffect, useState } from "react";

import packageJson from "../package.json";
import SettingsButton from "./components/settings";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "./components/shadcn/ui/field";
import { Input } from "./components/shadcn/ui/input";
import { Switch } from "./components/shadcn/ui/switch";
import { LocalStorage } from "./types";

export default function PopupPage() {
  const [username, setUsername] = useState(""),
    [password, setPassword] = useState(""),
    [interval, setIntervalValue] = useState<number>(3),
    [active, setActive] = useState<boolean>(false);

  useEffect(() => {
    chrome.storage.local.get<LocalStorage>(
      ["username", "password", "interval", "active"],
      (data) => {
        setUsername(data.username || "");
        setPassword(data.password || "");
        setIntervalValue(data.interval || 3);
        setActive(data.active || false);
      },
    );
  }, []);

  return (
    <FieldGroup className="p-4">
      <FieldSet>
        <FieldLegend>TDTU Auto Login</FieldLegend>
        <FieldDescription>
          Tự động đăng nhập tài khoản sinh viên. Phiên bản {packageJson.version}
        </FieldDescription>
      </FieldSet>
      <Field orientation="horizontal" className="w-fit">
        <FieldLabel htmlFor="toggleActive">Kích hoạt</FieldLabel>
        <Switch
          id="toggleActive"
          checked={active}
          onCheckedChange={(e) => {
            chrome.storage.local.set({ active: e }, () => setActive(e));
          }}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="fieldgroup-mssv">Mã số sinh viên</FieldLabel>
        <Input
          id="fieldgroup-mssv"
          value={username}
          onChange={(e) => {
            const value = e.target.value;
            chrome.storage.local.set<LocalStorage>({ username: value }, () =>
              setUsername(value),
            );
          }}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="fieldgroup-password">Mật khẩu</FieldLabel>
        <Input
          id="fieldgroup-password"
          type="password"
          value={password}
          onChange={(e) => {
            const value = e.target.value;
            chrome.storage.local.set<LocalStorage>({ password: value }, () =>
              setPassword(value),
            );
          }}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="fieldgroup-interval">
          Thời gian tuần hoàn (phút)
        </FieldLabel>
        <Input
          id="fieldgroup-interval"
          type="number"
          value={interval}
          onChange={(e) => {
            const value = Number(e.target.value);
            chrome.storage.local.set<LocalStorage>({ interval: value }, () =>
              setIntervalValue(value),
            );
          }}
          min="1"
        />
        <FieldDescription>
          Thời gian cập nhật thông tin đăng nhập
        </FieldDescription>
      </Field>
      <Field orientation="horizontal" className="justify-between">
        <SettingsButton />
      </Field>
    </FieldGroup>
  );
}
