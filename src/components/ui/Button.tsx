import React from 'react';

interface ButtonProps {
  as?: 'button' | 'a';
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  children: React.ReactNode;
  id?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

export const Button: React.FC<ButtonProps> = ({ as = 'button', href, type, className = '', children, id, onClick }) => {
  // Variantes que trazem o próprio estilo completo não recebem a base `.btn`.
  const finalClass = className.includes('btn-header-cta') || className.includes('btn-zoom') 
    ? className 
    : `btn ${className}`.trim();
  
  if (as === 'a' || href) {
    return (
      <a href={href} className={finalClass} id={id} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <button type={type || 'button'} className={finalClass} id={id} onClick={onClick}>
      {children}
    </button>
  );
};
