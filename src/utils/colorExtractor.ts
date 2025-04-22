import { Color } from '../types';

// Convert RGB to hex
export const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b]
    .map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    })
    .join('');
};

// Calculate perceived brightness to determine if text should be light or dark
export const getContrastColor = (hexColor: string): string => {
  // Remove the # if it exists
  const hex = hexColor.replace('#', '');
  
  // Parse the RGB values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate the perceived brightness using the formula
  // (0.299*R + 0.587*G + 0.114*B)
  const brightness = (r * 0.299 + g * 0.587 + b * 0.114);
  
  // Return white for dark colors, black for light colors
  return brightness < 128 ? '#ffffff' : '#000000';
};

// Simple quantization to reduce the number of colors
const quantizeColor = (color: number, levels: number = 8): number => {
  const step = 256 / levels;
  return Math.floor(color / step) * step;
};

// Extract dominant colors from an image
export const extractColors = async (
  imageUrl: string,
  colorCount: number = 5
): Promise<Color[]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      // Create canvas to process the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Set canvas dimensions (downsample large images for performance)
      const maxDimension = 400;
      let { width, height } = img;
      
      if (width > height && width > maxDimension) {
        height = (height / width) * maxDimension;
        width = maxDimension;
      } else if (height > maxDimension) {
        width = (width / height) * maxDimension;
        height = maxDimension;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw image onto canvas
      ctx.drawImage(img, 0, 0, width, height);
      
      // Get pixel data
      const imageData = ctx.getImageData(0, 0, width, height).data;
      
      // Count color occurrences with quantization to reduce noise
      const colorCounts: Record<string, { count: number; rgb: { r: number; g: number; b: number } }> = {};
      
      for (let i = 0; i < imageData.length; i += 4) {
        // Skip transparent pixels
        if (imageData[i + 3] < 128) continue;
        
        // Apply quantization to reduce the number of unique colors
        const r = quantizeColor(imageData[i]);
        const g = quantizeColor(imageData[i + 1]);
        const b = quantizeColor(imageData[i + 2]);
        
        // Skip very dark (almost black) and very light (almost white) colors
        if ((r < 30 && g < 30 && b < 30) || (r > 225 && g > 225 && b > 225)) {
          continue;
        }
        
        const hex = rgbToHex(r, g, b);
        
        if (colorCounts[hex]) {
          colorCounts[hex].count++;
        } else {
          colorCounts[hex] = {
            count: 1,
            rgb: { r, g, b }
          };
        }
      }
      
      // Convert to array and sort by frequency
      const colorArray: Color[] = Object.entries(colorCounts).map(([hex, data]) => ({
        hex,
        rgb: data.rgb,
        count: data.count
      }));
      
      // Sort by count (descending)
      colorArray.sort((a, b) => b.count - a.count);
      
      // Return the top N colors
      resolve(colorArray.slice(0, colorCount));
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageUrl;
  });
};

// Generate CSS code for the extracted colors
export const generateCssCode = (colors: Color[]): string => {
  let css = ':root {\n';
  
  colors.forEach((color, index) => {
    css += `  --color-${index + 1}: ${color.hex};\n`;
  });
  
  css += '}\n';
  return css;
};

// Generate SCSS code for the extracted colors
export const generateScssCode = (colors: Color[]): string => {
  let scss = '';
  
  colors.forEach((color, index) => {
    scss += `$color-${index + 1}: ${color.hex};\n`;
  });
  
  return scss;
};