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

import {images} from '../assets/loungeVisuals';

type PunchlineTileProps = {
  author: string;
  authorColor?: string;
  authorImage: ImageSourcePropType;
  text: string;
  isSaved: boolean;
  onShare: () => void;
  onToggleSaved: () => void;
  minHeight?: number;
};

const PunchlineTile = ({
  author,
  authorColor = '#7FA8FF',
  authorImage,
  text,
  isSaved,
  onShare,
  onToggleSaved,
  minHeight = 184,
}: PunchlineTileProps) => {
  return (
    <LinearGradient
      colors={['#0745E733', 'rgba(12,21,115,0.3)']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={[punchlineTileSheet.witPanel, {minHeight}]}>
      <View style={punchlineTileSheet.witPad}>
        <View style={punchlineTileSheet.comedianRail}>
          <View style={punchlineTileSheet.comedianSeal}>
            <Image source={authorImage} style={punchlineTileSheet.comedianPortrait} />
          </View>
          <Text style={[punchlineTileSheet.comedianTag, {color: authorColor}]}>
            {author}
          </Text>
        </View>

        <Text style={punchlineTileSheet.witBodyCopy}>{text}</Text>

        <View style={punchlineTileSheet.witActionRail}>
          <Pressable style={punchlineTileSheet.witActionChip} onPress={onShare}>
            <Image source={images.share} />
            <Text style={punchlineTileSheet.witActionLabel}>Share</Text>
          </Pressable>
          <Pressable
            style={[
              punchlineTileSheet.witActionChip,
              isSaved && punchlineTileSheet.witActionChipMarked,
            ]}
            onPress={onToggleSaved}>
            <Image
              source={isSaved ? images.saved : images.save}
            />
            <Text
              style={[
                punchlineTileSheet.witActionLabel,
                isSaved && punchlineTileSheet.witActionLabelMarked,
              ]}>
              {isSaved ? 'Saved' : 'Save'}
            </Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
};

const punchlineTileSheet = StyleSheet.create({
  witPanel: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(127,168,255,0.25)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  witPad: {
    padding: 20,
  },
  comedianRail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  comedianSeal: {
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
  comedianPortrait: {
    width: 20,
    height: 33,
    top: 3,
  },
  comedianTag: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  witBodyCopy: {
    marginTop: 14,
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 24,
  },
  witActionRail: {
    flexDirection: 'row',
    marginTop: 16,
  },
  witActionChip: {
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
  witActionChipMarked: {
    borderColor: 'rgba(255,215,0,0.75)',
    backgroundColor: 'rgba(255,215,0,0.12)',
  },
  witActionLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
  },
  witActionLabelMarked: {
    color: '#FFD700',
  },
});

export default PunchlineTile;
