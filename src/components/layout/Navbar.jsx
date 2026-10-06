import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ThemeToggle from '../ui/ThemeToggle';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import './Navbar.css';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className={`header ${isScrolled ? 'scrolled' : ''}`} id="header">
            <div className="container">
                <nav className="nav">
                    <Link to="/" className="logo nav-logo-area">
                        <img src="/optus%20logo.gif" alt="Optimype" style={{ height: '70px', width: 'auto', objectFit: 'contain' }} />
                    </Link>
                    
                    <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`} id="nav-links">
                        <li><Link to="/" onClick={() => setIsMobileMenuOpen(false)}>{t('navbar.home')}</Link></li>
                        <li><Link to="/nosotros" onClick={() => setIsMobileMenuOpen(false)}>{t('navbar.about')}</Link></li>
                        <li><Link to="/servicios" onClick={() => setIsMobileMenuOpen(false)}>{t('navbar.services')}</Link></li>
                        <li><Link to="/portafolio" onClick={() => setIsMobileMenuOpen(false)}>{t('navbar.portfolio')}</Link></li>
                        <li><Link to="/beneficios" onClick={() => setIsMobileMenuOpen(false)}>{t('navbar.benefits')}</Link></li>
                        <li><Link to="/faq" onClick={() => setIsMobileMenuOpen(false)}>{t('navbar.faq')}</Link></li>
                    </ul>
                    
                    <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginLeft: 'auto' }}>
                        <Link to="/login" className="btn btn-primary nav-cta login-btn" onClick={() => setIsMobileMenuOpen(false)}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <img src="/iconolog.png" alt="Login" className="login-icon" />
                                <span className="login-text">{t('navbar.login')}</span>
                            </span>
                        </Link>
                        <LanguageSwitcher />
                        <ThemeToggle />
                    </div>
                    
                    <div className="menu-toggle" id="menu-toggle" onClick={toggleMobileMenu}>
                        <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
