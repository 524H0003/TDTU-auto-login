document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["username", "password", "interval"], (data) => {
    if (data.username)
      document.getElementById("username").value = data.username;
    if (data.password)
      document.getElementById("password").value = data.password;
    if (data.interval)
      document.getElementById("interval").value = data.interval;
  });

  document.getElementById("saveBtn").addEventListener("click", () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const interval = parseFloat(document.getElementById("interval").value) || 3;

    chrome.storage.local.set({ username, password, interval }, () => {
      document.getElementById("status").innerText = "Đã lưu thành công!";

      chrome.runtime.sendMessage({
        action: "start_alarm",
        interval: interval,
      });

      setTimeout(() => {
        document.getElementById("status").innerText = "";
      }, 2000);
    });
  });
});
