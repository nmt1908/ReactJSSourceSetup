import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Hook to interface with the High-Performance Native Android Scanner
 */
export const useNativeScanner = (onSuccess) => {
  const [isNative, setIsNative] = useState(false);
  const { i18n } = useTranslation();

  useEffect(() => {
    // Check if we are running inside the Android WebView with our bridge
    if (window.AndroidBridge) {
      setIsNative(true);
      
      // Register global callback for Android to call
      window.onScanSuccess = (data) => {
        console.log("📡 [NATIVE SCANNER] Success signal received!");
        if (onSuccess) onSuccess(data);
      };

      window.onScanError = (error) => {
        console.error("Native Scan Error:", error);
      };
    }
  }, [onSuccess]);

  const startScan = useCallback(() => {
    if (window.AndroidBridge) {
      window.AndroidBridge.startScanner(i18n.language || 'en');
    } else {
      // Fallback for browser testing
      const mockResult = prompt("Vui lòng nhập mã QR (Chế độ giả lập Browser):");
      if (mockResult && onSuccess) {
        onSuccess(mockResult);
      }
    }
  }, [onSuccess, i18n.language]);

  return { startScan, isNative };
};
