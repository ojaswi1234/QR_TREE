/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { db, type Tree } from "./db";

// Check if online
export const isOnline = () => {
  return typeof window !== 'undefined' && navigator.onLine;
};

// Fetch tree from MongoDB
async function fetchTreeFromMongoDB(treeId: number): Promise<Tree | null> {
  try {
    const response = await fetch(`/api/trees/${treeId}`);
    if (!response.ok) return null;
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error('Error fetching from MongoDB:', error);
    return null;
  }
}

// Save tree to MongoDB
async function saveTreeToMongoDB(tree: Partial<Tree>): Promise<boolean> {
  try {
    const response = await fetch('/api/trees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tree),
    });
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error saving to MongoDB:', error);
    return false;
  }
}

// Update tree in MongoDB
async function updateTreeInMongoDB(treeId: number, data: Partial<Tree>): Promise<boolean> {
  try {
    const response = await fetch(`/api/trees/${treeId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Error updating MongoDB:', error);
    return false;
  }
}

// Get tree with auto-sync
export async function getTreeWithSync(treeId: number): Promise<Tree | null> {
  console.log(`[Sync] Looking for tree ${treeId}`);
  
  // 1. Try IndexedDB first (works offline)
  const tree = await db.trees.get(treeId);
  
  if (tree) {
    console.log(`[Sync] Found in IndexedDB:`, tree.common_name);
    
    // 2. If online, update MongoDB in background
    if (isOnline()) {
      updateTreeInMongoDB(treeId, tree).then(success => {
        console.log(`[Sync] Background sync to MongoDB: ${success ? 'Success' : 'Failed'}`);
      });
    }
    
    return tree;
  }
  
  // 3. Not in IndexedDB, try MongoDB if online
  if (isOnline()) {
    console.log(`[Sync] Not in IndexedDB, checking MongoDB...`);
    const mongoTree = await fetchTreeFromMongoDB(treeId);
    
    if (mongoTree) {
      console.log(`[Sync] Found in MongoDB, saving to IndexedDB:`, mongoTree.common_name);
      
      // Save to IndexedDB for offline access
      await db.trees.put(mongoTree);
      return mongoTree;
    }
  }
  
  console.log(`[Sync] Tree ${treeId} not found anywhere`);
  return null;
}

// Add tree with auto-sync
export async function addTreeWithSync(treeData: Omit<Tree, 'tree_id'>): Promise<number | null> {
  console.log(`[Sync] Adding tree:`, treeData.common_name);
  
  // 1. Always save to IndexedDB first (works offline)
  const localId = await db.trees.add(treeData as any);
  console.log(`[Sync] Saved to IndexedDB with ID:`, localId);
  
  // 2. If online, also save to MongoDB
  if (isOnline()) {
    const fullTree = await db.trees.get(localId);
    if (fullTree) {
      const success = await saveTreeToMongoDB(fullTree);
      console.log(`[Sync] Saved to MongoDB: ${success ? 'Success' : 'Failed'}`);
      
      if (!success) {
        console.log(`[Sync] Will retry sync later when online`);
      }
    }
  } else {
    console.log(`[Sync] Offline - will sync to MongoDB when online`);
  }
  
  return localId;
}

// Update tree with auto-sync
export async function updateTreeWithSync(treeId: number, data: Partial<Tree>): Promise<boolean> {
  console.log(`[Sync] Updating tree ${treeId}`);
  
  // 1. Update IndexedDB
  await db.trees.update(treeId, data);
  console.log(`[Sync] Updated in IndexedDB`);
  
  // 2. If online, update MongoDB
  if (isOnline()) {
    const success = await updateTreeInMongoDB(treeId, data);
    console.log(`[Sync] Updated MongoDB: ${success ? 'Success' : 'Failed'}`);
    return success;
  } else {
    console.log(`[Sync] Offline - will sync to MongoDB when online`);
    return true;
  }
}

// Sync all local trees to MongoDB (call when coming back online)
export async function syncAllToMongoDB(): Promise<void> {
  if (!isOnline()) {
    console.log(`[Sync] Offline - skipping sync`);
    return;
  }
  
  console.log(`[Sync] Starting full sync to MongoDB...`);
  const allTrees = await db.trees.toArray();
  
  for (const tree of allTrees) {
    await updateTreeInMongoDB(tree.tree_id, tree);
  }
  
  console.log(`[Sync] Full sync completed - ${allTrees.length} trees`);
}

// Setup online/offline listeners
export function setupSyncListeners(): void {
  if (typeof window === 'undefined') return;
  
  window.addEventListener('online', () => {
    console.log(`[Sync] Back online - starting sync...`);
    syncAllToMongoDB();
  });
  
  window.addEventListener('offline', () => {
    console.log(`[Sync] Gone offline - using local data only`);
  });
}
