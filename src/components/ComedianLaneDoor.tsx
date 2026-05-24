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

type ComedianLaneDoorProps = {
  title: string;
  badge: string;
  caption: string;
  image: ImageSourcePropType;
  colors: string[];
  borderColor: string;
  badgeColor: string;
  badgeBackground: string;
  marginTop?: number;
  onPress: () => void;
};

const ComedianLaneDoor = ({
  title,
  badge,
  caption,
  image,
  colors,
  borderColor,
  badgeColor,
  badgeBackground,
  marginTop = 64,
  onPress,
}: ComedianLaneDoorProps) => {
  return (
    <Pressable onPress={onPress}>
      <LinearGradient
        colors={colors}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={[laneDoorSheet.arsenalDoor, {borderColor, marginTop}]}>
        <View style={laneDoorSheet.doorPad}>
          <View>
            <Text
              style={[
                laneDoorSheet.crewSigil,
                {backgroundColor: badgeBackground, color: badgeColor},
              ]}>
              {badge}
            </Text>
            <Text style={laneDoorSheet.doorHeadline}>{title}</Text>
            <Text style={laneDoorSheet.doorTeaser}>{caption}</Text>
          </View>
          <View style={laneDoorSheet.mascotFrame}>
            <Image source={image} style={laneDoorSheet.mascotCutout} />
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
};

const laneDoorSheet = StyleSheet.create({
  arsenalDoor: {
    height: 144,
    borderWidth: 1,
    borderRadius: 22,
    overflow: 'hidden',
  },
  doorPad: {
    padding: 20,
  },
  crewSigil: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    overflow: 'hidden',
    borderRadius: 999,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  doorHeadline: {
    marginTop: 14,
    color: '#FFFFFF',
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800',
  },
  doorTeaser: {
    marginTop: 6,
    color: 'rgba(255,255,255,0.62)',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  mascotFrame: {
    position: 'absolute',
    right: 2,
    bottom: 0,
    width: 108,
    height: 126,
    overflow: 'hidden',
  },
  mascotCutout: {
    position: 'absolute',
    bottom: 0,
    resizeMode: 'contain',
  },
});

export default ComedianLaneDoor;
