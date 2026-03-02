import { IAppSetting } from "./types";

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

  chrome.storage.local.get<IAppSetting>(["active"], async ({ active }) => {
    if (!active) return;

    await chrome.scripting
      .executeScript({
        target: { tabId: tab.id! },
        files: ["./dist/context/" + target + ".js"],
      })
      .then(() => {
        console.log("Đã chèn thành công!");
      })
      .catch((err) => {
        console.error("Lỗi khi chèn script\n", err);
      });
  });
}

chrome.storage.local.get<IAppSetting>(["interval"], (data) => {
  if (data.interval) createAlarm(data.interval);
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "start_alarm") {
    chrome.alarms.clear("autoLoginAlarm");
    createAlarm(request.interval);
  }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);

    if (tab.url && /^https?:\/\/.*\.tdtu\.edu\.vn\/.*$/.test(tab.url)) {
      executeScript(tab);
    }
  } catch (error) {
    console.error("Lỗi khi lấy thông tin tab:", error);
  }
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "autoLoginAlarm") {
    chrome.tabs.query({ url: "*://*.tdtu.edu.vn/*" }, (tabs) => {
      if (tabs.length > 0) {
        tabs.forEach((e) => executeScript(e));
      } else {
        console.log("Báo thức reo nhưng không tìm thấy tab TDTU nào đang mở.");
      }
    });
  }
});
