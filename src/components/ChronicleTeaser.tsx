import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {images} from '../assets/loungeVisuals';

type TaleTeaserProps = {
  title: string;
  preview: string;
  isLiked: boolean;
  onToggleLike: () => void;
  onRead: () => void;
};

const ChronicleTeaser = ({
  title,
  preview,
  isLiked,
  onToggleLike,
  onRead,
}: TaleTeaserProps) => {
  return (
    <LinearGradient
      colors={['#0745E733', 'rgba(12,21,115,0.3)']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={taleTeaserSheet.chroniclePanel}>
      <View style={taleTeaserSheet.chroniclePad}>
        <LinearGradient
          colors={['#0745E7', '#7FA8FF']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={taleTeaserSheet.chronicleCrown}
        />
        <Pressable
          style={[
            taleTeaserSheet.heartSigil,
            isLiked && taleTeaserSheet.heartSigilLit,
          ]}
          onPress={onToggleLike}>
          <Image
            source={isLiked ? images.storyLiked : images.storyLike}
          />
        </Pressable>

        <Text style={taleTeaserSheet.chronicleHeadline}>{title}</Text>
        <Text style={taleTeaserSheet.chronicleExcerpt}>{preview}</Text>

        <Pressable onPress={onRead}>
          <LinearGradient
            colors={['#0745E766', '#0C157380']}
            start={{x: 0.12, y: 0}}
            end={{x: 0.9, y: 1}}
            style={taleTeaserSheet.chronicleCta}>
            <Text style={taleTeaserSheet.chronicleCtaCopy}>
              {'Read Full Story \u2192'}
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
    </LinearGradient>
  );
};

const taleTeaserSheet = StyleSheet.create({
  chroniclePanel: {
    minHeight: 204,
    marginTop: 22,
    borderWidth: 1,
    borderColor: 'rgba(127,168,255,0.25)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  chroniclePad: {
    padding: 20,
  },
  chronicleCrown: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#0745E7',
  },
  heartSigil: {
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
  heartSigilLit: {
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.25)',
    backgroundColor: 'rgba(255,215,0,0.16)',
  },
  chronicleHeadline: {
    maxWidth: 286,
    marginTop: 12,
    color: '#FFFFFF',
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '800',
  },
  chronicleExcerpt: {
    marginTop: 14,
    color: 'rgba(255,255,255,0.62)',
    fontSize: 15,
    lineHeight: 22,
  },
  chronicleCta: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    marginTop: 18,
    borderWidth: 1,
    borderColor: 'rgba(127,168,255,0.25)',
    borderRadius: 14,
  },
  chronicleCtaCopy: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '700',
  },
});

export default ChronicleTeaser;
