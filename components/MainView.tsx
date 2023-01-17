import React from 'react'
import { SafeAreaView } from 'react-native';
import WebView from 'react-native-webview';


const setupCode = `
window.isNativeApp = true;
true; // note: this is required, or you'll sometimes get silent failures
`;

const initialCode = `
    setTimeout(function() { 
        window.alert("Click me!");
      }, 1000);
    true; // note: this is required, or you'll sometimes get silent failures
  `;

const MainView: React.FC = () => {
  
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#121212'}}>
    {/* <TabNavigator /> */}
      <WebView
        style={{}}
        source={{ uri: 'https://member.dsek.se' }} 
        onMessage={(event) => {
          console.log(event);
          console.log(event.nativeEvent.data);
        }}
        injectedJavaScript={initialCode}
        injectedJavaScriptBeforeContentLoaded={setupCode}
        />
    </SafeAreaView>
  )
}

export default MainView