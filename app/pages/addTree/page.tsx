"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Camera, X } from "lucide-react";
import Link from "next/link";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

export default function Page() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    common_name: "",
    scientific_name: "",
    description: "",
    benefits: [] as string[],
    images: [] as string[],
    health_status: "Healthy",
    planted_date: new Date().toISOString().split("T")[0],
    planted_by: "",
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = (e) => {
        const img = document.createElement("img");
        img.src = e.target?.result as string;

        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 800;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                  height *= MAX_WIDTH / width;
                  width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                  width *= MAX_HEIGHT / height;
                  height = MAX_HEIGHT;
              }
            }

            canvas.width = width;
            canvas.height = height;

            ctx?.drawImage(img, 0, 0, width, height);
            
            const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);

            setFormData((prev) => ({
                ...prev,
                images: [...prev.images, compressedBase64],
            }));
        };
      }
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
      onDrop, 
      accept: {
          'image/*': ['.jpeg', '.png', '.jpg']
      },
      maxFiles: 3, 
      maxSize: 10485760 // 10MB
  });

  const removeImage = (index: number) => {
      setFormData((prev) => ({
          ...prev,
          images: prev.images.filter((_, i) => i !== index),
      }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const treeData = {
        ...formData,
      };

      console.log('[Add Tree] Starting to add tree:', treeData.common_name);

      let treeId: number;

      // Check if online (required now)
      if (!navigator.onLine) {
        alert("You must be online to add a tree.");
        return;
      }

      try {
        console.log('[Add Tree] 🌐 Online - Saving to MongoDB...');
        
        const response = await fetch('/api/trees', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(treeData),
        });

        const result = await response.json();
        
        if (result.success && result.data) {
          treeId = result.data.tree_id;
          console.log('[Add Tree] ✅ Saved to MongoDB with ID:', treeId);
        } else {
          throw new Error('MongoDB save failed: ' + result.error);
        }
      } catch (err) {
        console.error('[Add Tree] ❌ MongoDB error:', err);
        alert('Failed to connect to server. Please check your connection and try again.');
        return;
      }

      router.push(`/treeAdded?tree_id=${treeId}`);
    } catch (error) {
      console.error("[Add Tree] ❌ Failed to add tree:", error);
      alert("Failed to add tree. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50 font-sans text-gray-900 pb-12">
      <div className="max-w-xl mx-auto p-6">
        {/* Header */}
        <header className="mb-8">
          <Link href="/" className="inline-block text-sm font-semibold text-gray-500 hover:text-gray-900 mb-4 transition">
             ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Add New Tree</h1>
          <p className="text-gray-500 mt-2 text-lg">
            Register a new sapling or tree to the database.
          </p>
        </header>

        <form className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-200 space-y-6" onSubmit={handleSubmit}>
          {/* Common Name */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
              Common Name
            </label>
            <input
              type="text"
              name="common_name"
              placeholder="e.g. Banyan, Neem, Peepal"
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all placeholder-gray-400"
              onChange={handleChange}
            />
          </div>

          {/* Scientific Name */}
          <div>
            <label className="block text-xs font-bold text-green-600 uppercase tracking-widest mb-2">
              Scientific Name
            </label>
            <input
              type="text"
              name="scientific_name"
              placeholder="e.g. Ficus benghalensis"
              className="w-full bg-green-50 border border-green-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all italic"
              onChange={handleChange}
            />
          </div>

          {/* Health Status */}
          <div>
            <label className="block text-xs font-bold text-green-600 uppercase tracking-widest mb-2">
              Health Status
            </label>
            <select
              title="Health Status"
              name="health_status"
              className="w-full bg-green-50 border border-green-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
              onChange={handleChange}
            >
              <option>Healthy</option>
              <option>Excellent</option>
              <option>Requires Care</option>
              <option>Sick</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-green-600 uppercase tracking-widest mb-2">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              placeholder="Tell us about the tree's history or location..."
              className="w-full bg-green-50 border border-green-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={handleChange}
            ></textarea>
          </div>
          <div>
            <label className="block text-xs font-bold text-green-600 uppercase tracking-widest mb-2">
              Benefits
            </label>
            <textarea
              name="benefits"
              rows={3}
              placeholder="e.g. Provides shade, attracts birds..."
              className="w-full bg-green-50 border border-green-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  benefits: e.target.value.split(",").map((b) => b.trim()),
                })
              }
            ></textarea>
          </div>


          {/* Photo Upload with Dropzone */}
          <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Tree Images (Max 3)
              </label>
              <div 
                  {...getRootProps()} 
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer group ${
                      isDragActive ? 'border-green-500 bg-green-50' : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100 hover:border-green-300'
                  }`}
              >
                <input {...getInputProps()} />
                <div className="flex justify-center mb-3">
                  <Camera size={32} className={`transition-opacity ${isDragActive ? 'text-green-600 opacity-100' : 'text-gray-400 opacity-80 group-hover:opacity-100'}`} />
                </div>
                {isDragActive ? (
                  <p className="text-xs font-bold text-green-700 uppercase">Drop images here...</p>
                ) : (
                  <>
                    <p className="text-xs font-bold text-gray-700 uppercase">
                      Drag & drop or Click to Upload
                    </p>
                    <p className="text-[10px] text-gray-500 opacity-60">
                      PNG, JPG up to 10MB
                    </p>
                  </>
                )}
              </div>

              {/* Image Previews */}
              {formData.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                      {formData.images.map((img, index) => (
                          <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-neutral-200">
                              <Image 
                                  src={img} 
                                  alt={`Preview ${index}`} 
                                  fill 
                                  className="object-cover" 
                              />
                              <button
                              title="Remove Image"
                                  type="button"
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      removeImage(index);
                                  }}
                                  className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-500 hover:bg-white transition"
                              >
                                  <X size={14} />
                              </button>
                          </div>
                      ))}
                  </div>
              )}
          </div>

          <div>
            <label className="block text-xs font-bold text-green-600 uppercase tracking-widest mb-2">
              Planted Date
            </label>
            <input
              title="Planted Date"
              type="date"
              name="planted_date"
              className="w-full bg-green-50 border border-green-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all italic"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-green-600 uppercase tracking-widest mb-2">
              Planted by
            </label>
            <input
              title="Planted by"
              type="text"
              name="planted_by"
              className="w-full bg-green-50 border border-green-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all italic"
              onChange={handleChange}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-green-700 active:scale-[0.98] transition-all"
          >
            Save Tree Details
          </button>
        </form>
      </div>
    </main>
  );
}
