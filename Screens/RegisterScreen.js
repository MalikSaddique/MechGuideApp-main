import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { auth, db } from "../firebase/firebase.config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";

const { width, height } = Dimensions.get('window');

const InputField = ({
  iconName,
  placeholder,
  secureTextEntry,
  toggleVisibility,
  visibility,
  onChangeText,
  value,
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

const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneNoError, setPhoneNoError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [passwordmatcherror, setpasswordmatcherror] = useState("");
  const [validpassworderror, setvalidpassworderror] = useState("");

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const validateForm = () => {
    if (!fullName) {
      setFullNameError("Please enter your full name.");
      return false;
    } else {
      setFullNameError("");
    }

    if (!email) {
      setEmailError("Please enter your email address.");
      return false;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return false;
    } else {
      setEmailError("");
    }

    if (!phoneNo) {
      setPhoneNoError("Please enter your phone number");
      return false;
    } else {
      setPhoneNoError("");
    }

    if (!password) {
      setPasswordError("Please enter your password");
      return false;
    } else {
      setPasswordError("");
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      return false;
    } else {
      setConfirmPasswordError("");
    }

    if (password !== confirmPassword) {
      setpasswordmatcherror("Passwords do not match");
      return false;
    } else {
      setpasswordmatcherror("");
    }

    if (!validatePassword(password)) {
      setvalidpassworderror("Password must be at least 8 characters long.");
      return false;
    } else {
      setvalidpassworderror("");
    }

    if (!termsAccepted) {
      setError("Please accept the terms of use and privacy policy.");
      return false;
    } else {
      setError("");
    }

    return true;
  };

  const registerUser = async () => {
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
          name: fullName,
          email: email,
          phone: phoneNo,
        });
        console.log("User data added to Firestore:", userRef.id);
        navigation.navigate("ChooseLocationScreen");
      } else {
        setError("User object is undefined.");
      }
    } catch (error) {
      setError("Registration failed: " + error.message);
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>

          <View style={styles.header}>
            <Text style={styles.header}>Register Account</Text>
            <Text style={styles.subheader}>Join MechGuide! </Text>
          </View>
          <Text style={styles.subsubheader}>SignUp/Register! </Text>

          <View style={styles.inputContainerPass}>
            <FontAwesome name="user" size={20} style={styles.inputIcon} />
            <InputField
              placeholder="Enter Full Name"
              onChangeText={setFullName}
              value={fullName}
            />
          </View>
          {fullNameError ? (
            <Text style={styles.errorText}>{fullNameError}</Text>
          ) : null}

          <View style={styles.inputContainerPass}>
            <FontAwesome name="envelope" size={20} style={styles.inputIcon} />
            <InputField
              placeholder="Enter email id"
              keyboardType="email-address"
              onChangeText={setEmail}
              value={email}
            />
          </View>
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}

          <View style={styles.inputContainerPass}>
            <FontAwesome name="phone" size={20} style={styles.inputIcon} />
            <InputField
              placeholder="Enter Phone No"
              keyboardType="phone-pad"
              onChangeText={setPhoneNo}
              value={phoneNo}
            />
          </View>
          {phoneNoError ? (
            <Text style={styles.errorText}>{phoneNoError}</Text>
          ) : null}

          <View style={styles.inputContainerPass}>
            <FontAwesome name="lock" size={20} style={styles.inputIcon} />
            <InputField
              placeholder="Enter password"
              secureTextEntry={!passwordVisible}
              toggleVisibility={true}
              visibility={() => setPasswordVisible(!passwordVisible)}
              onChangeText={setPassword}
              value={password}
            />
          </View>
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}
          {passwordmatcherror ? (
            <Text style={styles.errorText}>{passwordmatcherror}</Text>
          ) : null}
          {validpassworderror ? (
            <Text style={styles.errorText}>{validpassworderror}</Text>
          ) : null}

          <View style={styles.inputContainerPass}>
            <FontAwesome name="lock" size={20} style={styles.inputIcon} />
            <InputField
              placeholder="Confirm password"
              secureTextEntry={!confirmPasswordVisible}
              toggleVisibility={true}
              visibility={() =>
                setConfirmPasswordVisible(!confirmPasswordVisible)
              }
              onChangeText={setConfirmPassword}
              value={confirmPassword}
            />
          </View>
          {confirmPasswordError ? (
            <Text style={styles.errorText}>{confirmPasswordError}</Text>
          ) : null}
          <View style={styles.termsContainer}>
          <TouchableOpacity
            onPress={() => setTermsAccepted(!termsAccepted)}
          >
            <FontAwesome
              name={termsAccepted ? "check-square-o" : "square-o"}
              size={20}
              color={termsAccepted ? "#FFFFFF" : "#FFFFFF"}
            />
             </TouchableOpacity>
            <Text style={styles.termsText}>
              By registering you are agreeing with our
        
            <TouchableOpacity onPress={() => navigation.navigate("PrivacyPolicy")}>
        <Text style={styles.termsLink}>Terms of Use</Text>
      </TouchableOpacity>
      <Text style={styles.termsText}> and </Text>
      <TouchableOpacity onPress={() => navigation.navigate("PrivacyPolicy")}>
        <Text style={styles.termsLink}>Privacy Policy</Text>
      </TouchableOpacity>
      </Text>
      </View>

         

          <TouchableOpacity style={styles.button} onPress={registerUser} disabled={isLoading}>
           
            {isLoading ? <ActivityIndicator size="large" color="white" /> :  <Text style={styles.buttonText}>Register</Text>}
          </TouchableOpacity>

          <View style={styles.orContainer}>
            <View style={styles.startline} />
            <Text style={styles.orText}>Or sign up with</Text>
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
            <Text style={styles.registerText}>Already have an Account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.registerButton}>Sign In</Text>
            </TouchableOpacity>
          </View>
      
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
    fontSize: width * 0.04, // Adjust the font size
    textAlign: "center", // Center the text
    paddingHorizontal: 10, // Add padding horizontally
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
    marginBottom: 16,
    marginLeft: width*-0.27,
  },
  subsubheader:{
    fontSize: width * 0.07,
    color: '#FFFFFF',
    marginBottom: 16,
   // marginLeft:-180,

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
    width: '100%', 
    paddingVertical: 10,
    marginLeft:10,
    //backgroundColor: '#FFFFFF', 
    //fontSize: width * 0.04, 
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    margin:50,
    //marginBottom:10,
  },
  termsText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#FFFFFF', 
  },
  termsLink: {
    color: '#FFFFFF', 
    textDecorationLine: 'underline',
    fontWeight:'bold'
  },
  button: {
    width: '80%',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF7A00',
    marginVertical:10, 
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

export default RegisterScreen;
