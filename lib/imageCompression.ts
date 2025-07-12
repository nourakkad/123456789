export interface CompressedImage {
  file: File;
  originalSize: number;
  compressedSize: number;
  quality: number;
}

export async function compressImage(
  file: File,
  maxSizeKB: number = 500,
  maxWidth: number = 1200,
  maxHeight: number = 1200
): Promise<CompressedImage> {
  return new Promise((resolve, reject) => {
    console.log(`Compressing ${file.name}:`, { originalSize: file.size, maxSizeKB });
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      console.log(`Image loaded: ${file.name}`, { originalWidth: img.width, originalHeight: img.height });
      
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;
        console.log(`Resizing ${file.name} to:`, { width, height });
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw image on canvas
      ctx?.drawImage(img, 0, 0, width, height);
      
      // Start with high quality and reduce if needed
      let quality = 0.9;
      let compressedFile: File;
      
      const compressWithQuality = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              console.error(`Failed to create blob for ${file.name}`);
              reject(new Error('Failed to compress image'));
              return;
            }
            
            compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            
            const compressedSizeKB = compressedFile.size / 1024;
            console.log(`Compression attempt for ${file.name}:`, { 
              quality, 
              compressedSizeKB, 
              maxSizeKB,
              reduction: ((file.size - compressedFile.size) / file.size * 100).toFixed(1) + '%'
            });
            
            // If still too large and quality can be reduced further
            if (compressedSizeKB > maxSizeKB && quality > 0.1) {
              quality -= 0.1;
              console.log(`Reducing quality to ${quality} for ${file.name}`);
              compressWithQuality();
            } else {
              console.log(`Final compression for ${file.name}:`, { 
                originalSize: file.size, 
                compressedSize: compressedFile.size,
                quality 
              });
              resolve({
                file: compressedFile,
                originalSize: file.size,
                compressedSize: compressedFile.size,
                quality: quality,
              });
            }
          },
          'image/jpeg',
          quality
        );
      };
      
      compressWithQuality();
    };
    
    img.onerror = () => {
      console.error(`Failed to load image: ${file.name}`);
      reject(new Error('Failed to load image'));
    };
    img.src = URL.createObjectURL(file);
  });
}

export async function compressMultipleImages(
  files: File[],
  maxSizeKB: number = 500
): Promise<CompressedImage[]> {
  console.log(`Starting batch compression for ${files.length} files`);
  const compressedImages: CompressedImage[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    console.log(`Processing file ${i + 1}/${files.length}: ${file.name}`);
    
    try {
      const compressed = await compressImage(file, maxSizeKB);
      compressedImages.push(compressed);
      console.log(`Successfully compressed ${file.name}`);
    } catch (error) {
      console.error(`Failed to compress ${file.name}:`, error);
      // If compression fails, use original file
      compressedImages.push({
        file: file,
        originalSize: file.size,
        compressedSize: file.size,
        quality: 1,
      });
      console.log(`Using original file for ${file.name}`);
    }
  }
  
  console.log(`Batch compression completed. Results:`, compressedImages.map(c => ({
    name: c.file.name,
    originalSize: c.originalSize,
    compressedSize: c.compressedSize,
    reduction: ((c.originalSize - c.compressedSize) / c.originalSize * 100).toFixed(1) + '%'
  })));
  
  return compressedImages;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
} 