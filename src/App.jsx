import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { PrivyProvider } from '@privy-io/react-auth';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTopButton from './components/ui/ScrollToTopButton';
import Home from './pages/Home';
import Nosotros from './pages/Nosotros';
import Servicios from './pages/Servicios';
import Portafolio from './pages/Portafolio';
import Beneficios from './pages/Beneficios';
import FAQ from './pages/FAQ';
import Login from './pages/Login';
import Log from './pages/Log';
import Prueba from './pages/Prueba';
import Privacy from './pages/Privacy';
import TerminosServicio from './pages/TerminosServicio';
import Eliminar from './pages/Eliminar';
import Pago from './pages/Pago';
import Dashboard from './pages/Dashboard';
import Demo from './pages/Demo';
import Introductions from './pages/Introductions';
import './styles/variables.css';
import './styles/global.css';

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isLogPage = location.pathname === '/log';
  const isPagoPage = location.pathname.startsWith('/pago');
  const isDashboardPage = location.pathname === '/dashboard';
  const isDemoPage = location.pathname === '/demo';
  const isIntroductionsPage = location.pathname === '/introductions';
  const showPublicLayout = !isLoginPage && !isLogPage && !isPagoPage && !isDashboardPage && !isDemoPage && !isIntroductionsPage;

  useEffect(() => {
    AOS.init({ duration: 1000, once: true, easing: 'ease-in-out', offset: 100 });       
  }, []);

  return (
    <div className="App">
      {showPublicLayout && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/portafolio" element={<Portafolio />} />
          <Route path="/beneficios" element={<Beneficios />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/login" element={<Login />} />
          <Route path="/log" element={<Log />} />
          <Route path="/prueba" element={<Prueba />} />
          <Route path="/terminos-servicio" element={<TerminosServicio />} />
          <Route path="/politica-privacidad" element={<Privacy />} />
          <Route path="/eliminar" element={<Eliminar />} />
          <Route path="/pago" element={<Pago />} />
          <Route path="/pago/:codigoOrden" element={<Pago />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/introductions" element={<Introductions />} />
        </Routes>
      </main>
      {showPublicLayout && <Footer />}
      {showPublicLayout && <ScrollToTopButton />}
    </div>
  );
}

function App() {
  return (
    <PrivyProvider
      appId={import.meta.env.VITE_PRIVY_APP_ID}
      config={{
        loginMethods: ['email', 'google', 'apple'],
        appearance: {
          theme: 'light',
          accentColor: '#66AFFF',
          logo: '/OPTUSLOGO.png',
        },
        dWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <Router>
        <AppContent />
      </Router>
    </PrivyProvider>
  );
}

export default App;
