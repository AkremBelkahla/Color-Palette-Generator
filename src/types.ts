export interface Color {
  hex: string;
  rgb: {
    r: number;
    g: number;
    b: number;
  };
  count: number; // How many pixels had this color (used for sorting)
}

export interface ExtractedPalette {
  sourceImage: string; // Data URL of the source image
  colors: Color[];
}

export interface SavedPalette extends ExtractedPalette {
  imageUrl: string;
  timestamp: string;
}