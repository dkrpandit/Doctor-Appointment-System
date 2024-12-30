import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import DoctorSignup from './pages/DoctorSignup';
import PatientSignup from './pages/PatientSignup';
import Wallet from './pages/Wallet';
import DoctorDashboard from './pages/DoctorDashboard';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/doctor-signup" element={<DoctorSignup />} />
        <Route path="/patient-signup" element={<PatientSignup />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
