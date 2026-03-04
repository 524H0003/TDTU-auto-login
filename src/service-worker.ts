import { IAppSetting, LocalStorage } from "./types";

const TDTURegex = /^https?:\/\/.*\.tdtu\.edu\.vn(:\d+)?\/.*$/;

// Enable logging with timestamp
const originalLog = console.log;
console.log = function (...args) {
  originalLog.apply(console, [`[${new Date().toISOString()}]`, ...args]);
};

function createAlarm(minutes: number) {
  chrome.alarms.create("autoLoginAlarm", {
    periodInMinutes: minutes,
  });
  console.log(`Đã đặt báo thức chạy mỗi ${minutes} phút.`);
}

function executeScript(tab: chrome.tabs.Tab) {
  const target = tab.url!.split(".")[0]!.split("/").at(-1);

  chrome.storage.local.get<LocalStorage>(
    ["active", "username", "password"],
    async ({ active, username, password }) => {
      if (!active) return;

      await chrome.scripting
        .executeScript({
          world: "MAIN",
          target: { tabId: tab.id! },
          files: ["./dist/context/" + target + ".js"],
        })
        .then(() => {
          console.log("Đã chèn thành công!");
        })
        .catch((err) => {
          console.error("Lỗi khi chèn script\n", err);
        });

      await chrome.scripting.executeScript({
        target: { tabId: tab.id! },
        world: "MAIN",
        args: [{ username, password }],
        func: (creds) => {
          if (typeof window.initAutoLogin === "function") {
            window.initAutoLogin(creds);
          }
        },
      });
    },
  );
}

chrome.storage.local.get<IAppSetting>(["interval"], (data) => {
  if (data.interval) createAlarm(data.interval);
  else {
    chrome.storage.local.set({ interval: 3 });
    createAlarm(3);
  }
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "start_alarm") {
    chrome.alarms.clear("autoLoginAlarm");
    createAlarm(request.interval);
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url && TDTURegex.test(tab.url)) {
    const target = tab.url!.split(".")[0]!.split("/").at(-1),
      module = await import(`./context/${target}.ts`),
      runOnUpdate = module.runOnUpdate || false;

    if (runOnUpdate) executeScript(tab);
  }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);

    if (tab.url && TDTURegex.test(tab.url)) {
      executeScript(tab);
    }
  } catch (error) {
    console.error("Lỗi khi lấy thông tin tab:", error);
  }
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "autoLoginAlarm") {
    chrome.tabs.query(
      { url: ["*://*.tdtu.edu.vn/*", "*://*.tdtu.edu.vn:*/*"] },
      (tabs) => {
        if (tabs.length > 0) {
          tabs.forEach(async (e) => {
            executeScript(e);

            const target = e.url!.split(".")[0]!.split("/").at(-1),
              module = await import(`./context/${target}.ts`),
              updateCookie = module.updateCookie || false;

            if (updateCookie) {
              chrome.storage.local.get<IAppSetting>(
                ["active"],
                async ({ active }) => {
                  if (!active) return;

                  const hostUrl = "https://sso.tdt.edu.vn/Authenticate.aspx",
                    url = new URL(hostUrl);

                  url.searchParams.append("ReturnUrl", e.url);

                  chrome.tabs.create(
                    { url: url.toString(), active: false },
                    (tab) => {
                      chrome.tabs.onUpdated.addListener(
                        function listener(tabId, info) {
                          if (tabId === tab.id && info.status === "complete") {
                            chrome.tabs.onUpdated.removeListener(listener);

                            setTimeout(() => {
                              chrome.tabs.remove(tabId);
                              console.log(
                                "Đã làm mới cookie và đóng tab " + tab.url,
                              );
                            }, 500);
                          }
                        },
                      );
                    },
                  );
                },
              );
            }
          });
        } else {
          console.log(
            "Báo thức reo nhưng không tìm thấy tab TDTU nào đang mở.",
          );
        }
      },
    );
  }
});
