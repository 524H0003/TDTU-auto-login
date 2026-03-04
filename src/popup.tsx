import React, { useEffect, useState } from "react";

import packageJson from "../package.json";
import { Button } from "./components/shadcn/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
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
    [active, setActive] = useState<boolean>(false),
    [status, setStatus] = useState("");

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

  const handleSave = () => {
    chrome.storage.local.set({ username, password, interval }, () => {
      setStatus("✅ Đã lưu cài đặt!");

      setTimeout(() => setStatus(""), 2000);

      if (typeof chrome !== "undefined" && chrome.runtime) {
        chrome.runtime.sendMessage({
          action: "start_alarm",
          interval: Number(interval),
        });
      }
    });
  };

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
          onChange={(e) => setUsername(e.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="fieldgroup-password">Mật khẩu</FieldLabel>
        <Input
          id="fieldgroup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          onChange={(e) => setIntervalValue(Number(e.target.value))}
          min="1"
        />
        <FieldDescription>
          Thời gian cập nhật thông tin đăng nhập
        </FieldDescription>
      </Field>
      <Field orientation="horizontal">
        <Button type="submit" onClick={handleSave}>
          Lưu thông tin
        </Button>
        <FieldError
          className="text-green-400"
          errors={[{ message: status || " " }]}
        />
      </Field>
    </FieldGroup>
  );
}
