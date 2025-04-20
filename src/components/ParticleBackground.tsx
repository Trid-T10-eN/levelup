import React, { useEffect, useRef } from 'react';
import { ParticleProps } from '../types';

const generateParticles = (count: number): ParticleProps[] => {
  const particles: ParticleProps[] = [];
  
  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      color: `rgba(0, 0, 255, ${Math.random() * 0.2 + 0.1})`,
      speed: Math.random() * 0.05 + 0.02
    });
  }
  
  return particles;
};

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<ParticleProps[]>(generateParticles(50));
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    let width = 0;
    let height = 0;
    
    const resizeCanvas = () => {
      if (canvas) {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
      }
    };
    
    const render = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, width, height);
      
      particlesRef.current.forEach(particle => {
        ctx.beginPath();
        ctx.arc(
          (particle.x * width) / 100,
          (particle.y * height) / 100,
          particle.size,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        particle.y -= particle.speed;
        
        if (particle.y < 0) {
          particle.y = 100;
          particle.x = Math.random() * 100;
        }
      });
      
      animationFrameId = window.requestAnimationFrame(render);
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    render();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default ParticleBackground;