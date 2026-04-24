import React, { useState } from 'react';
import { X, Bell, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Alert = ({ 
  children, 
  type = 'info', 
  dismissible = true, 
  onClose, 
  className = "" 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const styles = {
    info: 'bg-blue-50 border-blue-100 text-blue-700',
    success: 'bg-emerald-50 border-emerald-100 text-emerald-700',
    warning: 'bg-amber-50 border-amber-100 text-amber-700',
    error: 'bg-red-50 border-red-100 text-red-700',
  };

  const icons = {
    info: <Info size={18} />,
    success: <CheckCircle size={18} />,
    warning: <AlertTriangle size={18} />,
    error: <Bell size={18} />,
  };

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0, margin: 0 }}
        className={`flex items-start gap-3 p-4 rounded-xl border ${styles[type]} ${className} relative overflow-hidden`}
      >
        <div className="mt-0.5 flex-shrink-0">
          {icons[type]}
        </div>
        <div className="flex-1 text-sm font-medium leading-relaxed pr-6">
          {children}
        </div>
        {dismissible && (
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 text-current opacity-60 hover:opacity-100 transition-opacity"
          >
            <X size={18} />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Alert;
