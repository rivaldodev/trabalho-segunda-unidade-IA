
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, className, variant = 'primary', isLoading = false, ...props }) => {
  const baseStyle = "px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed";
  
  let variantStyle = "";
  switch (variant) {
    case 'primary':
      variantStyle = "bg-primary text-white hover:bg-blue-600 focus:ring-blue-500";
      break;
    case 'secondary':
      variantStyle = "bg-secondary text-white hover:bg-pink-500 focus:ring-pink-500";
      break;
    case 'danger':
      variantStyle = "bg-red-600 text-white hover:bg-red-500 focus:ring-red-500";
      break;
    default:
      variantStyle = "bg-primary text-white hover:bg-blue-600 focus:ring-blue-500";
  }

  return (
    <button
      className={`${baseStyle} ${variantStyle} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : children}
    </button>
  );
};
