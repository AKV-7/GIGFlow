import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateGig from './pages/CreateGig';
import GigDetail from './pages/GigDetail';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-surface-cream text-text-primary font-sans selection:bg-primary-200 selection:text-primary-700">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create-gig" element={<CreateGig />} />
            <Route path="/gigs/:id" element={<GigDetail />} />
          </Routes>
        </main>
        <Toaster position="bottom-right" toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '2px solid #fff',
            borderRadius: '0px',
            boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)'
          }
        }} />
      </div>
    </Router>
  );
}

export default App;
