import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';

import TabRoutes from './TabRoutes';
import Onboard from '../screens/Onboard';
import WelcmLoader from '../components/WelcmLoader';

const Stack = createStackNavigator();

const StackRoutes = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {backgroundColor: '#030807'},
      }}>
      <Stack.Screen name="WelcmLoader" component={WelcmLoader} />
      <Stack.Screen name="Onboard" component={Onboard} />
      <Stack.Screen name="TabRoutes" component={TabRoutes} />
    </Stack.Navigator>
  );
};

export default StackRoutes;
