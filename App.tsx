import {NavigationContainer} from '@react-navigation/native';

import StackRoutes from './src/navigation/StackRoutes.tsx';

const App = () => {
  return (
    <NavigationContainer>
      <StackRoutes />
    </NavigationContainer>
  );
};

export default App;
