import React, { useState, useRef } from 'react';

// The API endpoint for registration.
const API_URL = 'http://localhost:5000/api/register';

// --- Reusable AI-themed Icon Components ---
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block w-5 h-5 mr-2 text-violet-400">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line>
  </svg>
);

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block w-5 h-5 mr-2 text-violet-400">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const BrainCircuitIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM8 12H6v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2zm2-2h-2V8h2v2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 16v-2m0-4V8m-4 4h2m4 0h-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


// --- Registration Form Component ---
const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', institution: 'BINUS University', major: '', year: '', reason: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Something went wrong');
      setMessage({ type: 'success', text: 'Registration successful! We will contact you soon.' });
      setFormData({ name: '', email: '', phone: '', institution: 'BINUS University', major: '', year: '', reason: '' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-slate-900/50 backdrop-blur-lg rounded-2xl shadow-2xl p-8 space-y-8 border border-violet-800/50 shadow-violet-500/10">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white">Register Now</h2>
        <p className="text-slate-400 mt-2">Secure your spot for this exclusive AI experience.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input fields with updated styling */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
            <input type="text" name="name" id="name" required value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <input type="email" name="email" id="email" required value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all" />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
            <input type="tel" name="phone" id="phone" required value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all" />
          </div>
          <div>
            <label htmlFor="institution" className="block text-sm font-medium text-slate-300 mb-2">Institution</label>
            <input type="text" name="institution" id="institution" required value={formData.institution} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all" />
          </div>
          <div>
            <label htmlFor="major" className="block text-sm font-medium text-slate-300 mb-2">Major</label>
            <input type="text" name="major" id="major" required value={formData.major} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all" />
          </div>
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-slate-300 mb-2">Year / Batch</label>
            <input type="number" name="year" id="year" required value={formData.year} onChange={handleInputChange} placeholder="e.g., 2023" className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all" />
          </div>
        </div>
        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-slate-300 mb-2">Reason for Joining</label>
          <textarea name="reason" id="reason" rows="4" required value={formData.reason} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white focus:ring-2 focus:ring-violet-500 focus:outline-none transition-all"></textarea>
        </div>
        <div>
          <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 focus:ring-offset-slate-900 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all transform hover:scale-105">
            {isLoading ? 'Submitting...' : 'Confirm Registration'}
          </button>
        </div>
      </form>
      {message && (
        <div className={`p-4 mt-6 rounded-md text-sm ${message.type === 'success' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
          {message.text}
        </div>
      )}
    </div>
  );
};


// --- Main App Component ---
function App() {
  const registrationRef = useRef(null);

  const handleScrollToRegister = () => {
    registrationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const schedule = [
    { day: 'Day 1: Oct 4', topic: 'Foundations of AI & Machine Learning' },
    { day: 'Day 2: Oct 5', topic: 'Deep Dive into Neural Networks' },
    { day: 'Day 3: Oct 11', topic: 'Building & Training Your First Model' },
    { day: 'Day 4: Oct 12', topic: 'AI Deployment & Project Showcase' },
  ];

  // Add your photo URLs here!
  const galleryImages = [
    "https://placehold.co/600x400/1e1b4b/9333ea?text=Neural+Network+Viz",
    "https://placehold.co/600x400/1e1b4b/9333ea?text=Collaborative+Coding",
    "https://placehold.co/600x400/1e1b4b/9333ea?text=Deployment+Workshop",
    "https://placehold.co/600x400/1e1b4b/9333ea?text=Expert+Speaker",
  ];

  return (
    <div className="bg-[#0A0F1F] text-white">
      {/* --- Hero Section --- */}
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8 bg-cover bg-center relative overflow-hidden" style={{backgroundImage: 'linear-gradient(180deg, rgba(10, 15, 31, 0.8) 0%, #0A0F1F 100%)'}}>
        {/* Background glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-violet-900/40 rounded-full blur-3xl animate-pulse"></div>
        
        <div className="relative z-10 flex flex-col items-center">
            <img src="/Logo HIMTI.png" alt="HIMTI Logo" className="w-28 h-28 mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">HIMTI AI Bootcamp 2025</h1>
            <p className="mt-4 text-lg md:text-xl text-slate-300 max-w-3xl">From Theory to Deployment: Master the Art of Artificial Intelligence.</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex items-center text-slate-300"><CalendarIcon /> October 4, 5, 11, & 12, 2025</div>
                <div className="hidden sm:block text-slate-600">|</div>
                <div className="flex items-center text-slate-300"><MapPinIcon /> BINUS University</div>
            </div>
            <button onClick={handleScrollToRegister} className="mt-10 px-8 py-4 bg-violet-600 text-white font-semibold rounded-lg shadow-lg shadow-violet-600/20 hover:bg-violet-700 transition-all transform hover:scale-105">
              Register Now
            </button>
        </div>
      </div>

      {/* --- Main Content --- */}
      <main className="py-20 px-8 space-y-24">
        {/* About Section */}
        <section className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-violet-400 mb-4">What is the AI Bootcamp?</h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            This isn't just another workshop. The HIMTI AI Bootcamp is a 4-day intensive program designed to take you from the fundamentals of machine learning to deploying your own AI models. You'll work on hands-on projects, learn from industry-relevant case studies, and collaborate with fellow tech enthusiasts.
          </p>
        </section>

        {/* Gallery Section */}
        <section className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-violet-400">Highlights From Last Year</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {galleryImages.map((src, index) => (
              <div key={index} className="bg-slate-800/50 p-2 rounded-lg border border-violet-800/50 hover:border-violet-600 transition-all">
                <img src={src} alt={`Bootcamp highlight ${index + 1}`} className="w-full h-60 object-cover rounded-md shadow-lg" />
              </div>
            ))}
          </div>
        </section>

        {/* Schedule Section */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-violet-400">Event Schedule</h2>
          <div className="space-y-4">
            {schedule.map((item, index) => (
              <div key={index} className="bg-slate-800/80 border border-slate-700 p-4 rounded-lg flex items-center transition-all hover:border-violet-600 hover:bg-slate-800">
                <BrainCircuitIcon className="w-8 h-8 mr-4 text-violet-500 flex-shrink-0" />
                <div>
                    <div className="text-white font-bold">{item.day}</div>
                    <p className="text-slate-400">{item.topic}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Registration Section */}
        <section ref={registrationRef} className="pt-16">
          <RegistrationForm />
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="bg-[#0A0F1F] border-t border-slate-800 py-8 text-center text-slate-500">
        <p>&copy; {new Date().getFullYear()} Himpunan Mahasiswa Teknik Informatika (HIMTI). All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;
