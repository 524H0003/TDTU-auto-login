chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "start_alarm") {
    chrome.alarms.clear("autoLoginAlarm");
    chrome.alarms.create("autoLoginAlarm", {
      periodInMinutes: request.interval,
    });
    console.log(`Đã đặt báo thức chạy mỗi ${request.interval} phút.`);
  }
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "autoLoginAlarm") {
    chrome.tabs.query({ url: "*://*.tdtu.edu.vn/*" }, (tabs) => {
      if (tabs.length > 0) {
        tabs.forEach((element) => {
          const target = element.url!.split(".")[0]!.split("/").at(-1);

          chrome.scripting
            .executeScript({
              target: { tabId: element.id! },
              files: ["./dist/context/" + target + ".js"],
            })
            .then(() => {
              console.log("Đã chèn thành công!");
            })
            .catch((err) => {
              console.error("Lỗi khi chèn script:", err);
            });
        });
      } else {
        console.log("Báo thức reo nhưng không tìm thấy tab TDTU nào đang mở.");
      }
    });
  }
});
