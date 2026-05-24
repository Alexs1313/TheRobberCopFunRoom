import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type VerdictBenchProps = {
  name: string;
  subtitle: string;
  image: ImageSourcePropType;
  selected: boolean;
  subtitleColor?: string;
  onPress: () => void;
};

const BenchPickTile = ({
  name,
  subtitle,
  image,
  selected,
  subtitleColor = '#AFC6FF',
  onPress,
}: VerdictBenchProps) => {
  return (
    <Pressable
      style={[benchPickSheet.jurorTile, selected && benchPickSheet.jurorTileLit]}
      onPress={onPress}>
      <View style={benchPickSheet.jurorSeal}>
        <Image source={image} style={benchPickSheet.jurorPortrait} />
      </View>
      {selected && (
        <View style={benchPickSheet.jurorCheck}>
          <Text style={benchPickSheet.jurorCheckGlyph}>✓</Text>
        </View>
      )}
      <Text style={benchPickSheet.jurorName}>{name}</Text>
      <Text style={[benchPickSheet.jurorMood, {color: subtitleColor}]}>
        {subtitle}
      </Text>
    </Pressable>
  );
};

const benchPickSheet = StyleSheet.create({
  jurorTile: {
    flex: 1,
    alignItems: 'center',
    minHeight: 113,
    paddingTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  jurorTileLit: {
    borderColor: '#7FA8FF80',
    backgroundColor: 'rgba(7,69,231,0.45)',
  },
  jurorSeal: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 52,
    height: 52,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(127,168,255,0.35)',
    borderRadius: 26,
    backgroundColor: 'rgba(127,168,255,0.22)',
  },
  jurorPortrait: {
    width: 34,
    height: 56,
    top: 6,
    resizeMode: 'contain',
  },
  jurorCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#7FA8FF',
  },
  jurorCheckGlyph: {
    color: '#0C1573',
    fontSize: 8,
    lineHeight: 14,
    fontWeight: '600',
  },
  jurorName: {
    marginTop: 6,
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800',
  },
  jurorMood: {
    marginTop: 3,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '500',
  },
});

export default BenchPickTile;
