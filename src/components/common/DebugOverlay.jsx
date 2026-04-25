import React, { useState, useEffect } from 'react';

const DebugOverlay = () => {
    const [logs, setLogs] = useState([]);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;

        const addLog = (type, args) => {
            const message = args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
            ).join(' ');
            
            const timestamp = new Date().toLocaleTimeString();
            setLogs(prev => [{ id: Date.now() + Math.random(), type, message, timestamp }, ...prev].slice(0, 20));
        };

        console.log = (...args) => {
            addLog('info', args);
            originalLog(...args);
        };
        console.error = (...args) => {
            addLog('error', args);
            originalError(...args);
        };
        console.warn = (...args) => {
            addLog('warn', args);
            originalWarn(...args);
        };

        return () => {
            console.log = originalLog;
            console.error = originalError;
            console.warn = originalWarn;
        };
    }, []);

    if (!isVisible) {
        return (
            <button 
                onClick={() => setIsVisible(true)}
                className="fixed bottom-4 right-4 z-[9999] bg-blue-600 text-white p-2 rounded-full text-[10px] font-bold"
            >
                DEBUG
            </button>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 z-[9999] w-72 max-h-60 bg-black/80 border border-white/20 rounded-xl overflow-hidden flex flex-col shadow-2xl pointer-events-none">
            <div className="p-2 bg-zinc-900 flex justify-between items-center pointer-events-auto">
                <span className="text-[10px] font-bold text-blue-500">LIVE DEBUG LOGS</span>
                <div className="flex gap-2">
                    <button onClick={() => setLogs([])} className="text-[10px] text-zinc-400 font-bold uppercase">Clear</button>
                    <button onClick={() => setIsVisible(false)} className="text-[10px] text-red-500 font-bold uppercase">Hide</button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 font-mono text-[9px] space-y-1 custom-scrollbar">
                {logs.length === 0 && <div className="text-zinc-600 italic">No logs yet...</div>}
                {logs.map(log => (
                    <div key={log.id} className={log.type === 'error' ? 'text-red-400' : (log.type === 'warn' ? 'text-yellow-400' : 'text-zinc-300')}>
                        <span className="text-blue-500/50">[{log.timestamp}]</span> {log.message}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DebugOverlay;
