import React, { createContext, useState, useContext } from 'react';


const RegistrationDataContext = createContext();


export const useRegistrationData = () => {
  return useContext(RegistrationDataContext);
};


export const RegistrationDataProvider = ({ children }) => {
  const [registrationData, setRegistrationData] = useState({
    firstName: '',
    lastName: '',
    profileImage: null,
    cnicFront: null,
    cnicBack: null,
    holdingCnicImage: null,
    certificateImageFront: null,
    certificateImageBack: null,
    drivingLicense: null,
  });

  // Function to update the registration data
  const updateRegistrationData = (newData) => {
    setRegistrationData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  return (
    <RegistrationDataContext.Provider value={{ registrationData, updateRegistrationData }}>
      {children}
    </RegistrationDataContext.Provider>
  );
};
