"use client";

import { useState } from "react";

export default function Page() {
  const [formData, setFormData] = useState({
    commonName: "",
    scientificName: "",
    age: "",
    description: "",
    benefits: [],
    images: [],
    healthStatus: "Healthy",
    planted_on: Date(),
    planted_by: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="min-h-screen bg-green-100 font-sans text-gray-900 pb-12">
      <div className="max-w-xl mx-auto p-6">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-green-900">Add New Tree</h1>
          <p className="text-green-700 opacity-80">
            Register a new sapling or tree to the database.
          </p>
        </header>

        <form className="bg-white rounded-3xl p-8 shadow-xl border border-green-200 space-y-6">
          {/* Common Name */}
          <div>
            <label className="block text-xs font-bold text-green-600 uppercase tracking-widest mb-2">
              Common Name
            </label>
            <input
              type="text"
              name="commonName"
              placeholder="e.g. Banyan, Neem, Peepal"
              className="w-full bg-green-50 border border-green-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
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
              name="scientificName"
              placeholder="e.g. Ficus benghalensis"
              className="w-full bg-green-50 border border-green-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all italic"
              onChange={handleChange}
            />
          </div>

          {/* Grid for Age and Health */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-green-600 uppercase tracking-widest mb-2">
                Age (Years)
              </label>
              <input
                type="number"
                name="age"
                placeholder="10"
                className="w-full bg-green-50 border border-green-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-green-600 uppercase tracking-widest mb-2">
                Health Status
              </label>
              <select
                name="healthStatus"
                className="w-full bg-green-50 border border-green-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
                onChange={handleChange}
              >
                <option>Healthy</option>
                <option>Excellent</option>
                <option>Requires Care</option>
                <option>Sick</option>
              </select>
            </div>
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

          {/* Photo Upload Placeholder */}
          <div className="border-2 border-dashed border-green-200 rounded-2xl p-8 text-center bg-green-50 hover:bg-green-100 transition-colors cursor-pointer">
            <div className="text-3xl mb-2">📸</div>
            <p className="text-xs font-bold text-green-700 uppercase">
              Upload Images
            </p>
            <p className="text-[10px] text-green-600 opacity-60">
              PNG, JPG up to 10MB
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-green-600 uppercase tracking-widest mb-2">
              Planted by
            </label>
            <input
              type="text"
              name="plantedby"
              className="w-full bg-green-50 border border-green-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all italic"
              onChange={handleChange}
            />
          </div>

          {/* Submit Button */}
          <button
            type="button"
            className="w-full bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-200 hover:bg-green-700 active:scale-[0.98] transition-all"
          >
            Save Tree Details
          </button>
        </form>
      </div>
    </main>
  );
}
