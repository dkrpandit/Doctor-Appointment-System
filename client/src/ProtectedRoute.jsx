import { Navigate } from 'react-router-dom';
import { useAuth } from './store/AuthContext';

const ProtectedRoute = ({ allowedUserTypes, children }) => {
  const { isLoggedIn, userType } = useAuth();
  const { 
    isDoctor, 
    isPatient 
  } = useAuth();
  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }
  if(isLoggedIn && isDoctor()){
    return <Navigate to="/doctor-dashboard" />;
  }else if(isLoggedIn && isPatient()){
    return <Navigate to="/" />;
  }
  if (allowedUserTypes && !allowedUserTypes.includes(userType)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
