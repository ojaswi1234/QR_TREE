"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db, type Tree } from "@/utils/db";
import Navbar from "@/components/Navbar";
import TreeCard from "@/components/TreeCard";
import Link from "next/link";

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
        
        console.log("Looking for tree with ID:", treeId);
        
        // Check if database is accessible
        const allTrees = await db.trees.toArray();
        console.log("Total trees in database:", allTrees.length);
        console.log("All tree IDs:", allTrees.map(t => t.tree_id));
        
        const foundTree = await db.trees.get(treeId);

        if (foundTree) {
          console.log("Tree found:", foundTree);
          setTree(foundTree);
        } else {
          console.error("Tree not found. ID:", treeId);
          setError(`Tree not found. You may need to add trees first. (ID: ${treeId})`);
        }
      } catch (err) {
        console.error("Error fetching tree:", err);
        setError("Failed to load tree details. Make sure you've added trees to the database first.");
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
      <main className="min-h-screen bg-green-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Oops!</h1>
          <p className="text-gray-600 mb-4">{error || "Tree not found"}</p>
          <p className="text-sm text-gray-500 mb-6">
            💡 Tip: Trees are stored locally on each device. Add trees on this device first.
          </p>
          <div className="flex gap-3 justify-center">
            <Link 
              href="/pages/addTree"
              className="inline-block bg-green-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-green-700 transition"
            >
              Add Tree
            </Link>
            <Link 
              href="/"
              className="inline-block bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-300 transition"
            >
              Go Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-green-100 font-sans text-gray-900 pb-12">
      <Navbar />
      
      <div className="max-w-2xl mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-green-900">Tree Details</h1>
          <p className="text-green-700 opacity-80">
            Information about this specific tree.
          </p>
        </header>

        <TreeCard tree={tree} />
      </div>
    </main>
  );
}
