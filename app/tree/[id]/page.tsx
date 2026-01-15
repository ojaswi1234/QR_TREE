"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { type Tree } from "@/types/tree";
import Navbar from "@/components/Navbar";
import TreeCard from "@/components/TreeCard";
import Link from "next/link";
import { AlertTriangle, Lightbulb, Plus, TreeDeciduous } from "lucide-react";

export default function TreeDetailPage() {
  const { id } = useParams();
  const [tree, setTree] = useState<Tree | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTree() {
      if (!id) return;
      
      try {
        setLoading(true);
        const treeId = typeof id === "string" ? parseInt(id) : parseInt(id[0]);
        
        console.log("[View Tree] Fetching tree with ID:", treeId);
        
        if (!navigator.onLine) {
            setError(`Tree #${treeId} not available offline.`);
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`/api/trees/${treeId}`);
            const result = await response.json();
            
            if (result.success && result.data) {
              console.log("[View Tree] ✅ Found in MongoDB:", result.data.common_name);
              setTree(result.data);
            } else {
              console.error("[View Tree] ❌ Tree not found in MongoDB");
              setError(`Tree #${treeId} not found.`);
            }
        } catch (fetchErr) {
            console.error("[View Tree] ❌ MongoDB fetch error:", fetchErr);
            setError(`Could not load tree from server. Check your connection.`);
        }
      } catch (err) {
        console.error("Error fetching tree:", err);
        setError("Failed to load tree details.");
      } finally {
        setLoading(false);
      }
    }

    fetchTree();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-green-100 flex items-center justify-center">
        <div className="text-green-800 text-xl font-bold animate-pulse">
          Loading tree details...
        </div>
      </main>
    );
  }

  if (error || !tree) {
    return (
      <main className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-red-100 text-center max-w-md">
          <div className="flex justify-center mb-4 text-red-500">
             <AlertTriangle size={48} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h1>
          <p className="text-gray-600 mb-4">{error || "Tree not found"}</p>
          
          <div className="flex gap-3 justify-center">
            <Link 
              href="/pages/addTree"
              className="inline-block bg-green-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-green-700 transition"
            >
              Add Tree
            </Link>
            <Link 
              href="/"
              className="inline-block bg-gray-100 text-gray-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-200 transition"
            >
              Go Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 font-sans text-gray-900 pb-12">
     
      <header className="bg-white/80 backdrop-blur-md w-full h-16 flex flex-row gap-2 items-center justify-center px-6 border-b border-neutral-200 sticky top-0 z-50">
      
       
          <div className="bg-green-100 p-2 rounded-lg group-hover:bg-green-200 transition">
             <TreeDeciduous size={20} className="text-green-700" />
          </div>
          <h1 className="text-lg font-bold text-gray-800 tracking-tight">QR Tree</h1>
        
        
      
    </header>
      <div className="max-w-2xl mx-auto p-6">
        <header className="mb-8">
          
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Tree Details</h1>
          <p className="text-gray-500 mt-1">
            Botanical information
          </p>
        </header>

        <TreeCard tree={tree} />
      </div>
    </main>
  );
}
