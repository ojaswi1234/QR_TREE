"use client";

import { db } from "@/utils/db";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    common_name: "",
    scientific_name: "",
    age: "",
    description: "",
    benefits: [] as string[],
    images: [] as string[],
    health_status: "Healthy",
    planted_date: new Date().toISOString().split("T")[0],
    planted_by: "",
  });

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
      // Check for duplicate trees by common_name or scientific_name
      const existingTrees = await db.trees
        .filter(
          (tree) =>
            tree.common_name.toLowerCase() === formData.common_name.toLowerCase() ||
            tree.scientific_name.toLowerCase() === formData.scientific_name.toLowerCase()
        )
        .toArray();

      if (existingTrees.length > 0) {
        alert(
          `A tree with this name already exists:\n${existingTrees[0].common_name} (${existingTrees[0].scientific_name})`
        );
        return;
      }

      const treeId = await db.trees.add({
        ...formData,
        age: parseInt(formData.age) || 0,
      });
      router.push(`/treeAdded?tree_id=${treeId}`);
    } catch (error) {
      console.error("Failed to add tree:", error);
      alert("Failed to add tree. Please try again.");
    }
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

        <form className="bg-white rounded-3xl p-8 shadow-xl border border-green-200 space-y-6" onSubmit={handleSubmit}>
          {/* Common Name */}
          <div>
            <label className="block text-xs font-bold text-green-600 uppercase tracking-widest mb-2">
              Common Name
            </label>
            <input
              type="text"
              name="common_name"
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
              name="scientific_name"
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
            className="w-full bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-200 hover:bg-green-700 active:scale-[0.98] transition-all"
          >
            Save Tree Details
          </button>
        </form>
      </div>
    </main>
  );
}
