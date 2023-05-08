# D-Sek App
This app is a mobile version of our page available at https://dsek.se. The app is "simply" a WebView wrapper around https://app.dsek.se (a version of the site customized to look like a native app). There are some extra features regarding deep-linking, notifications, dark/light mode and app-specific information which are added by the app.

The goal is, and probably should always be, to keep the app AS SIMPLE AS POSSIBLE. This way ALMOST ALL updates can be done purely by releasing a new version of the site and no changes needs to be done by the app.

## Communication between app and website
To communicate events and data between the app and website native window events are used. For example, the event `appSendPushNotification` is dispatched containing the notification token from the app. The event `appRefetch` is sent to force a data refetch on the site.

# How to deploy
## Android
1. Build with `npm run deploy:android` or `eas build --platform android` (as of writing)
2. Wait for the build to complete, then download the `.aab` file
3. Go to Google Play Console
4. Go to "Production" > "Create New Release"
5. Upload the file and add relevant changelog notes
6. Send to review and wait for it to finish
## iOS
1. Build with `npm run deploy:ios` or `eas build --platform ios` (as of writing)
2. Wait for the build to complete, then download the `.ipa` file
3. Use the "transporter" app (only available on MacOS) to upload the `.ipa` file to App Store Connect.
4. On app store connect:
   1. Go to "My Apps"
   2. Go to "D-sektionen"
   3. Create a new version next to "iOS App"
   4. Go down to "Builds" and select the newest built version (might take some minutes to appear after upload)
   5. It will say "Missing Compliance", click "Manage" and answer the questions. As of writing the answers are *"Standard encryption algorithms instead of, or in addition to, using or accessing the encryption within Apple's operating system"* and *"Not available in France"*
   1. Under "What's new in this version" add some changelog notes
   2. Click "Save" and "Add to review", then "Send to review"
   3. Wait for review to complete. *(It happens that we get rejected, usually just small fixes though)*