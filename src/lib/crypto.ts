export async function encryptData(plainText: string, password: string) {
  const encoder = new TextEncoder(),
    keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"],
    ),
    key = await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: window.crypto.getRandomValues(new Uint8Array(16)),
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-CBC", length: 256 },
      false,
      ["encrypt"],
    ),
    iv = window.crypto.getRandomValues(new Uint8Array(16)),
    encrypted = await window.crypto.subtle.encrypt(
      { name: "AES-CBC", iv: iv },
      key,
      encoder.encode(plainText),
    );

  return { iv: iv, encryptedData: new Uint8Array(encrypted) };
}

async function decryptData(
  encryptedData: BufferSource,
  password: string,
  iv: BufferSource,
) {
  // Generate the same key from the password
  const encoder = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"],
  );
  const key = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: window.crypto.getRandomValues(new Uint8Array(16)),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-CBC", length: 256 },
    false,
    ["decrypt"],
  );
  // Decrypt the data
  const decrypted = await window.crypto.subtle.decrypt(
    { name: "AES-CBC", iv: iv },
    key,
    encryptedData,
  );
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}
