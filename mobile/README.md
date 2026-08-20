# 📱 Mobile Telemedicine App (React Native & Expo)

[![Client](https://img.shields.io/badge/Client-Expo%20Mobile-blue.svg)](#)
[![Port](https://img.shields.io/badge/Metro%20Port-8081-green.svg)](#)
[![Framework](https://img.shields.io/badge/Framework-React%20Native%20%7C%20Expo%20SDK%2050%2B-purple.svg)](#)
[![Platforms](https://img.shields.io/badge/Platforms-Android%20%7C%20iOS-orange.svg)](#)

The **Mobile Telemedicine Application** is a cross-platform mobile client engineered with Expo and React Native. It allows patients to perform surgical wound photo evaluations from their smartphones, receive immediate AI triage, export clinical PDF reports, and view surgeon directives.

---

## 🌟 Mobile Features

1. **Multi-Photo Wound Assessment (Up to 4 Angles)**:
   - Capture live camera photos or select from device photo library with `expo-image-picker`.
   - Real-time previews, photo deletion, and high-resolution multipart uploads to the Vision AI classifier.
2. **Automated Clinical PDF Generation & Sharing**:
   - Generates official clinical postoperative reports via `expo-print`.
   - Instantly share or print PDF documents to WhatsApp, Email, or cloud storage via `expo-sharing` and `expo-file-system`.
3. **Adaptive Keyboard Navigation**:
   - Uses real-time native keyboard height listeners (`keyboardDidShow`/`keyboardDidHide`) ensuring smooth form input visibility without obscuring text fields.
4. **Dark Mode & Light Mode Theming**:
   - Smooth theme transitions with persistent color tokens and high-contrast clinical color palettes.

---

## 📡 Dynamic Backend Service Discovery

The mobile app dynamically resolves local LAN endpoints via `mobile/src/services/api.js`:

```javascript
const LOCAL_IP = '192.168.3.121'; // Set to your computer's local IP address
```

---

## 🚀 Running on Mobile (Expo Go)

1. Navigate to the mobile directory and install dependencies:
   ```bash
   cd mobile
   npm install
   ```

2. Start the Expo Metro Bundler:
   ```bash
   npm start
   # Or clear cache:
   npx expo start -c
   ```

3. Open **Expo Go** on your Android or iOS device and scan the displayed QR code.
