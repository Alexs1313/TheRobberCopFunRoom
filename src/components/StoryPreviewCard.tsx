import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type StoryPreviewCardProps = {
  title: string;
  preview: string;
  isLiked: boolean;
  onToggleLike: () => void;
  onRead: () => void;
};

const StoryPreviewCard = ({
  title,
  preview,
  isLiked,
  onToggleLike,
  onRead,
}: StoryPreviewCardProps) => {
  return (
    <LinearGradient
      colors={['#0745E733', 'rgba(12,21,115,0.3)']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.card}>
      <View style={styles.inner}>
        <LinearGradient
          colors={['#0745E7', '#7FA8FF']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.topGlow}
        />
        <Pressable
          style={[styles.heartButton, isLiked && styles.likedButton]}
          onPress={onToggleLike}>
          <Image
            source={
              isLiked
                ? require('../../rmmassets/rmmimgs/stoorylikerd.png')
                : require('../../rmmassets/rmmimgs/storylike.png')
            }
          />
        </Pressable>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.previewText}>{preview}</Text>

        <Pressable onPress={onRead}>
          <LinearGradient
            colors={['#0745E766', '#0C157380']}
            start={{x: 0.12, y: 0}}
            end={{x: 0.9, y: 1}}
            style={styles.readButton}>
            <Text style={styles.readButtonText}>{'Read Full Story \u2192'}</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    minHeight: 204,
    marginTop: 22,
    borderWidth: 1,
    borderColor: 'rgba(127,168,255,0.25)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  inner: {
    padding: 20,
  },
  topGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#0745E7',
  },
  heartButton: {
    position: 'absolute',
    top: 18,
    right: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  likedButton: {
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.25)',
    backgroundColor: 'rgba(255,215,0,0.16)',
  },
  title: {
    maxWidth: 286,
    marginTop: 12,
    color: '#FFFFFF',
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '800',
  },
  previewText: {
    marginTop: 14,
    color: 'rgba(255,255,255,0.62)',
    fontSize: 15,
    lineHeight: 22,
  },
  readButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    marginTop: 18,
    borderWidth: 1,
    borderColor: 'rgba(127,168,255,0.25)',
    borderRadius: 14,
  },
  readButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '700',
  },
});

export default StoryPreviewCard;
