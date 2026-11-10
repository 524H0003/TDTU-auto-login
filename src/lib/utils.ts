export function clearAllCookies() {
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

    // Thử xóa cookie ở path mặc định và root path
    document.cookie = `${name}=; max-age=0; path=/;`;
    document.cookie = `${name}=; max-age=0;`;
  }
}
