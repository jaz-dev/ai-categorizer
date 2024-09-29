import React from 'react'

const TabButton: React.FC<{
    children: React.ReactNode;
    active: boolean;
    onClick: () => void;
  }> = ({ children, active, onClick }) => (
    <button
      className={`px-4 py-2 text-sm font-medium rounded-t-lg focus:outline-none ${
        active
          ? 'bg-white text-blue-600 border-t border-l border-r border-gray-300'
          : 'bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-50'
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );

export default TabButton;