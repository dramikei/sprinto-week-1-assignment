'use client';

import { forwardRef } from 'react';
import { useRouter } from 'next/navigation'


export const TooltipButton = forwardRef(({
  disabled = false, 
  tooltipText = '',
  variant = 'primary',
  className = '',
  children,
  href,
  ...props 
}, ref) => {
  const router = useRouter();
  const getButtonClasses = () => {
    const baseClasses = 'px-6 py-2 rounded-md font-medium transition-colors';
    
    if (disabled) {
      return variant === 'primary' 
        ? `${baseClasses} bg-blue-300 text-blue-500 cursor-not-allowed opacity-60`
        : `${baseClasses} bg-gray-300 text-gray-500 cursor-not-allowed opacity-60`;
    }
    
    return variant === 'primary'
      ? `${baseClasses} bg-blue-500 hover:bg-blue-600 text-white cursor-pointer`
      : `${baseClasses} bg-gray-500 hover:bg-gray-600 text-white cursor-pointer`;
  };

  return (
    <div className="relative inline-block group">
      <button 
        ref={ref}
        disabled={disabled}
        className={`${getButtonClasses()} ${className}`}
        onClick={() => {
          if (disabled) {
            return;
          }

          if(onClick) {
            onClick();
            return;
          }

          router.push(href);
        }}
        {...props}
      >
        <span>{children}</span>
      </button>
      
      {/* Tooltip */}
      {disabled && tooltipText && (
        <>
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            {tooltipText}
          </div>
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -mb-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50"></div>
        </>
      )}
    </div>
  );
});