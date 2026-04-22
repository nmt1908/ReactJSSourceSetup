import React, { useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Reusable Nitro Notification Component
 * @param {boolean} show - Toggle visibility
 * @param {string} message - Content message
 * @param {string} type - 'success' | 'error' | 'warning'
 * @param {number} duration - Auto-close duration in ms (default 3000)
 * @param {function} onClose - Cleanup function called after duration
 */
const Notification = ({ 
    show, 
    message, 
    type = 'success', 
    duration = 3000, 
    onClose 
}) => {
    
    useEffect(() => {
        if (show && duration > 0) {
            const timer = setTimeout(() => {
                onClose && onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [show, duration, onClose]);

    const config = {
        success: {
            icon: CheckCircle,
            color: 'emerald',
            bg: 'bg-emerald-500/20',
            border: 'border-emerald-500/40',
            text: 'text-emerald-400',
            glow: 'shadow-[0_0_30px_rgba(16,185,129,0.3)]'
        },
        error: {
            icon: AlertCircle,
            color: 'red',
            bg: 'bg-red-500/20',
            border: 'border-red-500/40',
            text: 'text-red-400',
            glow: 'shadow-[0_0_30px_rgba(239,68,68,0.3)]'
        }
    };

    const current = config[type] || config.success;
    const Icon = current.icon;

    return (
        <AnimatePresence>
            {show && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none p-6">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 40 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: -20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className={cn(
                            "w-full max-w-sm px-8 py-6 rounded-[2.5rem] border-2 flex flex-col items-center justify-center text-center backdrop-blur-xl relative",
                            current.bg,
                            current.border,
                            current.glow
                        )}
                    >
                        {/* Racing Stripes Decoration */}
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-30">
                            <div className={cn("w-1 h-3 skew-x-[-20deg]", current.bg.replace('/20', '/60'))} />
                            <div className={cn("w-1 h-3 skew-x-[-20deg]", current.bg.replace('/20', '/60'))} />
                            <div className={cn("w-1 h-3 skew-x-[-20deg]", current.bg.replace('/20', '/60'))} />
                        </div>

                        <motion.div 
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1, type: "spring", stiffness: 400 }}
                            className={cn("w-20 h-20 rounded-full flex items-center justify-center mb-6", current.bg)}
                        >
                            <Icon className={cn("w-10 h-10", current.text)} />
                        </motion.div>

                        <h3 className={cn("text-2xl font-black italic uppercase tracking-tight", current.text)}>
                            {message}
                        </h3>

                        {/* Progress Bar (Timer indicator) */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-1 bg-white/5 overflow-hidden">
                            <motion.div 
                                initial={{ width: '100%' }}
                                animate={{ width: '0%' }}
                                transition={{ duration: duration / 1000, ease: "linear" }}
                                className={cn("h-full", current.text.replace('text-', 'bg-'))}
                            />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default memo(Notification);
