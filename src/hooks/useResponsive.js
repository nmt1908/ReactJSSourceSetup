import { useState, useEffect } from 'react';

/**
 * useResponsive Hook
 * Lắng nghe kích thước màn hình và trạng thái thiết bị thực tế
 */
export const useResponsive = () => {
    const [screenSize, setScreenSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
        isTouch: typeof window !== 'undefined' ? ('ontouchstart' in window || navigator.maxTouchPoints > 0) : false,
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleResize = () => {
            setScreenSize({
                width: window.innerWidth,
                height: window.innerHeight,
                isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
            });
        };

        // Lắng nghe sự kiện thay đổi kích thước
        window.addEventListener('resize', handleResize);
        
        // Log ngay lập tức để debug
        console.log(`[useResponsive] Render: ${window.innerWidth}x${window.innerHeight} | Touch: ${screenSize.isTouch}`);

        return () => window.removeEventListener('resize', handleResize);
    }, [screenSize.isTouch]);

    // Các trạng thái dẫn xuất (Derived States)
    // Coi là Tablet nếu có Touch hoặc chiều rộng nằm trong dải trung bình (700px - 1400px)
    const isTablet = screenSize.isTouch || (screenSize.width >= 700 && screenSize.width <= 1400);
    
    // Desktop là màn hình lớn và KHÔNG có touch
    const isDesktop = !screenSize.isTouch && screenSize.width > 1280;
    
    // Đặc biệt cho Tablet độ phân giải cao (Viewport >= 1000px)
    const isHighResPad = isTablet && screenSize.width >= 1000;

    return {
        ...screenSize,
        isTablet,
        isDesktop,
        isHighResPad
    };
};

export default useResponsive;
