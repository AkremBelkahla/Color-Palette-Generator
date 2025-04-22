import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import ImageUploader from './components/ImageUploader';
import PaletteDisplay from './components/PaletteDisplay';
import SettingsPanel from './components/SettingsPanel';
import HistoryPanel from './components/HistoryPanel';
import { ExtractedPalette } from './types';
import { useColorHistory } from './hooks/useColorHistory';

function App() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [palette, setPalette] = useState<ExtractedPalette | null>(null);
  const [colorCount, setColorCount] = useState<number>(5);
  const { savedPalettes, savePalette, clearHistory } = useColorHistory();
  const [showHistory, setShowHistory] = useState(false);

  const handleImageUpload = (url: string) => {
    setImageUrl(url);
    setPalette(null); // Reset palette when new image is uploaded
  };

  const handlePaletteExtracted = (newPalette: ExtractedPalette) => {
    setPalette(newPalette);
  };

  const handleColorCountChange = (count: number) => {
    setColorCount(count);
  };

  const handleSavePalette = () => {
    if (palette && imageUrl) {
      savePalette({
        ...palette,
        imageUrl,
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 py-4 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">Color Palette Generator</h1>
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="text-gray-600 hover:text-indigo-600 transition-colors"
          >
            {showHistory ? 'Close History' : 'View History'}
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        {showHistory ? (
          <HistoryPanel 
            palettes={savedPalettes} 
            onSelect={(selectedPalette) => {
              setImageUrl(selectedPalette.imageUrl);
              setPalette({
                colors: selectedPalette.colors,
                sourceImage: selectedPalette.sourceImage
              });
              setShowHistory(false);
            }}
            onClear={clearHistory}
          />
        ) : (
          <>
            {!imageUrl ? (
              <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
                <ImageUploader onImageUploaded={handleImageUpload} />
                <p className="mt-4 text-gray-500 text-center max-w-md">
                  Upload an image to extract its dominant colors. We'll analyze it 
                  and create a beautiful color palette for your design projects.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="flex flex-col">
                  <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                    <div className="relative aspect-video bg-gray-100 rounded overflow-hidden">
                      {imageUrl && (
                        <img
                          src={imageUrl}
                          alt="Uploaded image"
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                    <div className="mt-4 flex justify-between">
                      <button
                        onClick={() => {
                          setImageUrl(null);
                          setPalette(null);
                        }}
                        className="text-gray-600 hover:text-gray-900 text-sm py-1 px-3 rounded border border-gray-300 hover:border-gray-400 transition-colors"
                      >
                        Upload New Image
                      </button>
                      
                      {palette && (
                        <button
                          onClick={handleSavePalette}
                          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 text-sm font-medium py-1 px-3 rounded border border-indigo-200 hover:border-indigo-300 transition-colors"
                        >
                          <PlusCircle className="h-4 w-4 mr-1" />
                          Save Palette
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <SettingsPanel 
                    colorCount={colorCount} 
                    onColorCountChange={handleColorCountChange} 
                  />
                </div>
                
                <PaletteDisplay 
                  imageUrl={imageUrl} 
                  colorCount={colorCount}
                  onPaletteExtracted={handlePaletteExtracted} 
                />
              </div>
            )}
          </>
        )}
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4 px-6">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          Color Palette Generator © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}

export default App;