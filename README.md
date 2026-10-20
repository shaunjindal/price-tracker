# Price Tracker (Home Furnishing)

price-tracker/
  backend/   Node + Express API (deploy on Render free tier)
  app/       React Native (Expo) source: App.js, src/, eas.json

## 1. Backend
cd backend && npm install && npm start
Test: http://localhost:4000/api/products?q=double&category=bedsheets
Deploy: see backend/README.md

## 2. App (Expo)
npx create-expo-app@latest PriceTracker --template blank
cd PriceTracker
npx expo install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context
Copy app/App.js, app/src/ and app/eas.json into PriceTracker (replace App.js).
Edit src/config.js with your backend URL.
Run: npx expo start (scan QR with the Expo Go app)

## 3. Build the APK
npm i -g eas-cli
eas login
eas build:configure   (if asked)
eas build -p android --profile preview
Download the .apk link when the build finishes and install on your phone.
(In app.json add:  "android": { "package": "com.yourname.pricetracker" } )
