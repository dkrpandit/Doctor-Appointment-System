import { useState, useEffect } from 'react';
import { useAuth } from '../store/AuthContext'; // Import Auth Context

const Home = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { userID ,isLoggedIn} = useAuth();
    const [selectedDate, setSelectedDate] = useState('');

    // Fetch doctors from API
    useEffect(() => {
        const fetchDoctors = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await fetch('http://localhost:3000/api/doctors/get-doctors');
                if (!response.ok) {
                    throw new Error('Failed to fetch doctor information');
                }
                const data = await response.json();
                setDoctors(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    // Filter doctors based on search query
    const filteredDoctors = doctors.filter(
        (doctor) =>
            doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doctor.specialist.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Book Appointment
    const handleBookAppointment = async (doctorId) => {
        if (!isLoggedIn) {
            alert('Please log in to book an appointment.');
            return;
        }

        if (!selectedDate) {
            alert('Please select a date and time for the appointment.');
            return;
        }
        // console.log("doctor id ",doctorId);
        console.log("selected date ",selectedDate);
        try {
            const response = await fetch('http://localhost:3000/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    doctorId,
                    patientId: userID(),
                    dateTime: selectedDate,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }

            alert('Appointment booked successfully!');
        } catch (err) {
            console.error(err.message);
            alert(err.message);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
            {/* Hero Section */}
            <header className="bg-gradient-to-r from-blue-300 to-indigo-400 text-[#080808d8] pt-36 pb-16 px-6 text-center">
                <h1 className="text-4xl font-bold mb-4">Find Your Perfect Doctor</h1>
                <p className="text-lg mb-6">Search for top-rated doctors by name or specialty</p>
                <div className="max-w-lg mx-auto">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search doctors by name or specialty..."
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-white"
                    />
                    <input
                        type="datetime-local"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full mt-4 px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-white"
                    />
                </div>
            </header>

            {/* Doctor Cards Section */}
            <main className="container mx-auto px-6 py-12">
                <h2 className="text-3xl font-semibold text-gray-900 text-center mb-6">Top Doctors</h2>

                {loading ? (
                    <div className="text-center text-gray-600">Loading...</div>
                ) : error ? (
                    <div className="text-center text-red-600">{error}</div>
                ) : filteredDoctors.length === 0 ? (
                    <div className="text-center text-gray-600">No doctors found for your search.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredDoctors.map((doctor) => (
                            <div
                                key={doctor._id}
                                className="bg-white rounded-xl shadow-md overflow-hidden"
                            >
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900">Dr.{doctor.name}</h3>
                                    <p className="text-gray-600">
                                        {doctor.specialist} | {doctor.experience} years exp
                                    </p>
                                    <p className={`text-sm mt-2 ${doctor.available ? 'text-green-600' : 'text-red-600'}`}>
                                        {doctor.available ? 'Available today' : 'Currently unavailable'}
                                    </p>
                                    <p className="text-indigo-600 text-sm font-semibold mt-1">
                                        {doctor.discountPercentage ? `${doctor.discountPercentage}% off first consultation` : ''}
                                    </p>
                                    <p className="text-gray-800 text-sm font-semibold mt-1">
                                        {doctor.consultationFee ? `₹ ${doctor.consultationFee}` : ''}
                                    </p>
                                    <button
                                        onClick={() => handleBookAppointment(doctor._id)}
                                        className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-xl shadow-md hover:bg-indigo-500 transition-colors"
                                    >
                                        Book Appointment
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Home;
