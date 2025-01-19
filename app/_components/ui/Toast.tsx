"use client";
import { useEffect, useState, ReactElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, XCircle, Loader2 } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "loading" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
}

interface IconsMap {
  [key: string]: ReactElement;
}

export function Toast({ message, type = "info", onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const icons: IconsMap = {
    success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
    error: <XCircle className="w-5 h-5 text-red-400" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-400" />,
    loading: <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />,
    info: <AlertCircle className="w-5 h-5 text-blue-400" />,
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg p-4 flex items-center gap-3 min-w-[300px]"
        >
          {icons[type]}
          <p className="text-sm text-zinc-200">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
