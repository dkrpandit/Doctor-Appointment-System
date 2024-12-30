import { useState } from 'react';
import { MdEmail, MdLock } from 'react-icons/md';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoX } from "react-icons/go";
import { useAuth } from '../store/AuthContext';
const Login = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userType = new URLSearchParams(location.search).get('userType');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { login } = useAuth();
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = { ...formData, userType };
    try {
      const apiUrl =
        userType === "doctor"
          ? "http://localhost:3000/api/doctors/login"
          : "http://localhost:3000/api/patients/login";
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
      const data = await response.json();
      // console.log("login token form login page",data.token)
      if (response.ok) {
        // localStorage.setItem('token', data.token);
        login(data.token);
        alert('Login successfully!');
        userType === 'doctor'?navigate("/doctor-dashboard"):navigate("/")
      } else {
        const error = await response.json();
        alert(error.message);
        setError(error.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      alert('An error occurred. Please try again.');
    }
  };
  const handleChoice = (userType) => {
    if (userType === 'doctor') {
      navigate(`/doctor-signup?userType=${userType}`); // Navigate to DoctorSignup page
    } else if (userType === 'patient') {
      navigate(`/patient-signup?userType=${userType}`); // Navigate to PatientSignup page
    }
    closeModal();
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg m-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Please enter your details to sign in</p>
          {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <div className="relative mt-1">
              <MdEmail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800">
                Forgot password?
              </a>
            </div>
            <div className="relative mt-1">
              <MdLock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200"
          >
            Login
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Sign up Link */}
          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={openModal}
              className="font-medium text-indigo-600 hover:text-indigo-800"
            >
              Sign up
            </button>
          </p>
        </form>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full transition-all transform hover:scale-105">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors duration-300"
            >
              <GoX size={20} />
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Register as</h3>
            <div className="space-y-4">
              <button
                onClick={() => handleChoice('doctor')}
                className="w-full py-3 px-6 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-lg shadow-lg transition-transform transform hover:translate-y-1"
              >
                Doctor
              </button>
              <button
                onClick={() => handleChoice('patient')}
                className="w-full py-3 px-6 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-lg transition-transform transform hover:translate-y-1"
              >
                Patient
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Login;
