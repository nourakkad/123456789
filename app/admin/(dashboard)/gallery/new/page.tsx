"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createGalleryImage } from "@/lib/actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { compressMultipleImages, compressImage, formatFileSize, type CompressedImage } from "@/lib/imageCompression"
import TestCompression from "./test-compression"

export default function NewGalleryImagePage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [categoryInput, setCategoryInput] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [compressedFiles, setCompressedFiles] = useState<CompressedImage[]>([]);
  const [uploadStatus, setUploadStatus] = useState<{ [key: string]: number }>({});
  const [compressionStatus, setCompressionStatus] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    // Fetch all gallery images and extract unique categories
    fetch("/api/gallery/categories")
      .then(response => response.json())
      .then(data => {
        setCategories(data.categories || []);
      })
  }, [])

  function uploadWithProgress(formData: FormData, onProgress: (percent: number) => void) {
    return new Promise<any>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/images/upload");
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error("Upload failed"));
        }
      };
      xhr.onerror = () => reject(new Error("Upload failed"));
      xhr.send(formData);
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one image file.",
        variant: "destructive",
      })
      return
    }
    if (!categoryInput.trim()) {
      toast({
        title: "Category required",
        description: "Please select or enter a category.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    setUploadStatus({})
    
    try {
      let successCount = 0
      let errorCount = 0

      // Use compressed files if available, otherwise use original files
      const filesToUpload = compressedFiles.length > 0 ? compressedFiles.map(c => c.file) : selectedFiles

      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i]
        const fileName = selectedFiles[i].name // Use original filename for display
        
        try {
          // Update progress for this file
          setUploadStatus(prev => ({ ...prev, [fileName]: 0 }))
          
          // Upload the image file
          const uploadForm = new FormData()
          uploadForm.append("file", file)
          const uploadData = await uploadWithProgress(uploadForm, (progress) => {
            setUploadStatus(prev => ({ ...prev, [fileName]: progress }))
          });
          
          if (uploadData.id) {
            // Create gallery image
            const imageFormData = new FormData()
            imageFormData.append("category", categoryInput)
            imageFormData.append("url", uploadData.id)
            if (uploadData.thumbId) {
              imageFormData.append("thumbUrl", uploadData.thumbId)
            }
            
            await createGalleryImage(imageFormData)
            successCount++
          }
        } catch (error) {
          console.error(`Error uploading ${fileName}:`, error)
          errorCount++
        }
      }

      if (successCount > 0) {
        toast({
          title: "Images uploaded",
          description: `Successfully uploaded ${successCount} image${successCount > 1 ? 's' : ''}${errorCount > 0 ? ` (${errorCount} failed)` : ''}.`,
        })
        router.push("/admin/gallery")
      } else {
        toast({
          title: "Upload failed",
          description: "All images failed to upload. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "The images couldn't be uploaded. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setUploadStatus({})
      setSelectedFiles([])
      setCompressedFiles([])
      setCompressionStatus({})
    }
  }

  // Add a helper to check if upload is in progress
  const isUploading = Object.values(uploadStatus).some(progress => progress > 0 && progress < 100);
  const isCompressing = Object.keys(compressionStatus).length > 0 && Object.values(compressionStatus).some(progress => progress < 100);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    console.log('Selected files:', files.map(f => ({ name: f.name, size: f.size })));
    
    if (files.length === 0) return;
    
    // Set files immediately
    setSelectedFiles(files);
    
    // Initialize compression status for each file
    const initialStatus: { [key: string]: number } = {};
    files.forEach(file => {
      initialStatus[file.name] = 0;
    });
    setCompressionStatus(initialStatus);
    
    try {
      console.log('Starting compression for', files.length, 'files...');
      
      // Compress each file individually with progress updates
      const compressedResults: CompressedImage[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`Compressing file ${i + 1}/${files.length}: ${file.name}`);
        
        // Update progress for this file
        setCompressionStatus(prev => ({ ...prev, [file.name]: 25 }));
        
        try {
          const compressed = await compressImage(file, 500); // 500KB max
          compressedResults.push(compressed);
          
          // Update progress to complete
          setCompressionStatus(prev => ({ ...prev, [file.name]: 100 }));
          
          console.log(`Successfully compressed ${file.name}:`, {
            originalSize: compressed.originalSize,
            compressedSize: compressed.compressedSize,
            reduction: ((compressed.originalSize - compressed.compressedSize) / compressed.originalSize * 100).toFixed(1) + '%'
          });
          
        } catch (error) {
          console.error(`Failed to compress ${file.name}:`, error);
          // Use original file if compression fails
          compressedResults.push({
            file: file,
            originalSize: file.size,
            compressedSize: file.size,
            quality: 1,
          });
          setCompressionStatus(prev => ({ ...prev, [file.name]: 100 }));
        }
      }
      
      console.log('All compression completed. Results:', compressedResults.map(c => ({
        name: c.file.name,
        originalSize: c.originalSize,
        compressedSize: c.compressedSize,
        reduction: ((c.originalSize - c.compressedSize) / c.originalSize * 100).toFixed(1) + '%'
      })));
      
      setCompressedFiles(compressedResults);
      
    } catch (error) {
      console.error('Compression error:', error);
      toast({
        title: "Compression failed",
        description: "Some images couldn't be compressed. Original files will be used.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Add Gallery Images</h1>
      </div>

      {/* Temporary test component for debugging */}
      <TestCompression />

      <Card>
        <CardHeader>
          <CardTitle>Image Information</CardTitle>
          <CardDescription>Upload multiple images to the same category</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <div className="flex gap-2 flex-wrap">
                <select
                  id="category"
                  name="category"
                  className="border rounded px-2 py-1"
                  value={categoryInput}
                  onChange={e => setCategoryInput(e.target.value)}
                >
                  <option value="">-- Select category --</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <Input
                  id="category_new"
                  name="category_new"
                  placeholder="Or enter new category"
                  value={categoryInput}
                  onChange={e => setCategoryInput(e.target.value)}
                  className="w-48"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="images">Image Files</Label>
              <Input 
                id="images" 
                name="images" 
                type="file" 
                accept="image/*" 
                multiple 
                onChange={handleFileSelect}
                required 
              />
              <p className="text-sm text-muted-foreground">Select one or more image files (JPG, PNG, etc.) - Images will be automatically compressed to under 500KB</p>
              
              {isCompressing && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2 text-blue-600 text-sm">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    <span>Compressing images...</span>
                  </div>
                  {Object.entries(compressionStatus).map(([fileName, progress]) => (
                    <div key={fileName} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="truncate">{fileName}</span>
                        <span className="text-blue-600">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded h-1">
                        <div 
                          className="bg-blue-500 h-1 rounded transition-all duration-300" 
                          style={{ width: `${progress}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {selectedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Selected files ({selectedFiles.length}):</p>
                    <div className="flex items-center gap-2">
                      {compressedFiles.length > 0 && !isCompressing && (
                        <span className="text-xs text-green-600 flex items-center gap-1">
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Compressed
                        </span>
                      )}
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedFiles([]);
                          setCompressedFiles([]);
                          setCompressionStatus({});
                        }}
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedFiles.map((file, index) => {
                      const compressed = compressedFiles[index];
                      const originalSize = formatFileSize(file.size);
                      const compressedSize = compressed ? formatFileSize(compressed.compressedSize) : originalSize;
                      const sizeReduction = compressed ? ((file.size - compressed.compressedSize) / file.size * 100).toFixed(1) : '0';
                      
                      return (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex-1 min-w-0">
                            <span className="text-sm truncate block">{file.name}</span>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>Original: {originalSize}</span>
                              {compressed && compressed.compressedSize < file.size && (
                                <>
                                  <span>→</span>
                                  <span className="text-green-600">Compressed: {compressedSize}</span>
                                  <span className="text-green-600">(-{sizeReduction}%)</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedFiles(prev => prev.filter((_, i) => i !== index));
                                setCompressedFiles(prev => prev.filter((_, i) => i !== index));
                              }}
                            >
                              ×
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Upload progress for each file */}
              {Object.keys(uploadStatus).length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">Upload Progress:</p>
                  {Object.entries(uploadStatus).map(([fileName, progress]) => (
                    <div key={fileName} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="truncate">{fileName}</span>
                        <span className="text-blue-600">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded transition-all duration-300" 
                          style={{ width: `${progress}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting || isUploading || isCompressing}>
                {isSubmitting ? "Uploading..." : isCompressing ? "Compressing..." : `Upload ${selectedFiles.length > 0 ? selectedFiles.length : ''} Image${selectedFiles.length !== 1 ? 's' : ''}`}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/admin/gallery")}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
