import React, { useEffect } from 'react';
import { CheckCircle, X, Info, AlertCircle } from 'lucide-react';

export interface ToastProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 3000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="h-6 w-6 text-emerald-400" />;
      case 'error': return <AlertCircle className="h-6 w-6 text-red-400" />;
      default: return <Info className="h-6 w-6 text-blue-400" />;
    }
  };

  return (
    <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 animate-slideInRight mb-3">
      <div className="p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-slate-900">
              {type === 'success' ? '¡Éxito!' : type === 'error' ? 'Error' : 'Información'}
            </p>
            <p className="mt-1 text-sm text-slate-500">{message}</p>
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              type="button"
              className="inline-flex rounded-md bg-white text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              onClick={() => onClose(id)}
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;