# chatApp

## Project description

This project's objective is to build a chat app for mobile devices using React Native. The app will
provide users with a chat interface and options to share images and their location.

## Key features

● A page where users can enter their name and choose a background color for the chat screen before joining the chat.
● A page displaying the conversation, as well as an input field and submit button.
● The chat must provide users with two additional communication features: sending images and location data.
● Data gets stored online and offline.

## Dependencies

+ React
+ ReactDOM
+ React-Scripts
+ React-Native
+ React-Navigation
+ React-native-gifted-chat
+ React-native-asyncStorage
+ Firebase
+ Expo
+ Expo-image-picker
+ Expo-location

## Tools used

+ React Native
+ Expo
+ Firebase Authentication (anonymously)
+ Firestore DB
+ Firebase Storage

## API

+ asyncStorage API
+ OS API

## set up this project

+ install expo-cli with

`npm install -g expo-cli`

+ clone repo to your hard drive
+ set up a Firebase project, a firestore DB that holds a 'messages' collection
+ set up a Storage with default configuration
+ go to components/Chat.js and set your firebaseConfig credentials

+ within root folder start of dev server by

`npm run start` OR `expo start`

+ run chatApp with an emulator/simulator of your choice or via the ExpoGo application on your physical device
