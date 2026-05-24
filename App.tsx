import {NavigationContainer} from '@react-navigation/native';

import VerdictStackRoutes from './src/navigation/VerdictStackRoutes.tsx';

const App = () => {
  return (
    <NavigationContainer>
      <VerdictStackRoutes />
    </NavigationContainer>
  );
};

export default App;
