"use client";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getTrees } from "@/utils/db";

export default function Home() {
  const [trees, setTrees] = useState<any[]>([]);

  useEffect(() => {
    // Load data from IndexedDB
    getTrees().then((data) => {
      setTrees(data);
    });
  }, []);

  return (
    <main className="min-h-screen bg-green-100 font-sans text-gray-900 overflow-x-hidden">
      <Navbar />

      <div className="max-w-2xl mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-green-900">Namaste</h1>
          <p className="text-green-700 opacity-80">
            Explore the nature around you.
          </p>
        </header>

        <div className="space-y-6">
          {trees.map((tree) => (
            <div
              key={tree.id}
              className="relative bg-white rounded-2xl p-6 shadow-md border border-green-200 transition-all hover:shadow-lg"
            >
              {/* Common Name */}
              <div className="border-b border-green-50 pb-4 mb-4">
                <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">
                  Common Name
                </p>
                <h2 className="text-xl font-extrabold text-green-900">
                  {tree.common_name}
                </h2>
              </div>

              {/* Absolute Image - Fixed positioning relative to card */}
              <div className="absolute top-6 right-6 w-20 h-20">
                <Image
                  src="/images/banyan.png" // You can later update this to tree.image_url
                  width={80}
                  height={80}
                  alt="tree icon"
                  className="object-contain"
                />
              </div>

              <div className="space-y-6 mt-4">
                {/* Scientific Name */}
                <div>
                  <h3 className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">
                    Scientific Name
                  </h3>
                  <p className="text-lg italic text-gray-700 font-medium">
                    {tree.scientific_name}
                  </p>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {tree.description}
                  </p>
                </div>

                {/* Benefits Array */}
                <div>
                  <h3 className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">
                    It&apos;s benefits include
                  </h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {tree.benefits?.map((benefit: string, index: number) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>

                {/* Stats Section */}
                <div className="flex gap-8 pt-4 border-t border-green-50">
                  <div>
                    <h3 className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">
                      Age
                    </h3>
                    <p className="text-sm font-bold">{tree.age} years</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">
                      Health Status
                    </h3>
                    <p className="text-sm font-bold text-green-700">
                      {tree.health_status}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
