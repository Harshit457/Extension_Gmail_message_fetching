# 📬 Auto OTP Fetcher – Chrome Extension

Tired of switching tabs just to copy-paste OTPs from your email?  
**Auto OTP Fetcher** is here to save your time and effort!

This Chrome extension automatically reads OTPs from your Gmail and pastes them into relevant input fields – no more tab-switching or manual copy-pasting.

---

## 🚀 Features

- ✅ Automatically fetches OTPs from your Gmail inbox  
- ✅ Detects and pastes OTPs into the right input fields on websites  
- ✅ Works silently in the background  
- ✅ Secure and user-consented access to Gmail  
- ✅ Saves time during sign-ups, logins, and verifications

---

## 🔐 Permissions & Security

This extension uses **OAuth2** to access your Gmail with **read-only** permission, and only scans for OTP-related messages.  
We **do not store**, **share**, or **sell** your data.

---

## 🛠 How It Works

1. Grant the extension access to your Gmail (OAuth login)
2. The extension scans your inbox for OTP emails in real-time
3. Extracts the OTP using pattern matching
4. Automatically fills it into detected OTP input fields on websites

---

## 🧩 Installation

1. Clone or download this repository
2. Go to `chrome://extensions/` in your Chrome browser
3. Enable **Developer Mode**
4. Click **Load unpacked**
5. Select the folder containing this extension

---

## 📌 Requirements

- A Gmail account
- Chrome browser
- OTPs in the body of email in standard formats (e.g., `Your OTP is 123456`)

---

## 🧪 Tech Stack

- JavaScript
- Gmail API
- Chrome Extensions API
- OAuth 2.0

---

## 📞 Support & Feedback

Found a bug or have suggestions?  
Feel free to open an issue or contribute to the repo!

---

## 🛡 Disclaimer

This extension is intended for personal use only.  
By using it, you consent to read-only access to your Gmail for OTP extraction purposes.
