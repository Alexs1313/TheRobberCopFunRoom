import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {images} from '../assets/images';

type JokeCardProps = {
  author: string;
  authorColor?: string;
  authorImage: ImageSourcePropType;
  text: string;
  isSaved: boolean;
  onShare: () => void;
  onToggleSaved: () => void;
  minHeight?: number;
};

const JokeCard = ({
  author,
  authorColor = '#7FA8FF',
  authorImage,
  text,
  isSaved,
  onShare,
  onToggleSaved,
  minHeight = 184,
}: JokeCardProps) => {
  return (
    <LinearGradient
      colors={['#0745E733', 'rgba(12,21,115,0.3)']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={[styles.card, {minHeight}]}>
      <View style={styles.inner}>
        <View style={styles.authorRow}>
          <View style={styles.avatar}>
            <Image source={authorImage} style={styles.avatarImage} />
          </View>
          <Text style={[styles.authorText, {color: authorColor}]}>
            {author}
          </Text>
        </View>

        <Text style={styles.jokeText}>{text}</Text>

        <View style={styles.actionRow}>
          <Pressable style={styles.actionButton} onPress={onShare}>
            <Image source={images.share} />
            <Text style={styles.actionText}>Share</Text>
          </Pressable>
          <Pressable
            style={[styles.actionButton, isSaved && styles.savedButton]}
            onPress={onToggleSaved}>
            <Image
              source={isSaved ? images.saved : images.save}
            />
            <Text style={[styles.actionText, isSaved && styles.savedText]}>
              {isSaved ? 'Saved' : 'Save'}
            </Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(127,168,255,0.25)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  inner: {
    padding: 20,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    marginRight: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(127,168,255,0.25)',
    borderRadius: 15,
    backgroundColor: 'rgba(127,168,255,0.25)',
  },
  avatarImage: {
    width: 20,
    height: 33,
    top: 3,
  },
  authorText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  jokeText: {
    marginTop: 14,
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 24,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 84,
    height: 34,
    marginRight: 12,
    paddingHorizontal: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  savedButton: {
    borderColor: 'rgba(255,215,0,0.75)',
    backgroundColor: 'rgba(255,215,0,0.12)',
  },
  actionText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
  },
  savedText: {
    color: '#FFD700',
  },
});

export default JokeCard;
