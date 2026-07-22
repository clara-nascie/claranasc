import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [isHoverable, setIsHoverable] = useState(false);
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const match = window.matchMedia('(hover: hover) and (pointer: fine)');
    setIsHoverable(match.matches);

    if (match.matches) {
      let mouseX = 0, mouseY = 0;
      let outerX = 0, outerY = 0;
      let reqId: number;

      const handleMouseMove = (e: MouseEvent) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (innerRef.current) {
          innerRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        }
      };

      const render = () => {
        outerX += (mouseX - outerX) * 0.15;
        outerY += (mouseY - outerY) * 0.15;
        
        if (outerRef.current) {
          outerRef.current.style.transform = `translate(${outerX}px, ${outerY}px) translate(-50%, -50%)`;
        }
        reqId = requestAnimationFrame(render);
      };

      document.addEventListener('mousemove', handleMouseMove);
      reqId = requestAnimationFrame(render);

      const handleMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.tagName.toLowerCase() === 'a' || 
            target.tagName.toLowerCase() === 'button' || 
            target.closest('a') || 
            target.closest('button') ||
            target.classList.contains('lightbox-trigger')) {
          outerRef.current?.classList.add('cursor-hover');
          innerRef.current?.classList.add('cursor-hover');
        }
      };
      
      const handleMouseOut = () => {
        outerRef.current?.classList.remove('cursor-hover');
        innerRef.current?.classList.remove('cursor-hover');
      };

      document.addEventListener('mouseover', handleMouseOver);
      document.addEventListener('mouseout', handleMouseOut);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseover', handleMouseOver);
        document.removeEventListener('mouseout', handleMouseOut);
        cancelAnimationFrame(reqId);
      };
    }
  }, []);

  if (!isHoverable) return null;

  return (
    <>
      <div className="custom-cursor-outer" id="cursor-outer" ref={outerRef}></div>
      <div className="custom-cursor-inner" id="cursor-inner" ref={innerRef}></div>
    </>
  );
};
