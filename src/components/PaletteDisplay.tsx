import React, { useEffect, useState } from 'react';
import { extractColors } from '../utils/colorExtractor';
import { Color, ExtractedPalette } from '../types';
import ColorCard from './ColorCard';
import { FileCode } from 'lucide-react';

interface PaletteDisplayProps {
  imageUrl: string | null;
  colorCount: number;
  onPaletteExtracted: (palette: ExtractedPalette) => void;
}

const PaletteDisplay: React.FC<PaletteDisplayProps> = ({ 
  imageUrl, 
  colorCount,
  onPaletteExtracted
}) => {
  const [colors, setColors] = useState<Color[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'css' | 'scss'>('css');

  useEffect(() => {
    if (!imageUrl) return;

    const getColors = async () => {
      setIsExtracting(true);
      try {
        const extractedColors = await extractColors(imageUrl, colorCount);
        setColors(extractedColors);
        onPaletteExtracted({
          sourceImage: imageUrl,
          colors: extractedColors
        });
      } catch (error) {
        console.error('Error extracting colors:', error);
      } finally {
        setIsExtracting(false);
      }
    };

    getColors();
  }, [imageUrl, colorCount, onPaletteExtracted]);

  const generateExportCode = () => {
    if (exportFormat === 'css') {
      let css = ':root {\n';
      colors.forEach((color, index) => {
        css += `  --color-${index + 1}: ${color.hex};\n`;
      });
      css += '}';
      return css;
    } else {
      let scss = '';
      colors.forEach((color, index) => {
        scss += `$color-${index + 1}: ${color.hex};\n`;
      });
      return scss;
    }
  };

  const copyExportCode = () => {
    const code = generateExportCode();
    navigator.clipboard.writeText(code);
    const exportBtn = document.getElementById('export-copy-btn');
    if (exportBtn) {
      exportBtn.textContent = 'Copied!';
      setTimeout(() => {
        exportBtn.textContent = 'Copy';
      }, 2000);
    }
  };

  if (!imageUrl) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-6 relative min-h-[200px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Color Palette
          </h2>
          
          <button
            onClick={() => setExportOpen(!exportOpen)}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 text-sm font-medium"
          >
            <FileCode className="h-4 w-4 mr-1" />
            Export
          </button>
        </div>

        {isExtracting ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10 rounded-lg">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-600">Extracting colors...</p>
            </div>
          </div>
        ) : (
          <>
            {exportOpen && (
              <div className="mb-6 bg-gray-50 rounded-md border border-gray-200 p-4 animate-fade-in">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex space-x-2">
                    <button
                      className={`px-3 py-1 text-sm rounded-md ${
                        exportFormat === 'css' 
                          ? 'bg-indigo-100 text-indigo-700' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      onClick={() => setExportFormat('css')}
                    >
                      CSS
                    </button>
                    <button
                      className={`px-3 py-1 text-sm rounded-md ${
                        exportFormat === 'scss' 
                          ? 'bg-indigo-100 text-indigo-700' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      onClick={() => setExportFormat('scss')}
                    >
                      SCSS
                    </button>
                  </div>
                  <button
                    id="export-copy-btn"
                    onClick={copyExportCode}
                    className="px-3 py-1 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
                  >
                    Copy
                  </button>
                </div>
                <pre className="text-xs bg-gray-900 text-gray-100 p-3 rounded-md overflow-x-auto">
                  {generateExportCode()}
                </pre>
              </div>
            )}
            
            <div className="grid grid-cols-1 gap-3">
              {colors.map((color, index) => (
                <ColorCard key={index} color={color} index={index} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaletteDisplay;