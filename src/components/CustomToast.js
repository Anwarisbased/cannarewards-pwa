'use client';

import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/solid';

// This is the visual component for the toast
function CustomToast({ t, icon, title, message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5"
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            {icon}
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">{title}</p>
            <p className="mt-1 text-sm text-gray-500">{message}</p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-primary hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Close
        </button>
      </div>
    </motion.div>
  );
}

// This is our helper function to easily show different types of toasts
export const showToast = (type, title, message) => {
  let icon;
  switch (type) {
    case 'success':
      icon = <CheckCircleIcon className="h-6 w-6 text-green-500" aria-hidden="true" />;
      break;
    case 'error':
      icon = <XCircleIcon className="h-6 w-6 text-red-500" aria-hidden="true" />;
      break;
    default:
      icon = <InformationCircleIcon className="h-6 w-6 text-blue-500" aria-hidden="true" />;
      break;
  }

  toast.custom((t) => (
    <CustomToast t={t} icon={icon} title={title} message={message} />
  ), {
    position: 'top-center',
    duration: 4000,
  });
};