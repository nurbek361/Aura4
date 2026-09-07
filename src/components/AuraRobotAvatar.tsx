import React, { useEffect, useState } from 'react';
import { ASSETS } from '../data/mockData';

interface AuraRobotAvatarProps {
  className?: string;
  onClick?: () => void;
}

export const AuraRobotAvatar: React.FC<AuraRobotAvatarProps> = ({
  className = 'w-48 h-48 sm:w-56 sm:h-56',
  onClick,
}) => {
  const [processedSrc, setProcessedSrc] = useState<string>(ASSETS.robotSphere);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = ASSETS.robotSphere;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const size = img.naturalWidth || 512;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, size, size);
        const imgData = ctx.getImageData(0, 0, size, size);
        const data = imgData.data;

        // Eliminate any black/near-black background pixels to prevent any dark circles or borders
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const brightness = Math.max(r, g, b);

          if (brightness < 20) {
            data[i + 3] = 0;
          } else if (brightness < 50) {
            data[i + 3] = Math.round(((brightness - 20) / 30) * 255);
          }
        }

        ctx.putImageData(imgData, 0, 0);
        setProcessedSrc(canvas.toDataURL('image/png'));
      } catch {
        // Safe fallback if CORS restricts canvas read
      }
    };
  }, []);

  return (
    <div
      onClick={onClick}
      className={`relative z-10 flex items-center justify-center select-none cursor-pointer transition-transform duration-300 active:scale-95 ${className}`}
    >
      {/* Soft Ambient Radial Core Glow without any black circle */}
      <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#06b6d4]/25 via-[#8b5cf6]/30 to-[#ec4899]/25 blur-2xl pointer-events-none"></div>

      <img
        alt="Aura AI floating robot assistant"
        src={processedSrc}
        className="w-full h-full object-contain pointer-events-none select-none"
        style={{ mixBlendMode: 'screen' }}
      />
    </div>
  );
};
