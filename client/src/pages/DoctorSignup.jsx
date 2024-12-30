import { useState } from 'react';
import { useLocation ,useNavigate} from 'react-router-dom';
import { FaUser, FaMoneyBillWave, FaEnvelope, FaLock, FaStethoscope, FaFileAlt, FaBriefcase } from 'react-icons/fa';
import { useAuth } from '../store/AuthContext';
const DoctorSignup = () => {
  const location = useLocation();
  const userType = new URLSearchParams(location.search).get('userType');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialist: '',
    experience: '',
    introduction: '',
    consultationFee: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = { ...formData, userType };
    try {
      const response = await fetch('http://localhost:3000/api/doctors/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
      const data = await response.json();
      if (response.ok) {
        if (data.token) {
          login(data.token);
        }
        navigate('/doctor-dashboard');
        alert('Account created successfully!');
      } else {
        const error = await response.json();
        console.error('Registration failed:', error);
        alert('Registration failed: ' + error.message);
      }
    } catch (error) {
      console.error('An error occurred:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const specialties = [
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Pediatrics',
    'Orthopedics',
    'General Practice',
    'Psychiatry',
    'Other'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Doctor Registration</h2>
          <p className="text-gray-500">Join our medical professional network</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="relative">
                <FaUser className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50"
                  required
                />
              </div>

              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50"
                  required
                />
              </div>

              <div className="relative">
                <FaLock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50"
                  required
                />
              </div>

              <div className="relative">
                <FaStethoscope className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <select
                  name="specialist"
                  value={formData.specialist}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-gray-50"
                  required
                >
                  <option value="">Select Specialty</option>
                  {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="relative">
                <FaBriefcase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <div className="flex items-center">
                  <input
                    type="number"
                    name="experience"
                    placeholder="Years of Experience"
                    value={formData.experience}
                    onChange={handleChange}
                    min="0"
                    max="50"
                    className="w-full pl-10 pr-16 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50"
                    required
                  />
                  <span className="absolute right-3 text-gray-500">years</span>
                </div>
              </div>

              <div className="relative">
                <FaMoneyBillWave className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  name="consultationFee"
                  placeholder="Consultation Fee"
                  value={formData.consultationFee}
                  onChange={handleChange}
                  min="0"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50"
                  required
                />
              </div>

              <div className="relative">
                <FaFileAlt className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  name="introduction"
                  placeholder="Brief Introduction"
                  value={formData.introduction}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50 h-32 resize-none"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors duration-200 font-semibold mt-6 shadow-lg hover:shadow-xl"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorSignup;