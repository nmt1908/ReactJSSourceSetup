import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Globe, Github, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Magnetic from '@/components/common/Magnetic';

const Header = () => {
    const { t, i18n } = useTranslation();
    const { pathname } = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleLanguage = () => {
        const newLang = i18n.language === 'vi' ? 'en' : 'vi';
        i18n.changeLanguage(newLang);
    };

    const navLinks = [
        { name: t('home'), path: '/' },
        { name: t('about'), path: '/about' },
    ];

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4",
                isScrolled ? "pt-2" : "pt-6"
            )}
        >
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={cn(
                    "container mx-auto max-w-7xl h-16 px-6 flex items-center justify-between rounded-full border transition-all duration-500",
                    isScrolled
                        ? "bg-background/70 backdrop-blur-xl shadow-2xl border-primary/10"
                        : "bg-background/40 backdrop-blur-md border-transparent shadow-none"
                )}
            >
                {/* Branding */}
                <Magnetic strength={0.2}>
                    <Link to="/" className="flex items-center gap-4 group">
                        <div className="relative overflow-hidden rounded-xl h-10 w-10 shadow-lg group-hover:scale-110 transition-transform duration-500">
                            <img src="/logo.png" alt="LEO Logo" className="h-full w-full object-cover" />
                        </div>
                        <span className="font-serif font-black text-2xl tracking-[0.05em] uppercase hidden sm:block">
                            {t('app_name')}
                        </span>
                    </Link>
                </Magnetic>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-12 text-[10px] tracking-[0.3em] font-black uppercase">
                    {navLinks.map((link) => (
                        <Magnetic key={link.path} strength={0.3}>
                            <Link
                                to={link.path}
                                className={cn(
                                    "relative transition-all duration-500 hover:text-primary py-2 px-4",
                                    pathname === link.path ? "text-primary" : "text-muted-foreground"
                                )}
                            >
                                {link.name}
                                {pathname === link.path && (
                                    <motion.div
                                        layoutId="nav-underline"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                    />
                                )}
                            </Link>
                        </Magnetic>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleLanguage}
                        className="rounded-full hover:bg-primary/10 transition-colors"
                    >
                        <Globe className="h-5 w-5" />
                    </Button>
                    <a href="https://github.com" target="_blank" rel="noreferrer" className="hidden sm:block">
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 transition-colors">
                            <Github className="h-5 w-5" />
                        </Button>
                    </a>

                    {/* Mobile Menu Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden rounded-full"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </Button>
                </div>
            </motion.div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden mt-4 mx-auto max-w-7xl rounded-[2rem] bg-background/90 backdrop-blur-2xl border border-primary/10 p-8 shadow-2xl overflow-hidden"
                    >
                        <div className="flex flex-col gap-6 items-center">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        "text-xs tracking-[0.4em] font-black uppercase transition-all",
                                        pathname === link.path ? "text-primary scale-110" : "text-muted-foreground"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
