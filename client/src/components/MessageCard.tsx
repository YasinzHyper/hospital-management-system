import React, { useState, useEffect } from 'react';

interface MessageCardProps {
  message: string;
  type: 'error' | 'success' | 'info';
  onClose: () => void;
}

const MessageCard: React.FC<MessageCardProps> = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 10000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  const bgColor = type === 'error' ? 'bg-red-100' : type === 'success' ? 'bg-green-100' : 'bg-blue-100';
  const textColor = type === 'error' ? 'text-red-800' : type === 'success' ? 'text-green-800' : 'text-blue-800';

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-md ${bgColor} ${textColor} shadow-md`}>
      <div className="flex justify-between items-center">
        <p>{message}</p>
        <button onClick={() => { setIsVisible(false); onClose(); }} className="ml-4 text-gray-500 hover:text-gray-700">
          ×
        </button>
      </div>
    </div>
  );
};

export default MessageCard;