"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { type Tree } from "@/types/tree";
import Navbar from "@/components/Navbar";
import TreeCard from "@/components/TreeCard";
import Link from "next/link";
import { AlertTriangle, Lightbulb } from "lucide-react";

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
          <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 mb-6 flex items-start text-left gap-2">
            <Lightbulb size={16} className="text-amber-500 mt-1 shrink-0" />
            <p className="text-xs text-amber-800">
              Trees are stored locally on each device. Connect to internet to fetch from cloud.
            </p>
          </div>
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
      <Navbar />
      
      <div className="max-w-2xl mx-auto p-6">
        <header className="mb-8">
          <Link href="/" className="inline-block text-sm font-semibold text-gray-500 hover:text-gray-900 mb-4 transition">
             ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Tree Details</h1>
          <p className="text-gray-500 mt-1">
            Botanical information and stats.
          </p>
        </header>

        <TreeCard tree={tree} />
      </div>
    </main>
  );
}
