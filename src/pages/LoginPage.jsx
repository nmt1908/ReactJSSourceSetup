import React, { useState, useMemo, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Lock, Delete, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import useResponsive from '@/hooks/useResponsive';
import { useAppStore } from '@/store/appStore';
import { authApi } from '@/api/authApi';

const LoginPage = () => {
    const { isHighResPad } = useResponsive();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    
    const setUser = useAppStore(state => state.setUser);
    
    const [empNo, setEmpNo] = useState('');
    const [password, setPassword] = useState('');
    const [activeField, setActiveField] = useState('empNo'); // 'empNo' or 'password'
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleNumpadClick = useCallback((val) => {
        setError('');
        if (val === 'DEL') {
            if (activeField === 'empNo') setEmpNo(prev => prev.slice(0, -1));
            else setPassword(prev => prev.slice(0, -1));
        } else {
            if (activeField === 'empNo') {
                if (empNo.length < 10) setEmpNo(prev => prev + val);
            } else {
                if (password.length < 10) setPassword(prev => prev + val);
            }
        }
    }, [activeField, empNo, password]);

    const handleLogin = async () => {
        if (!empNo || !password) {
            setError(t('login_error'));
            return;
        }

        setLoading(true);
        setError('');

        try {
            const data = await authApi.login(empNo, password);
            
            if (data && data.empno) {
                // Access Control Logic:
                // 1. Must be in department VVG0DI
                // 2. EXCEPT for account 047409 (LEO) - bypass dept check
                const isAuthorized = (data.high_dept === 'VVG0DI') || (data.empno === '047409');

                if (isAuthorized) {
                    setUser({
                        empNo: data.empno,
                        name: data.name,
                        dept: data.high_dept,
                        token: data.session_token
                    });
                    navigate('/');
                } else {
                    setError('PHÒNG BAN KHÔNG ĐƯỢC PHÉP TRUY CẬP!');
                }
            } else {
                setError(t('login_error') || 'SAI MÃ SỐ HOẶC MẬT KHẨU!');
            }
        } catch (err) {
            console.error("Login detail error:", err);
            setError('LỖI KẾT NỐI HỆ THỐNG ĐĂNG NHẬP!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full bg-[#050505] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans select-none border-none">
            {/* Nitro Background Decor */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] pointer-events-none opacity-40" 
                 style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)' }} />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] pointer-events-none opacity-30" 
                 style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)' }} />

            {/* Static Speed Lines Background */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
                 style={{ 
                     backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 100px, #ffffff 100px, #ffffff 101px)',
                     backgroundSize: '200% 200%'
                 }} />

            {/* Language Switcher */}
            <div className="absolute top-8 right-8 flex gap-3 z-50">
                {['vi', 'zh', 'en'].map((l) => (
                    <motion.button
                        key={l}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => i18n.changeLanguage(l)}
                        className={cn(
                            "px-5 py-2.5 rounded-2xl font-black transition-all border uppercase text-[0.7rem] tracking-widest",
                            i18n.language === l
                                ? "bg-blue-600 text-white border-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                                : "bg-white/5 text-white/40 border-white/10"
                        )}
                    >
                        {l}
                    </motion.button>
                ))}
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl w-full flex flex-col items-center z-10 gap-10"
            >
                <div className="text-center">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center">
                            <ShieldCheck className="w-7 h-7 text-blue-500" />
                        </div>
                        <h1 className="text-white font-black text-5xl md:text-6xl uppercase tracking-tighter italic">
                            {t('login_title')}
                        </h1>
                    </div>
                    <p className="text-blue-500/60 font-black tracking-[0.4em] uppercase text-xs italic">
                        {t('please_login')}
                    </p>
                    <div className="h-1 w-32 bg-blue-600 mx-auto rounded-full mt-6 shadow-[0_0_20px_rgba(37,99,235,0.5)]" />
                </div>

                <div className={cn(
                    "grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-5xl items-stretch",
                    isHighResPad && "gap-8"
                )}>
                    {/* Inputs Section */}
                    <div className="flex flex-col gap-6 justify-center">
                        <motion.div
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setActiveField('empNo')}
                            className={cn(
                                "p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer relative overflow-hidden",
                                activeField === 'empNo'
                                    ? "bg-blue-600/10 border-blue-500 shadow-[0_0_40px_rgba(37,99,235,0.1)]"
                                    : "bg-[#0c0d12]/60 border-white/5"
                            )}
                        >
                            <label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-3 block">
                                <div className="flex items-center gap-2">
                                    <User className="w-3 h-3" />
                                    {t('emp_no')}
                                </div>
                            </label>
                            <div className="text-white text-5xl font-black tracking-widest h-14 flex items-center italic">
                                {empNo}
                                {activeField === 'empNo' && <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity }} className="w-1.5 h-10 bg-blue-500 ml-3 rounded-full" />}
                            </div>
                        </motion.div>

                        <motion.div
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setActiveField('password')}
                            className={cn(
                                "p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer relative overflow-hidden",
                                activeField === 'password'
                                    ? "bg-blue-600/10 border-blue-500 shadow-[0_0_40px_rgba(37,99,235,0.1)]"
                                    : "bg-[#0c0d12]/60 border-white/5"
                            )}
                        >
                            <label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-3 block">
                                <div className="flex items-center gap-2">
                                    <Lock className="w-3 h-3" />
                                    {t('password')}
                                </div>
                            </label>
                            <div className="text-white text-5xl font-black tracking-[0.3em] h-14 flex items-center italic">
                                {"•".repeat(password.length)}
                                {activeField === 'password' && <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity }} className="w-1.5 h-10 bg-blue-500 ml-3 rounded-full" />}
                            </div>
                        </motion.div>

                        <AnimatePresence>
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="bg-red-500/10 border border-red-500/50 text-red-500 px-6 py-4 rounded-2xl font-black text-sm text-center italic tracking-tight"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLogin}
                            disabled={loading}
                            className={cn(
                                "mt-2 w-full py-7 text-white font-black text-2xl rounded-[2.5rem] uppercase tracking-[0.3em] shadow-2xl transition-all italic flex items-center justify-center gap-4",
                                loading ? 'bg-blue-800 opacity-70 cursor-wait' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'
                            )}
                        >
                            {loading ? (
                                <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full"
                                />
                            ) : (
                                <>
                                    {t('login_button')}
                                    <ArrowRight className="w-6 h-6" />
                                </>
                            )}
                        </motion.button>
                    </div>

                    {/* Numpad Section */}
                    <div className="grid grid-cols-3 gap-4 bg-[#0c0d12]/40 p-8 rounded-[3rem] border border-white/5 backdrop-blur-md">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'DEL', 0, 'OK'].map((btn) => (
                            <motion.button
                                key={btn}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => btn === 'OK' ? handleLogin() : handleNumpadClick(btn)}
                                className={cn(
                                    "h-[10vh] md:h-auto min-h-[90px] rounded-[1.8rem] font-black text-4xl transition-all flex items-center justify-center border-2",
                                    btn === 'DEL'
                                        ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                        : btn === 'OK'
                                            ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-600/20'
                                            : 'bg-white/5 text-zinc-300 border-white/5'
                                )}
                            >
                                {btn === 'DEL' ? <Delete className="w-8 h-8" /> : btn}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Bottom Footer */}
            <div className="absolute bottom-6 text-zinc-500/30 font-black tracking-[0.6em] text-[9px] uppercase italic">
                SECURE AUTHENTICATION GATEWAY • NITRO CORE V1.0 • {new Date().getFullYear()}
            </div>
        </div>
    );
};

export default memo(LoginPage);
