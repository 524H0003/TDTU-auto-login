import React from "react";

export default function PopupPage() {
  return (
    <div>
      <h3>Cài đặt Đăng nhập</h3>
      <label>Tài khoản:</label>
      <input type="text" id="username" placeholder="Nhập username..." />

      <label>Mật khẩu:</label>
      <input type="password" id="password" placeholder="Nhập password..." />

      <label>Thời gian (phút):</label>
      <input type="number" id="interval" value="3" min="1" />

      <button id="saveBtn">Lưu & Bắt đầu</button>
      <p id="status" style={{ color: "green", fontSize: "12px" }}></p>
    </div>
  );
}
