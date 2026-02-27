import React, { useEffect, useState } from "react";

import { Button } from "./components/shadcn/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "./components/shadcn/ui/field";
import { Input } from "./components/shadcn/ui/input";
import { LocalStorage } from "./types";

export default function PopupPage() {
  const [username, setUsername] = useState(""),
    [password, setPassword] = useState(""),
    [interval, setIntervalValue] = useState<number>(3),
    [status, setStatus] = useState("");

  useEffect(() => {
    chrome.storage.local.get<LocalStorage>(
      ["username", "password", "interval"],
      (data) => {
        if (data.username) setUsername(data.username);
        if (data.password) setPassword(data.password);
        if (data.interval) setIntervalValue(data.interval);
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
    <FieldGroup>
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
        <FieldLabel htmlFor="fieldgroup-password">Mật khẩu</FieldLabel>
        <Input
          id="fieldgroup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FieldDescription>
          We&apos;ll send updates to this address.
        </FieldDescription>
      </Field>
      <Field orientation="horizontal">
        <Button type="reset" variant="outline">
          Reset
        </Button>
        <Button type="submit">Submit</Button>
      </Field>
    </FieldGroup>
    // <div style={{ padding: "15px", width: "200px" }}>
    //   <h3>Cài đặt Đăng nhập</h3>

    //   <label>Mã số sinh viên:</label>
    //   <input
    //     type="text"
    //     value={username}
    //     onChange={(e) => setUsername(e.target.value)}
    //     placeholder="Nhập mã số sinh viên"
    //   />

    //   <label>Mật khẩu:</label>
    //   <input
    //     type="password"
    //     value={password}
    //     onChange={(e) => setPassword(e.target.value)}
    //     placeholder="Nhập mật khẩu"
    //   />

    //   <label>Thời gian (phút):</label>
    //   <input
    //     type="number"
    //     value={interval}
    //     onChange={(e) => setIntervalValue(Number(e.target.value))}
    //     min="1"
    //   />

    //   <button onClick={handleSave} style={{ marginTop: "10px", width: "100%" }}>
    //     Lưu & Bắt đầu
    //   </button>

    //   <p style={{ color: "green", fontSize: "12px", minHeight: "15px" }}>
    //     {status}
    //   </p>
    // </div>
  );
}
