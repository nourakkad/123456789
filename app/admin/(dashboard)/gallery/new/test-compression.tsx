"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { compressImage, formatFileSize } from "@/lib/imageCompression"

export default function TestCompression() {
  const [testResult, setTestResult] = useState<string>('')

  const testCompression = async () => {
    try {
      // Create a test canvas with a simple image
      const canvas = document.createElement('canvas')
      canvas.width = 2000
      canvas.height = 1500
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        setTestResult('Failed to get canvas context')
        return
      }

      // Create a gradient as a test image
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, 'red')
      gradient.addColorStop(0.5, 'green')
      gradient.addColorStop(1, 'blue')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob)
          else throw new Error('Failed to create blob')
        }, 'image/jpeg', 0.9)
      })

      // Create a file from the blob
      const testFile = new File([blob], 'test-image.jpg', { type: 'image/jpeg' })
      
      console.log('Test file created:', {
        name: testFile.name,
        size: testFile.size,
        sizeKB: testFile.size / 1024
      })

      // Test compression
      const compressed = await compressImage(testFile, 500)
      
      const result = `
Test completed successfully!
Original size: ${formatFileSize(testFile.size)}
Compressed size: ${formatFileSize(compressed.compressedSize)}
Reduction: ${((testFile.size - compressed.compressedSize) / testFile.size * 100).toFixed(1)}%
Quality: ${(compressed.quality * 100).toFixed(0)}%
      `
      
      setTestResult(result)
      console.log('Compression test result:', result)
      
    } catch (error) {
      const errorMsg = `Test failed: ${error}`
      setTestResult(errorMsg)
      console.error('Compression test error:', error)
    }
  }

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-bold mb-4">Test Image Compression</h3>
      <Button onClick={testCompression} className="mb-4">
        Run Compression Test
      </Button>
      {testResult && (
        <pre className="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap">
          {testResult}
        </pre>
      )}
    </div>
  )
} 