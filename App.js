import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './Screens/AppNavigator';
import MyDrawer from './Screens/MechanicScreen/MechanicDashboard/MyDrawer';
import DrawerMenu from './Screens/DrawerMenu';

const App = () => {
  return (
      <SafeAreaProvider>
      
    <NavigationContainer>
       <AppNavigator />
       {/* <MyDrawer /> */}
    </NavigationContainer>
      </SafeAreaProvider>
 
  );
};

export default App;
