import { createDrawerNavigator } from '@react-navigation/drawer';
import DashboardScreen from './DashboardScreen';
import MechanicDrawer from './MechanicDrawer';

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator drawerContent={(props) => <MechanicDrawer {...props} />}>
      <Drawer.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }}/>
    </Drawer.Navigator>
  );
}

export default MyDrawer;
