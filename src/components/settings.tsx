import { IAppSetting } from "@/types";
import { Settings } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "./shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./shadcn/ui/dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "./shadcn/ui/field";
import { Switch } from "./shadcn/ui/switch";

export default function SettingsButton() {
  const [interval, setIntervalValue] = useState<number>(3),
    [notOpenRefreshCookieTab, toggleOpenRefreshCookieTab] =
      useState<boolean>(false);

  useEffect(() => {
    chrome.storage.local.get<IAppSetting>(
      ["interval", "notOpenRefreshCookieTab"],
      (data) => {
        setIntervalValue(data.interval || 3);
        toggleOpenRefreshCookieTab(data.notOpenRefreshCookieTab || false);
      },
    );
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cài đặt</DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <Field orientation="horizontal" className="max-w-sm">
            <FieldContent>
              <FieldLabel htmlFor="refreshCookieTab">
                Tab gia hạn cookie đăng nhập
              </FieldLabel>
              <FieldDescription>
                Tiện ích sẽ mở tab ẩn gia hạn cookie đăng nhập sau mỗi{" "}
                {interval} phút
              </FieldDescription>
            </FieldContent>
            <Switch
              id="refreshCookieTab"
              checked={!notOpenRefreshCookieTab}
              onCheckedChange={(e) => {
                chrome.storage.local.set({ notOpenRefreshCookieTab: !e }, () =>
                  toggleOpenRefreshCookieTab(!e),
                );
              }}
            />
          </Field>
        </FieldGroup>
      </DialogContent>
    </Dialog>
  );
}
