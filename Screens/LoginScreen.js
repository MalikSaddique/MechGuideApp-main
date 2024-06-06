import React, { useState } from 'react';
// import LogRocket from '@logrocket/react-native';
// LogRocket.init('kkw2cz/mechguide')
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Dimensions, Image, ActivityIndicator } from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { auth, db } from "../firebase/firebase.config";
import { signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';


const { width, height } = Dimensions.get('window');
// Assuming `app` is your Firebase app instance
const authPersistence = getReactNativePersistence(AsyncStorage);
//const authInstance = initializeAuth(app, { persistence: authPersistence });

const InputField = ({
  iconName,
  placeholder,
  secureTextEntry,
  toggleVisibility,
  visibility,
  onChangeText,
  value
}) => (
  <View style={styles.inputContainer}>
    <FontAwesome name={iconName} size={24} color="#6D6A6A" />
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      autoCapitalize="none"
      onChangeText={onChangeText} 
      value={value}                
    />
    {toggleVisibility && (
      <TouchableOpacity onPress={visibility}>
        <FontAwesome5
          name={secureTextEntry ? "eye-slash" : "eye"}
          size={20}
          color="#6D6A6A"
        />
      </TouchableOpacity>
    )}
  </View>
);

const LoginScreen = ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const Login_user = async () => {
    // Reset previous errors
    setEmailError("");
    setPasswordError("");
    setError("");
    setLoading(true);

    // Validate email
    if (!email) {
      setEmailError("Please enter your email address.");
      setLoading(false); // Set loading to false if validation fails

      return;
    }

    // Validate password
    if (!password) {
      setPasswordError("Please enter your password.");
      setLoading(false); // Set loading to false if validation fails

      return;
    }

    // Attempt login
    try {
      console.log("Attempting to sign in with email:", email, "and password:", password);
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in successfully");
      console.log("Email:", email, "Password:", password);
      navigation.navigate("ChooseLocationScreen");

    } catch (error) {
      setError("Login failed. Please check your credentials.");
      // console.error("Login error:", error.message);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.header}>Login Account</Text>
        <Text style={styles.subheader}>Welcome back! </Text>
      </View>

      <Image
        source={require("../assets/MechGuideLogo/LogoMechGuide.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>MechGuide</Text>
      <Text style={styles.tagline}>Find the Right Mechanic For You</Text>

      <View style={styles.inputContainerPass}>
        <FontAwesome name="user" size={24} style={styles.inputIcon} />
        <InputField
          style={styles.input}
          //iconName="user"
          placeholder="Enter email id"
          keyboardType="email-address"
          onChangeText={setEmail}
          value={email}
        />
      </View>
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <View style={styles.inputContainerPass}>
        <FontAwesome name="lock" size={24} style={styles.inputIcon} />
        <InputField
          style={styles.input}
          placeholder="Enter password"
          secureTextEntry={!passwordVisible}
          toggleVisibility={true}
          visibility={() => setPasswordVisible(!passwordVisible)}
          onChangeText={setpassword}
          value={password}
        />
      </View>
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {/* {loading ? <ActivityIndicator size="large" color="#FF7A00" /> : null} */}

      <TouchableOpacity style={styles.button} onPress={Login_user} disabled={loading}>
        
        {loading ? <ActivityIndicator size="large" color="white" /> : <Text style={styles.buttonText}>Login</Text>}

      </TouchableOpacity>

      <View style={styles.orContainer}>
        <View style={styles.startline} />
        <Text style={styles.orText}>Or sign in with</Text>
        <View style={styles.endline} />
      </View>

      <View style={styles.socialContainer}>
        <SocialButton
          iconName="google"
          size={25}
          color="#DB4437"
          onPress={() => {}}
        />
        <SocialButton
          iconName="apple"
          size={25}
          color="black"
          onPress={() => {}}
        />
      </View>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Not registered yet? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")}>
          <Text style={styles.registerButton}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const SocialButton = ({ iconName, onPress, color, size, bgColor }) => (
  <TouchableOpacity style={styles.socialButton} onPress={onPress}>
    <FontAwesome
      name={iconName}
      size={size}
      color={color}
      backgroundColor={bgColor}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    //justifyContent: 'center',
    backgroundColor: '#425DA0', 
    width:'100%',
    flexDirection:'column',
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  header: {
    fontSize: width * 0.06, 
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 4,
    marginTop: 30,
    marginLeft: width*-0.27,
    fontFamily:'Roboto',
  },
  subheader: {
    fontSize: width * 0.05,
    color: '#FFFFFF',
    marginBottom: width*.1,
    marginLeft: width*-0.27,
  },
  eyeIcon: {
    //paddingRight: 10,
  },
  inputContainerPass:{
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: '80%',
    paddingHorizontal:15,
    marginBottom: 10,

  },
  logo: {
    width: width * 0.3, 
    height: width * 0.3, 
    resizeMode: 'contain',
    marginBottom: 5,
  },
  title: {
    fontSize: width * 0.05,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tagline: {
    fontSize: width * 0.020,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    //backgroundColor: '#FFFFFF',
    //borderRadius: 10,
    width: '95%',
    paddingHorizontal:15,
    //marginBottom: 15,
  },
  inputIcon: {
    marginLeft: 10,
    color:'#6D6A6A',
  },
  input: {
    flex: 1,
    width: '100%', // Use a percentage of screen width
    paddingVertical: 10,
    marginLeft:10,
    //backgroundColor: '#FFFFFF', 
    //fontSize: width * 0.04, 
  },
  button: {
    width: '80%',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF7A00', 
    marginBottom: 10,
  },
  buttonText: {
    fontSize: width * 0.05, 
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  orContainer:{
    flexDirection:'row',
    alignItems:'center',
    marginVertical: 20,
  },
  startline:{
    flex:1,
    height:1,
    marginStart:40,
    backgroundColor: '#FFFFFF',
    //color:'#FFFFFF'
  },
  endline:{
    flex:1,
    height:1,
    marginEnd:40,
    backgroundColor: '#FFFFFF',
    //color:'#FFFFFF'
  },
  orText:{
    marginHorizontal: 10,
    color:'#FFFFFF',
   // backgroundColor:'#425DAO',
    paddingHorizontal:5,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '80%',
    marginBottom: 20,
  },
  socialButton: {
    paddingLeft: 25,
    paddingRight:25,
    paddingTop:10,
    paddingBottom:10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF', 
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: width * 0.04,
    color: '#FFFFFF',
  },
  registerButton: {
    fontSize: width * 0.04,
    color: '#FFFFFF',
    fontWeight: '900',
  },
});

export default LoginScreen;
