import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';

import LoungeDockRoutes from './LoungeDockRoutes';
import CurtainWalkSlides from '../screens/CurtainWalkSlides';
import CurtainRiseLoader from '../components/CurtainRiseLoader';

const Stack = createStackNavigator();

const VerdictStackRoutes = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {backgroundColor: '#030807'},
      }}>
      <Stack.Screen name="WelcmLoader" component={CurtainRiseLoader} />
      <Stack.Screen name="Onboard" component={CurtainWalkSlides} />
      <Stack.Screen name="TabRoutes" component={LoungeDockRoutes} />
    </Stack.Navigator>
  );
};

export default VerdictStackRoutes;
