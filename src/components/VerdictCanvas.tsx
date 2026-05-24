import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../palette/verdictPalette';

const VerdictCanvas = ({
  children,
  bounce = true,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  bounce?: boolean;
}) => {
  return (
    <LinearGradient
      colors={[colors.backgroundTop, colors.backgroundBottom]}
      style={courtroomCanvasSheet.verdictBackdrop}>
      <ScrollView
        bounces={bounce}
        contentContainerStyle={courtroomCanvasSheet.scrollArena}
        showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </LinearGradient>
  );
};

const courtroomCanvasSheet = StyleSheet.create({
  verdictBackdrop: {
    flex: 1,
  },
  scrollArena: {
    flexGrow: 1,
  },
  stretchFill: {
    flex: 1,
  },
});

export default VerdictCanvas;
