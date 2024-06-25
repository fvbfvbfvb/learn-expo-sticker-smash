import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Platform } from 'react-native';
import ImageViewer from './components/ImageViewer';
import Button from './components/Button';
import * as ImagePicker from 'expo-image-picker';
import { useState, useRef } from 'react';
import IconButton from './components/IconButton';
import CircleButton from './components/CircleButton';
import EmojiPicker from './components/EmojiPicker';
import EmojiList from './components/EmojiList';
import EmojiSticker from './components/EmojiSticker';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import domToImage from 'dom-to-image'

const PlaceholderImage = require('./assets/images/background-image.png')

export default function App() {
  const [status, requestPermission] = MediaLibrary.usePermissions();
  if (status === null) {
    requestPermission();
  }
  const imageRef = useRef();
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAppOptions, setShowAppOptions] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pickedEmoji, setPickedEmoji] = useState(null);

  const onReset = () => {
    setShowAppOptions(false);
  }
  const onAddSticker = () => {
    setIsModalVisible(true);
  }

  const onModalClose = () => {
    setIsModalVisible(false);
  }

  const onSaveImageAsync = async () => {
    if (Platform.OS !== "web") {
      try {
        const localUri = await captureRef(imageRef, {height:400, quality:1});
        await MediaLibrary.saveToLibraryAsync(localUri)
        if (localUri) {
          alert("Saved!")
        }
      }catch(e) {
        console.log(e)
      }
    } else {
     try {
       const dataUri = await domToImage.toJpeg(imageRef.current, {
         quality:1,
         width:320,
         height:440,
       });
      const link = document.createElement('a');
      link.download = 'sticker-smash.jpeg';
      link.href = dataUri;
      link.click();
      } catch (e) {
      console.log(e);
     }
    }
  }

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 1 });
    if (!result.canceled) {
      console.log(result);
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else {
      alert("You did not select any image.");
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* <Text style={{ color: '#fff' }}>Open up App.js to start working on your app!44421123332</Text> */}
      <View ref={imageRef} collapsable={false} style={styles.imageContainer}>
        {/* <Image source={PlaceholderImage} style={styles.image}></Image> */}
        <ImageViewer placeholderImageSource={PlaceholderImage} style={styles.imageContainer}
          selectedImage={selectedImage} />
        {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji}></EmojiSticker>}
      </View>
      {showAppOptions ? (<View style={styles.optionContainer} >
        <View style={styles.optionRow}>
          <IconButton icon="refresh" label="Reset" onPress={onReset} />
          <CircleButton onPress={onAddSticker} />
          <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
        </View>
      </View>) : (
        <View style={styles.footerContainer}>
          <Button label="Choose a photo" theme="primary" onPress={pickImageAsync} />
          <Button label="Use this photo" onPress={() => setShowAppOptions(true)} />
        </View>
      )
      }
      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
      </EmojiPicker>
      <StatusBar style="dark" />
    </GestureHandlerRootView >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  optionContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionRow: {
    alignItems: 'center',
    flexDirection: 'row',
  }
});
