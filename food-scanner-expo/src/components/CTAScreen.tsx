import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ImageSourcePropType, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VideoView, useVideoPlayer } from 'expo-video';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export interface CTAScreenProps {
  image?: ImageSourcePropType;
  video?: any; // Video source (require() or URI)
  title: string;
  description: string;
  buttonText: string;
  onButtonPress: () => void;
}

export function CTAScreen({
  image,
  video,
  title,
  description,
  buttonText,
  onButtonPress,
}: CTAScreenProps) {
  // Create video player - expo-video accepts require() directly or null
  const player = useVideoPlayer(video || null, (player) => {
    if (video) {
      player.loop = true;
      player.muted = true;
      player.play();
    }
  });

  // Animate button opacity for permission screen (when video is present)
  const buttonOpacity = useSharedValue(video ? 0 : 1);

  useEffect(() => {
    if (video) {
      // Delay button appearance by 1500ms for permission screen
      const timer = setTimeout(() => {
        buttonOpacity.value = withTiming(1, { duration: 300 });
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [video, buttonOpacity]);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-white">
      <View className="flex-1 items-center p-6">
        <View className="flex-1 items-center justify-center">
          {video ? (
            <VideoView
              player={player}
              style={styles.video}
              contentFit="contain"
              nativeControls={false}
            />
          ) : image ? (
            <Image source={image} className="w-84 h-60 mb-6" resizeMode="contain" />
          ) : null}
          <View className="px-6">
            <Text className="text-title-large font-bold text-gray-90 mb-4 text-center">{title}</Text>
            <Text className="text-base text-gray-70 text-center mb-8">{description}</Text>
          </View>
        </View>
        <Animated.View style={buttonAnimatedStyle} className="w-full">
          <TouchableOpacity
            onPress={onButtonPress}
            className="bg-blue-50 px-8 py-4 rounded-2xl w-full"
            activeOpacity={0.7}
          >
            <Text className="text-white font-semibold text-base text-center">{buttonText}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  video: {
    width: 336, // w-84 = 336px
    height: 280, // h-60 = 240px
    marginBottom: 12, // mb-6 = 24px
  },
});
