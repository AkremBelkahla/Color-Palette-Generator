import React from 'react';
import { Trash2, Clock } from 'lucide-react';
import { SavedPalette } from '../types';
import { formatDate } from '../utils/dateUtils';

interface HistoryPanelProps {
  palettes: SavedPalette[];
  onSelect: (palette: SavedPalette) => void;
  onClear: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ 
  palettes, 
  onSelect,
  onClear
}) => {
  if (palettes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <Clock className="h-12 w-12 text-gray-300 mb-4" />
        <h2 className="text-xl font-medium text-gray-700 mb-2">No Saved Palettes</h2>
        <p className="text-gray-500 text-center max-w-md">
          When you save color palettes, they will appear here for future reference.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Saved Palettes</h2>
        <button
          onClick={onClear}
          className="text-sm flex items-center text-red-500 hover:text-red-700 py-1 px-3 rounded border border-red-200 hover:border-red-300 transition-colors"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Clear History
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {palettes.map((palette, index) => (
          <div 
            key={index} 
            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onSelect(palette)}
          >
            <div className="aspect-video bg-gray-100 overflow-hidden">
              <img 
                src={palette.imageUrl} 
                alt={`Palette ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-3">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-800">Palette {index + 1}</h3>
                <span className="text-xs text-gray-500">{formatDate(palette.timestamp)}</span>
              </div>
              
              <div className="flex space-x-1 h-6">
                {palette.colors.map((color, colorIndex) => (
                  <div 
                    key={colorIndex}
                    className="flex-1 rounded-sm"
                    style={{ backgroundColor: color.hex }}
                    title={color.hex}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPanel;