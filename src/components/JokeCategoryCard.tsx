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

type JokeCategoryCardProps = {
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

const JokeCategoryCard = ({
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
}: JokeCategoryCardProps) => {
  return (
    <Pressable onPress={onPress}>
      <LinearGradient
        colors={colors}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={[styles.card, {borderColor, marginTop}]}>
        <View style={styles.inner}>
          <View>
            <Text
              style={[
                styles.badge,
                {backgroundColor: badgeBackground, color: badgeColor},
              ]}>
              {badge}
            </Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.caption}>{caption}</Text>
          </View>
          <View style={styles.characterFrame}>
            <Image source={image} style={styles.characterImage} />
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 144,
    borderWidth: 1,
    borderRadius: 22,
    overflow: 'hidden',
  },
  inner: {
    padding: 20,
  },
  badge: {
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
  title: {
    marginTop: 14,
    color: '#FFFFFF',
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800',
  },
  caption: {
    marginTop: 6,
    color: 'rgba(255,255,255,0.62)',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  characterFrame: {
    position: 'absolute',
    right: 2,
    bottom: 0,
    width: 108,
    height: 126,
    overflow: 'hidden',
  },
  characterImage: {
    position: 'absolute',
    bottom: 0,
    resizeMode: 'contain',
  },
});

export default JokeCategoryCard;
