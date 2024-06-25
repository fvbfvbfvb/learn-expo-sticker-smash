import { View, Image } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export default function EmojiSticker({ imageSize, stickerSource }) {
    const scaleImage = useSharedValue(imageSize);
    const translatedX = useSharedValue(0);
    const translatedY = useSharedValue(0);

    const drag = Gesture.Pan().onChange(
        (event) => {
            translatedX.value += event.changeX
            translatedY.value += event.changeY
            console.log(event)
            console.log(translatedX.value, translatedY.value)
        }
    )

    const doubleTap = Gesture.Tap().
        numberOfTaps(2).
        onStart(() => {
            if (scaleImage.value != imageSize * 2) {
                scaleImage.value = imageSize * 2
            }
        })

    const imageStyle = useAnimatedStyle(() => {
        return {
            width: withSpring(scaleImage.value),
            height: withSpring(scaleImage.value),
        }
    })

    const containerStyle = useAnimatedStyle(() => {
        return {
            transform: [{
                translateX: translatedX.value,
            }, {
                translateY: translatedY.value,
            }]
        }
    })

    return (
        <GestureDetector gesture={drag}>
            <Animated.View style={[containerStyle, { top: -350 }]}>
                <GestureDetector gesture={doubleTap}>
                    <Animated.Image
                        source={stickerSource}
                        resizeMode='contain'
                        style={[imageStyle, { width: imageSize, height: imageSize }]}>
                    </Animated.Image>
                </GestureDetector>
            </Animated.View >
        </GestureDetector>
    )
}