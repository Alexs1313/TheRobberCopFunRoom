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

import JokesScreen from '../screens/JokesScreen.tsx';
import SavedScreen from '../screens/SavedScreen.tsx';
import RateJokeScreen from '../screens/RateJokeScreen.tsx';
import StoriesScreen from '../screens/StoriesScreen.tsx';
import GameScreen from '../screens/GamScreen.tsx';

const Tab = createBottomTabNavigator();

const tabActive = '#FFD700';
const tabIdle = 'rgba(255,255,255,0.48)';

type TabItemProps = {
  label: string;
  focused: boolean;
  source: ImageSourcePropType;
};

const TabItem = ({label, focused, source}: TabItemProps) => {
  const tabColor = focused ? tabActive : tabIdle;
  return (
    <View style={styles.tabItem}>
      <View style={[styles.tabIconImageWrap, focused && styles.activeIconWrap]}>
        <Image
          source={source}
          style={[styles.tabIconImg, focused && styles.activeIconImg]}
          resizeMode="contain"
          tintColor={tabColor}
        />
      </View>
      <Text style={[styles.tabLabel, {color: tabColor}]}>{label}</Text>
    </View>
  );
};

const TabIconExplore = ({focused}: {focused: boolean}) => (
  <TabItem
    label="Jokes"
    focused={focused}
    source={require('../../rmmassets/rmmimgs/rmmtabo.png')}
  />
);

const TabIconMap = ({focused}: {focused: boolean}) => (
  <TabItem
    label="Saved"
    focused={focused}
    source={require('../../rmmassets/rmmimgs/rmmtabt.png')}
  />
);

const TabIconTactics = ({focused}: {focused: boolean}) => (
  <TabItem
    label="Rate"
    focused={focused}
    source={require('../../rmmassets/rmmimgs/rmmtabth.png')}
  />
);

const TabIconStudytasks = ({focused}: {focused: boolean}) => (
  <TabItem
    label="Stories"
    focused={focused}
    source={require('../../rmmassets/rmmimgs/rmmtabfo.png')}
  />
);

const TabIconGridTrial = ({focused}: {focused: boolean}) => (
  <TabItem
    label="Game"
    focused={focused}
    source={require('../../rmmassets/rmmimgs/rmmtabfv.png')}
  />
);

const TabBarBg = () => <View pointerEvents="none" style={styles.tabBarFill} />;

const TabRoutes = () => {
  const tabInsets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: tabActive,
        tabBarInactiveTintColor: tabIdle,
        tabBarStyle: [
          styles.tabBar,
          {
            height: 90,
            paddingBottom: Math.max(tabInsets.bottom, 12),
          },
        ],
        tabBarBackground: TabBarBg,
      }}>
      <Tab.Screen
        name="JokesScreen"
        component={JokesScreen}
        options={{
          tabBarIcon: TabIconExplore,
        }}
      />
      <Tab.Screen
        name="SavedScreen"
        component={SavedScreen}
        options={{
          tabBarIcon: TabIconMap,
        }}
      />
      <Tab.Screen
        name="RateJokeScreen"
        component={RateJokeScreen}
        options={{
          tabBarIcon: TabIconTactics,
        }}
      />
      <Tab.Screen
        name="StoriesScreen"
        component={StoriesScreen}
        options={{
          tabBarIcon: TabIconStudytasks,
        }}
      />
      <Tab.Screen
        name="GamScreen"
        component={GameScreen}
        options={{
          tabBarIcon: TabIconGridTrial,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    elevation: 0,
    shadowOpacity: 0,
    paddingTop: 18,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderColor: '#111A5A',
    borderTopColor: '#111A5A',
  },
  tabBarFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#04082BFA',
  },
  tabIconImageWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  activeIconWrap: {
    backgroundColor: '#0745E740',
  },
  tabIconImg: {
    width: 19,
    height: 19,
  },
  activeIconImg: {
    width: 22,
    height: 22,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    minWidth: 66,
    minHeight: 56,
  },
  tabLabel: {
    marginTop: 2,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default TabRoutes;
