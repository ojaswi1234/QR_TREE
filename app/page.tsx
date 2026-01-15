"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { type Tree } from "@/types/tree";
import TreeQRCode from "@/components/TreeQRCode";
import { 
  TreeDeciduous, 
  QrCode, 
  Scan, 
  Lightbulb, 
  PenLine, 
  Leaf,
  History 
} from "lucide-react";

export default function Home() {
  const [treeCount, setTreeCount] = useState(0);
  const [recentTrees, setRecentTrees] = useState<Tree[]>([]);

  useEffect(() => {
    async function loadTrees() {
      try {
        const response = await fetch('/api/trees');
        const result = await response.json();
        if (result.success) {
          const allTrees = result.data;
          setTreeCount(allTrees.length);
          setRecentTrees(allTrees.slice(0, 3)); // API sorts by -1 (descending), so take top 3
        }
      } catch (error) {
        console.error("Failed to load trees:", error);
      }
    }
    loadTrees();
  }, []);

  return (
    <main className="min-h-screen bg-neutral-50 font-sans text-gray-900 overflow-x-hidden">
      <Navbar />

      <div className="max-w-2xl mx-auto p-6">
        <header className="mb-8 text-center bg-white p-8 rounded-3xl shadow-sm border border-neutral-100">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-4 rounded-2xl">
              <TreeDeciduous size={48} className="text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">QR Tree Database</h1>
          <p className="text-gray-500 text-lg mb-6">
            Track trees with QR codes • Works offline
          </p>
          <div className="inline-flex items-center gap-3 bg-neutral-50 px-6 py-3 rounded-xl border border-neutral-200">
            <span className="text-2xl font-bold text-green-600 leading-none">{treeCount}</span>
            <span className="text-sm font-medium text-gray-600">Trees Recorded</span>
          </div>
        </header>

        {/* How It Works */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
             <Leaf size={20} className="text-green-600" />
             How It Works
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="bg-green-50 p-2 rounded-lg text-green-600 mt-1">
                <PenLine size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">1. Add Trees</h3>
                <p className="text-gray-500 text-sm">Register tree details locally to the database.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
               <div className="bg-green-50 p-2 rounded-lg text-green-600 mt-1">
                <QrCode size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">2. Generate QR</h3>
                <p className="text-gray-500 text-sm">Get a unique QR code for each tree instantly.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
               <div className="bg-green-50 p-2 rounded-lg text-green-600 mt-1">
                <Scan size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">3. Scan & View</h3>
                <p className="text-gray-500 text-sm">Access tree info instantly, even without internet.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
          <div className="flex gap-3">
             <div className="text-amber-600 mt-0.5">
               <Lightbulb size={24} />
             </div>
            <div>
              <h3 className="font-bold text-amber-900 mb-1 text-sm uppercase tracking-wide">Local Storage</h3>
              <p className="text-amber-800 text-sm leading-relaxed">
                Trees are stored on this device. Ensure you have added the tree data here before scanning QR codes.
              </p>
            </div>
          </div>
        </div>

        {/* Recent Trees */}
        {recentTrees.length > 0 && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
               <History size={20} className="text-green-600" />
               Recently Added
            </h2>
            <div className="space-y-3">
              {recentTrees.map((tree) => (
                <div 
                  key={tree.tree_id}
                  className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl hover:bg-green-50 transition border border-neutral-100 group"
                >
                  <Link 
                    href={`/tree/${tree.tree_id}`}
                    className="flex-1"
                  >
                    <div className="font-bold text-gray-900 group-hover:text-green-800 transition">{tree.common_name}</div>
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">{tree.scientific_name}</div>
                  </Link>

                  <div className="ml-4">
                    <TreeQRCode treeId={tree.tree_id} treeName={tree.common_name} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center p-8">
           <Link 
             href="/pages/addTree"
             className="bg-green-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:bg-green-700 hover:shadow-green-200/50 transition flex items-center gap-2"
           >
             <PenLine size={20} />
             Add New Tree
           </Link>
        </div>
      </div>
    </main>
  );
}
