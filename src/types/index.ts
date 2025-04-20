export interface CareerPath {
  id: string;
  name: string;
  description: string;
  color: string;
  position: {
    x: number;
    y: number;
    angle: number;
  };
}

export interface ParticleProps {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
}