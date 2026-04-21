import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import useResponsive from '@/hooks/useResponsive';

const DigitalClock = () => {
    const { isHighResPad } = useResponsive();
    const { t, i18n } = useTranslation();
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Get the day key for translation (monday, tuesday, ...)
    const dayKey = time.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    // Formatting date to YYYY/MM/DD
    const formatDate = () => {
        const day = time.getDate().toString().padStart(2, '0');
        const month = (time.getMonth() + 1).toString().padStart(2, '0');
        const year = time.getFullYear();
        return `${year}/${month}/${day}`;
    };

    return (
        <div className={cn(
            "flex items-center gap-4 bg-white/[0.03] px-6 py-2.5 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl group transition-all hover:bg-white/[0.08] hover:border-blue-500/30",
            isHighResPad && "px-8 py-3"
        )}>
            <div className="flex items-baseline gap-1.5 text-white font-black italic tracking-tighter">
                <span className={cn("text-2xl tabular-nums leading-none", isHighResPad && "text-3xl")}>
                    {time.getHours().toString().padStart(2, '0')}
                </span>
                <span className="text-xl animate-pulse opacity-50 relative top-[-1px]">:</span>
                <span className={cn("text-2xl tabular-nums leading-none", isHighResPad && "text-3xl")}>
                    {time.getMinutes().toString().padStart(2, '0')}
                </span>
                <span className="text-xl animate-pulse opacity-50 relative top-[-1px]">:</span>
                <span className={cn("text-2xl tabular-nums leading-none", isHighResPad && "text-3xl")}>
                    {time.getSeconds().toString().padStart(2, '0')}
                </span>
            </div>

            <div className="w-[1px] h-6 bg-white/10 mx-1" />

            <div className="flex flex-col items-start leading-[1.1] gap-0">
                <span className={cn("text-blue-500 font-black uppercase tracking-[0.2em] text-[10px] italic", isHighResPad && "text-xs")}>
                    {t(dayKey)}
                </span>
                <span className={cn("text-zinc-500 font-bold tracking-[0.1em] text-[10px] uppercase", isHighResPad && "text-xs")}>
                    {formatDate()}
                </span>
            </div>
        </div>
    );
};

export default DigitalClock;
