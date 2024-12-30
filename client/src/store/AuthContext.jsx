import { createContext, useContext, useState, useEffect } from 'react';
// import * as jwtDecode from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);

  // Function to check if token is expired
  const isTokenExpired = (token) => {
    try {
      // Decode the payload from the token
      const payload = JSON.parse(atob(token.split('.')[1]));
      // console.log('Manually decoded payload:', payload);
      const { exp } = payload;
      if (!exp) {
        throw new Error('Expiration time (exp) is not present in the token payload');
      }
      // Get the current time in seconds
      const currentTime = Date.now() / 1000;
      // Compare the expiration time with the current time
      return exp < currentTime; // Return true if the token is expired
    } catch (error) {
      console.error('Error decoding token:', error);
      return true; // Return true if there's an error (assume token is expired)
    }
  };

  

  // Function to get user type from token
  const getUserTypeFromToken = (token) => {
    try {
      // const decodedToken = jwtDecode(token);
      const payload = JSON.parse(atob(token.split('.')[1]));
      // console.log('Manually decoded payload:', payload.userType);
      return payload.userType;
    } catch {
      return null;
    }
  };

  // Function to validate token and set auth state
  const validateToken = () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setIsLoggedIn(false);
      setUserType(null);
      return;
    }

    if (isTokenExpired(token)) {
      // Token is expired, log out user
      logout();
      return;
    }

    // Token is valid
    const userType = getUserTypeFromToken(token);
    setUserType(userType);
    setIsLoggedIn(true);
  };

  // Login function
  const login = (token) => {
    // console.log("from auth context", token)
    if (!token || isTokenExpired(token)) {
      console.error('Invalid or expired token');
      return false;
    }

    localStorage.setItem('token', token);
    const userType = getUserTypeFromToken(token);
    setUserType(userType);
    setIsLoggedIn(true);
    return true;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserType(null);
  };

  // Check token validity on mount and when localStorage changes
  useEffect(() => {
    validateToken();

    // Listen for localStorage changes in other tabs/windows
    const handleStorageChange = () => {
      validateToken();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Periodic token validation (every 5 minutes)
  useEffect(() => {
    const interval = setInterval(validateToken, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Function to get current auth token
  const getToken = () => localStorage.getItem('token');

  // Function to check if user is a doctor
  const isDoctor = () => userType === 'doctor';

  // Function to check if user is a patient
  const isPatient = () => userType === 'patient';
  const userID = ()=>{
    const token = localStorage.getItem('token');
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload._id;
  }
  return (
    <AuthContext.Provider value={{ 
      isLoggedIn,
      userType,
      login,
      logout,
      getToken,
      isDoctor,
      isPatient,
      userID
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Custom hook for protected routes
export const useProtectedRoute = (allowedUserTypes = []) => {
  const { isLoggedIn, userType } = useAuth();
  
  if (!isLoggedIn) {
    return false;
  }

  if (allowedUserTypes.length === 0) {
    return true;
  }

  return allowedUserTypes.includes(userType);
};