import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type JudgeCardProps = {
  name: string;
  subtitle: string;
  image: ImageSourcePropType;
  selected: boolean;
  subtitleColor?: string;
  onPress: () => void;
};

const JudgeCard = ({
  name,
  subtitle,
  image,
  selected,
  subtitleColor = '#AFC6FF',
  onPress,
}: JudgeCardProps) => {
  return (
    <Pressable
      style={[styles.card, selected && styles.selectedCard]}
      onPress={onPress}>
      <View style={styles.avatar}>
        <Image source={image} style={styles.image} />
      </View>
      {selected && (
        <View style={styles.checkMark}>
          <Text style={styles.checkMarkText}>✓</Text>
        </View>
      )}
      <Text style={styles.name}>{name}</Text>
      <Text style={[styles.subtitle, {color: subtitleColor}]}>{subtitle}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    minHeight: 113,
    paddingTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  selectedCard: {
    borderColor: '#7FA8FF80',
    backgroundColor: 'rgba(7,69,231,0.45)',
  },
  avatar: {
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
  image: {
    width: 34,
    height: 56,
    top: 6,
    resizeMode: 'contain',
  },
  checkMark: {
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
  checkMarkText: {
    color: '#0C1573',
    fontSize: 8,
    lineHeight: 14,
    fontWeight: '600',
  },
  name: {
    marginTop: 6,
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 3,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '500',
  },
});

export default JudgeCard;
