import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import WebView from 'react-native-webview';
import {images} from '../assets/loungeVisuals';

const htmlLoader = `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      background: transparent;
      overflow: hidden;
    }

    .loader {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }

    .jimu-primary-loading:before,
    .jimu-primary-loading:after {
      position: absolute;
      top: 0;
      content: '';
    }

    .jimu-primary-loading:before {
      left: -19.992px;
    }

    .jimu-primary-loading:after {
      left: 19.992px;
      animation-delay: 0.32s !important;
    }

    .jimu-primary-loading:before,
    .jimu-primary-loading:after,
    .jimu-primary-loading {
      background: #076fe5;
      animation: loading-keys-app-loading 0.8s infinite ease-in-out;
      width: 13.6px;
      height: 32px;
      border-radius: 2px;
    }

    .jimu-primary-loading {
      text-indent: -9999em;
      margin: auto;
      position: absolute;
      right: calc(50% - 6.8px);
      top: calc(50% - 16px);
      animation-delay: 0.16s !important;
    }

    @keyframes loading-keys-app-loading {
      0%,
      80%,
      100% {
        opacity: .75;
        box-shadow: 0 0 #076fe5;
        height: 32px;
      }

      40% {
        opacity: 1;
        box-shadow: 0 -8px #076fe5;
        height: 40px;
      }
    }
  </style>
</head>
<body>
  <div class="loader">
    <div class="jimu-primary-loading"></div>
  </div>
</body>
</html>`;

const CurtainRiseLoader = () => {
  const loungeNavigator = useNavigation();

  useEffect(() => {
    const curtainTimer = setTimeout(() => {
      loungeNavigator.navigate('Onboard' as never);
    }, 6013);

    return () => {
      clearTimeout(curtainTimer);
    };
  }, [loungeNavigator]);

  return (
    <ImageBackground
      source={images.loaderBack}
      style={curtainRiseSheet.velvetStage}>
      <ScrollView
        contentContainerStyle={curtainRiseSheet.scrollArena}
        showsVerticalScrollIndicator={false}>
        <View style={curtainRiseSheet.logoAnchor}>
          <Image
            source={images.loaderLogo}
            style={{width: 250, height: 250, borderRadius: 52}}
          />
        </View>
        <View style={curtainRiseSheet.spinnerDock}>
          <WebView
            source={{html: htmlLoader}}
            scrollEnabled={false}
            originWhitelist={['*']}
            style={curtainRiseSheet.spinnerFrame}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default CurtainRiseLoader;

const curtainRiseSheet = StyleSheet.create({
  velvetStage: {
    flex: 1,
  },
  scrollArena: {
    flexGrow: 1,
  },
  logoAnchor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerDock: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    paddingBottom: 40,
  },
  spinnerFrame: {
    width: 260,
    height: 90,
    backgroundColor: 'transparent',
  },
});
