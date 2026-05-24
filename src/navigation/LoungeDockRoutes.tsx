import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import JokeArsenalArena from '../screens/JokeArsenalArena.tsx';
import WitVaultArchive from '../screens/WitVaultArchive.tsx';
import BenchScrollCourt from '../screens/BenchScrollCourt.tsx';
import ChronicleHall from '../screens/ChronicleHall.tsx';
import DuelTrialArena from '../screens/DuelTrialArena.tsx';
import {images} from '../assets/loungeVisuals';

const Tab = createBottomTabNavigator();

const dockGlowActive = '#FFD700';
const dockGlowIdle = 'rgba(255,255,255,0.48)';

type DockGlyphProps = {
  label: string;
  focused: boolean;
  source: ImageSourcePropType;
};

const DockGlyph = ({label, focused, source}: DockGlyphProps) => {
  const dockTint = focused ? dockGlowActive : dockGlowIdle;
  return (
    <View style={loungeDockSheet.dockGlyphWrap}>
      <View
        style={[
          loungeDockSheet.dockGlyphSeal,
          focused && loungeDockSheet.dockGlyphSealLit,
        ]}>
        <Image
          source={source}
          style={[
            loungeDockSheet.dockGlyphArt,
            focused && loungeDockSheet.dockGlyphArtLit,
          ]}
          resizeMode="contain"
          tintColor={dockTint}
        />
      </View>
      <Text style={[loungeDockSheet.dockGlyphCaption, {color: dockTint}]}>
        {label}
      </Text>
    </View>
  );
};

const DockGlyphJokes = ({focused}: {focused: boolean}) => (
  <DockGlyph label="Jokes" focused={focused} source={images.tabExplore} />
);

const DockGlyphSaved = ({focused}: {focused: boolean}) => (
  <DockGlyph label="Saved" focused={focused} source={images.tabSaved} />
);

const DockGlyphRate = ({focused}: {focused: boolean}) => (
  <DockGlyph label="Rate" focused={focused} source={images.tabRate} />
);

const DockGlyphStories = ({focused}: {focused: boolean}) => (
  <DockGlyph label="Stories" focused={focused} source={images.tabStories} />
);

const DockGlyphGame = ({focused}: {focused: boolean}) => (
  <DockGlyph label="Game" focused={focused} source={images.tabGame} />
);

const DockBackdrop = () => (
  <View pointerEvents="none" style={loungeDockSheet.dockBackdrop} />
);

const LoungeDockRoutes = () => {
  const safeHarborInsets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: dockGlowActive,
        tabBarInactiveTintColor: dockGlowIdle,
        tabBarStyle: [
          loungeDockSheet.dockRail,
          {
            height: 90,
            paddingBottom: Math.max(safeHarborInsets.bottom, 12),
          },
        ],
        tabBarBackground: DockBackdrop,
      }}>
      <Tab.Screen
        name="JokesScreen"
        component={JokeArsenalArena}
        options={{
          tabBarIcon: DockGlyphJokes,
        }}
      />
      <Tab.Screen
        name="SavedScreen"
        component={WitVaultArchive}
        options={{
          tabBarIcon: DockGlyphSaved,
        }}
      />
      <Tab.Screen
        name="RateJokeScreen"
        component={BenchScrollCourt}
        options={{
          tabBarIcon: DockGlyphRate,
        }}
      />
      <Tab.Screen
        name="StoriesScreen"
        component={ChronicleHall}
        options={{
          tabBarIcon: DockGlyphStories,
        }}
      />
      <Tab.Screen
        name="GamScreen"
        component={DuelTrialArena}
        options={{
          tabBarIcon: DockGlyphGame,
        }}
      />
    </Tab.Navigator>
  );
};

const loungeDockSheet = StyleSheet.create({
  dockRail: {
    elevation: 0,
    shadowOpacity: 0,
    paddingTop: 18,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderColor: '#111A5A',
    borderTopColor: '#111A5A',
  },
  dockBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#04082BFA',
  },
  dockGlyphSeal: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  dockGlyphSealLit: {
    backgroundColor: '#0745E740',
  },
  dockGlyphArt: {
    width: 19,
    height: 19,
  },
  dockGlyphArtLit: {
    width: 22,
    height: 22,
  },
  dockGlyphWrap: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    minWidth: 66,
    minHeight: 56,
  },
  dockGlyphCaption: {
    marginTop: 2,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default LoungeDockRoutes;
