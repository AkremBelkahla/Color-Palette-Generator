import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Color } from '../types';
import { getContrastColor } from '../utils/colorExtractor';

interface ColorCardProps {
  color: Color;
  index: number;
}

const ColorCard: React.FC<ColorCardProps> = ({ color, index }) => {
  const [copied, setCopied] = useState(false);
  const textColor = getContrastColor(color.hex);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(color.hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate a more descriptive name based on the index
  const colorName = `Color ${index + 1}`;

  return (
    <div 
      className="rounded-md overflow-hidden shadow-sm transition-all duration-300 transform hover:shadow-md" 
      style={{ 
        animation: `fadeIn 0.3s ease forwards ${index * 0.1}s`,
        opacity: 0
      }}
    >
      <div 
        className="h-16 flex items-center justify-between px-4 cursor-pointer"
        style={{ 
          backgroundColor: color.hex,
          color: textColor
        }}
        onClick={copyToClipboard}
      >
        <span className="font-medium">{colorName}</span>
        <div className="flex items-center space-x-2">
          <span className="font-mono">{color.hex}</span>
          <button
            className="p-1 rounded-full hover:bg-opacity-20 hover:bg-black transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard();
            }}
            aria-label="Copy color code"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
      <div className="bg-white px-4 py-2 text-xs text-gray-500">
        RGB: {color.rgb.r}, {color.rgb.g}, {color.rgb.b}
      </div>
    </div>
  );
};

export default ColorCard;