//import * as React from 'react';
//import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import StartScreen from './StartScreen.js';
import LoginScreen from './LoginScreen.js';
import RegisterScreen from './RegisterScreen.js';
import LocationScreen from './ChooseLocationScreen.js';
import UserLocationScreen from './UserCurrentLocationScreen.js';
import DrawerMenu from './DrawerMenu.js';
import PrivacyPolicyScreen from './DrawerScreens/PrivacyPolicy.js';
import UserProfileScreen from './UserProfile/UserProfileScreen.js';
import EditDetailsScreen from './UserProfile/EditDetailsScreen.js';
import MechanicRegistrationScreen from './MechanicScreen/MechanicRegistrationScreen.js';
import BasicInformationScreen from './MechanicScreen/BasicInfoScreen.js';
import { RegistrationDataProvider } from '../hooks/RegistrationDataContext.js';
import CNICScreen from './MechanicScreen/CNICScreen.js';
import SelfieWithIDScreen from './MechanicScreen/SelfieWithIdScreen.js';
import CertificateScreen from './MechanicScreen/CertificateInfo.js';
import DrivingLicense from './MechanicScreen/DrivingLicenseScreen.js';
import MechanicRegistrationConfirmationScreen from './MechanicScreen/MechanicConfirmationScreen.js';
import DashboardScreen from './MechanicScreen/MechanicDashboard/DashboardScreen.js';
import MechanicDrawer from './MechanicScreen/MechanicDashboard/MechanicDrawer.js';
import MyDrawer from './MechanicScreen/MechanicDashboard/MyDrawer.js';
import ComplaintForm from './DrawerScreens/FeedbackComplaints.js';
import ProfileSettings from './MechanicScreen/MechanicDashboard/MechanicProfile.js';
import EditMechanicProfileScreen from './MechanicScreen/MechanicDashboard/EditProfileMechanic/EditProfile.js';
import FeedbackForm from './MechanicScreen/MechanicDashboard/MechanicDrawerScreens/FeedbackComplaints.js';
import MechanicsListScreen from './DrawerScreens/ViewMechanics.js';
import MechanicDetailsScreen from './DrawerScreens/ViewMechDetails/ViewDetailMech.js';
import JobRequestsScreen from './MechanicScreen/MechanicDashboard/MechanicDrawerScreens/JobRequests.js';
import P2PChat from '../ChatMessaging/P2PChat.js';
import MechanicChatRoom from './MechanicScreen/MechanicDashboard/MechanicDrawerScreens/MechanicChatRoom.js';
import SettingsScreen from './DrawerScreens/Settings.js';
import ChangePasswordScreen from './DrawerScreens/SettingScreens/ChangePassword.js';
import NotificationSettingsScreen from './DrawerScreens/SettingScreens/Notifications.js';
import DeleteAccountScreen from './DrawerScreens/SettingScreens/DeleteAccount.js';
import FAQScreen from './DrawerScreens/FAQsScreen.js';
import ContactUsScreen from './DrawerScreens/SettingScreens/ContactUsScreen.js';
import ViewMechLoction from './DrawerScreens/ViewMechDetails/ViewMechLoction.js'
import MechRating from './DrawerScreens/ViewMechDetails/MechRating.js'
import FetRatMechSide from './DrawerScreens/FetRatMechSide.js';
import Skill_and_service from './DrawerScreens/Skill_and_service.js';
import FetRatingMech from './DrawerScreens/ViewMechDetails/FetRatingMech.js';

import ViewuserLocation from './MechanicScreen/MechanicDashboard/MechanicDrawerScreens/ViewuserLocation.js';
import { NavigationContainer } from '@react-navigation/native';
import { faL } from '@fortawesome/free-solid-svg-icons';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  const userRole = 'user';
  return (
    <Drawer.Navigator drawerContent={(props) => 
      userRole === 'mechanic' ? <MechanicDrawer {...props} /> : <DrawerMenu {...props} />
    }>
    <Drawer.Screen name="Menu"  component={UserLocationScreen} options={{headerShown: false}} />
    
  </Drawer.Navigator>
 
     );
}
{/* <Stack.Screen name="UserLocationScreen" component={UserLocationScreen} /> */}

function AppNavigator() {
  return (
    <RegistrationDataProvider>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      
      <Stack.Screen name="Start" component={StartScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen name="ChooseLocationScreen" component={LocationScreen} />
      <Stack.Screen 
        name="DrawerNavigation" 
        component={DrawerNavigator} 
        options={{ headerShown: false }}
      />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
       <Stack.Screen name="ViewMechanics" component={MechanicsListScreen}/> 
      <Stack.Screen name="ViewMechanicsDetail" component={MechanicDetailsScreen}/>
      <Stack.Screen name="FeedbackComplaints" component={ComplaintForm} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen}/>
      <Stack.Screen name="EditDetails" component={EditDetailsScreen}/>
      <Stack.Screen name="MechanicScreen" component={MechanicRegistrationScreen}/>
      <Stack.Screen name="BasicInformationScreen" component={BasicInformationScreen}/>
      <Stack.Screen name="MechCNICScreen" component={CNICScreen}/>
      <Stack.Screen name="SelfieWithId" component={SelfieWithIDScreen}/>
      <Stack.Screen name="CertificateScreenMech" component={CertificateScreen}/>
      <Stack.Screen name="LicenseScreenMech" component={DrivingLicense}/>
      <Stack.Screen name="MechRegistrationConfirmation" component={MechanicRegistrationConfirmationScreen}/>
      <Stack.Screen name="Drawer" component={MyDrawer} options={{ headerShown: false }} />
      <Stack.Screen name="MechProfile" component={ProfileSettings}/>
      <Stack.Screen name="MechEditDetails" component={EditMechanicProfileScreen}/>
      <Stack.Screen name="JobRequests" component={JobRequestsScreen}/>
      <Stack.Screen name="MechComplaint" component={FeedbackForm}/>
      <Stack.Screen name="Chatting" component={P2PChat}/>
      <Stack.Screen name="MechanicChat" component={MechanicChatRoom}/>
      <Stack.Screen name="UserSettingScreen" component={SettingsScreen}/>
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen}/>
      <Stack.Screen name="NotificationScreen" component={NotificationSettingsScreen}/>
      <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen}/>
      <Stack.Screen name="FAQScreen" component={FAQScreen}/>
      <Stack.Screen name="ContactUs" component={ContactUsScreen}/>


      <Stack.Screen name="ViewMechLoction" component={ViewMechLoction}/>
      <Stack.Screen name="ViewuserLocation" component={ViewuserLocation}/>
      <Stack.Screen name="MechRating" component={MechRating}/>
      <Stack.Screen name="FetRatingMech" component={FetRatingMech}/>
      <Stack.Screen name="FetRatMechSide" component={FetRatMechSide}/>
      <Stack.Screen name="Skill_and_service" component={Skill_and_service}/>



    </Stack.Navigator>
    </RegistrationDataProvider>
    
  );
}

export default AppNavigator;
