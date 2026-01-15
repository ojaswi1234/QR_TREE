"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { db, type Tree } from "@/utils/db";
import TreeQRCode from "@/components/TreeQRCode";

export default function Home() {
  const [treeCount, setTreeCount] = useState(0);
  const [recentTrees, setRecentTrees] = useState<Tree[]>([]);

  useEffect(() => {
    async function loadTrees() {
      const allTrees = await db.trees.toArray();
      setTreeCount(allTrees.length);
      setRecentTrees(allTrees.slice(-3).reverse());
    }
    loadTrees();
  }, []);

  return (
    <main className="min-h-screen bg-green-100 font-sans text-gray-900 overflow-x-hidden">
      <Navbar />

      <div className="max-w-2xl mx-auto p-6">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-green-900 mb-2">🌳 QR Tree Database</h1>
          <p className="text-green-700 text-lg">
            Track trees with QR codes - Works offline!
          </p>
          <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-green-200 mt-6 inline-block">
            <div className="text-3xl font-bold text-green-600">{treeCount}</div>
            <div className="text-sm text-gray-600">Trees on This Device</div>
          </div>
        </header>

        {/* How It Works */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-green-200 mb-6">
          <h2 className="text-xl font-bold text-green-900 mb-4">How It Works</h2>
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <div className="text-2xl">1️⃣</div>
              <div>
                <h3 className="font-bold text-green-800">Add Trees</h3>
                <p className="text-gray-600">Register tree details locally</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-2xl">2️⃣</div>
              <div>
                <h3 className="font-bold text-green-800">Generate QR</h3>
                <p className="text-gray-600">Get unique QR code for each tree</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-2xl">3️⃣</div>
              <div>
                <h3 className="font-bold text-green-800">Scan & View</h3>
                <p className="text-gray-600">Access info instantly, even offline!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-4 mb-6">
          <div className="flex gap-2">
            <div className="text-xl">💡</div>
            <div className="text-sm">
              <h3 className="font-bold text-yellow-800 mb-1">Local Storage</h3>
              <p className="text-yellow-700">
                Trees are stored on each device. Add tree data here before scanning QR codes!
              </p>
            </div>
          </div>
        </div>

        {/* Recent Trees */}
        {recentTrees.length > 0 && (
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-green-200 mb-6">
            <h2 className="text-xl font-bold text-green-900 mb-4">Recently Added</h2>
            <div className="space-y-2">
              {recentTrees.map((tree) => (
                <div 
                  key={tree.tree_id}
                  className="flex items-center justify-between p-3 bg-green-50 rounded-xl hover:bg-green-100 transition border border-green-200"
                >
                  <Link 
                    href={`/tree/${tree.tree_id}`}
                    className="flex-1"
                  >
                    <div className="font-bold text-green-900">{tree.common_name}</div>
                    <div className="text-sm italic text-gray-600">{tree.scientific_name}</div>
                  </Link>

                  <div className="ml-4">
                    <TreeQRCode treeId={tree.tree_id} treeName={tree.common_name} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center p-8 bg-white rounded-3xl shadow-xl border border-green-200">
           <Link 
             href="/pages/addTree"
             className="bg-green-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-green-700 transition"
           >
             ➕ Add New Tree
           </Link>
        </div>
      </div>
    </main>
  );
}
