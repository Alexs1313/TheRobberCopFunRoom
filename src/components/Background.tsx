import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../themme/colors';

const Background = ({
  children,
  bounce = true,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  bounce?: boolean;
}) => {
  return (
    <LinearGradient
      colors={['rgb(16, 30, 152)', 'rgb(4, 1, 25)']}
      style={styles.background}>
      <ScrollView
        bounces={bounce}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  fill: {
    flex: 1,
  },
});

export default Background;
