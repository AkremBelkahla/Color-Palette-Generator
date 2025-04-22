import React from 'react';
import { Sliders } from 'lucide-react';

interface SettingsPanelProps {
  colorCount: number;
  onColorCountChange: (count: number) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  colorCount, 
  onColorCountChange 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <div className="flex items-center mb-4">
        <Sliders className="h-5 w-5 text-indigo-500 mr-2" />
        <h3 className="text-lg font-medium text-gray-900">Settings</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label 
            htmlFor="colorCount" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Number of Colors: {colorCount}
          </label>
          <input
            type="range"
            id="colorCount"
            min="3"
            max="7"
            value={colorCount}
            onChange={(e) => onColorCountChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>3</span>
            <span>5</span>
            <span>7</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;