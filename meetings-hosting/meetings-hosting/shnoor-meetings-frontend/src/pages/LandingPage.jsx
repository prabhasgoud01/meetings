import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Video, Users, Shield, Zap, ChevronRight } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Video className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight">Shnoor Meetings</span>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/login')}
              className="text-slate-600 font-semibold hover:text-blue-600 transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-900/10"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold bg-blue-50 text-blue-600 rounded-full border border-blue-100">
              New: Public access enabled for everyone
            </span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
              Connect with anyone,<br />
              <span className="text-blue-600">anywhere.</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
              Experience the next generation of video meetings. Secure, reliable, and incredibly fast. Built for modern teams and global collaboration.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all active:scale-95 shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                Start for Free <ChevronRight size={20} />
              </button>
              <button className="w-full sm:w-auto bg-white text-slate-900 border-2 border-slate-200 px-10 py-5 rounded-2xl font-bold text-lg hover:border-slate-300 transition-all active:scale-95">
                View Demo
              </button>
            </div>
          </motion.div>

          {/* Hero Image Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10" />
            <div className="bg-slate-100 rounded-[2rem] p-4 shadow-2xl border border-slate-200 overflow-hidden">
               <img 
                 src="https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&q=80&w=2000" 
                 alt="App Preview" 
                 className="rounded-2xl w-full h-auto shadow-inner"
               />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tight mb-4">Why choose Shnoor?</h2>
            <p className="text-slate-500 font-medium max-w-xl mx-auto">Everything you need to host professional meetings without the complexity.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Shield className="text-blue-600" size={32} />}
              title="Secure by Design"
              description="End-to-end encryption for all meetings. Your data stays yours, always."
            />
            <FeatureCard 
              icon={<Zap className="text-orange-500" size={32} />}
              title="Instant Join"
              description="No downloads required. Join directly from your browser in seconds."
            />
            <FeatureCard 
              icon={<Users className="text-green-500" size={32} />}
              title="Collaborative"
              description="High-quality audio and video for teams of any size."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <Video className="text-blue-600" size={24} />
            <span className="text-lg font-bold">Shnoor Meetings</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">
            © 2026 Shnoor International LLC. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm font-bold text-slate-500">
            <button className="hover:text-blue-600">Privacy</button>
            <button className="hover:text-blue-600">Terms</button>
            <button className="hover:text-blue-600">Help</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <div className="mb-6 w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-4">{title}</h3>
    <p className="text-slate-500 font-medium leading-relaxed">{description}</p>
  </div>
);

export default LandingPage;
