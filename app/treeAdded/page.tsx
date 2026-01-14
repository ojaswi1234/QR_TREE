"use client";

import React, { useEffect, useState, Suspense } from "react";
import { db } from "@/utils/db";
import QRCode from "qrcode";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

function TreeAddedContent() {
  const searchParams = useSearchParams();
  const tree_id_param = searchParams.get("tree_id");
  const tree_id = tree_id_param ? parseInt(tree_id_param) : NaN;

  const [qrData, setQrData] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (isNaN(tree_id)) {
      setError("Invalid Tree ID provided.");
      setLoading(false);
      return;
    }

    const generateQR = async () => {
      try {
        setLoading(true);
        
        // Get tree from IndexedDB
        const tree = await db.trees.get(tree_id);
        if (!tree) {
          setError("Tree not found in local database");
          return;
        }

        const origin = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
        const qrUrl = `${origin}/tree/${tree_id}`;
        
        const qrDataUrl = await QRCode.toDataURL(qrUrl);

        console.log('[QR Code] Generated for tree ID:', tree_id);

        // Update IndexedDB
        await db.trees.update(tree_id, {
          qr_code: qrDataUrl,
        });
        console.log('[QR Code] ✅ Updated IndexedDB');

        // Sync to MongoDB if online (tree should already exist there from add step)
        if (navigator.onLine) {
          try {
            const response = await fetch(`/api/trees/${tree_id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ qr_code: qrDataUrl }),
            });

            const result = await response.json();
            if (result.success) {
              console.log('[QR Code] ✅ Synced to MongoDB');
            } else {
              console.log('[QR Code] ⚠️ MongoDB update failed:', result.error);
              // Try to create the tree in MongoDB if it doesn't exist
              if (result.error === 'Tree not found') {
                console.log('[QR Code] 🔄 Tree not in MongoDB, creating...');
                const createResponse = await fetch('/api/trees', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(tree),
                });
                const createResult = await createResponse.json();
                if (createResult.success) {
                  console.log('[QR Code] ✅ Tree created in MongoDB');
                  // Update with QR code
                  await fetch(`/api/trees/${tree_id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ qr_code: qrDataUrl }),
                  });
                }
              }
            }
          } catch (err) {
            console.log('[QR Code] ⚠️ MongoDB sync failed (will retry later):', err);
          }
        } else {
          console.log('[QR Code] ⏳ Offline - MongoDB sync pending');
        }

        setQrData(qrDataUrl);
      } catch (err) {
        console.error("[QR Code] ❌ Failed to generate QR code:", err);
        setError("Failed to generate QR code. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    generateQR();
  }, [tree_id]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = qrData;
    link.download = `tree_${tree_id}_qr.png`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 min-h-screen bg-green-100">
        <div className="text-green-600 text-xl font-bold">Generating QR Code...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 min-h-screen bg-green-100">
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-red-200 text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <div className="text-red-600 text-xl font-bold">{error}</div>
            <a href="/pages/addTree" className="mt-4 inline-block text-green-600 underline">Go Back</a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-green-200 m-4 max-w-xl mx-auto">
      <div className="text-center">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-green-900 mb-2">
            Tree Added Successfully! 
          </h2>
          <p className="text-green-700">
            Your tree has been registered with ID: {tree_id}
          </p>
        </div>

        {qrData && (
          <div className="flex flex-col items-center space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-green-200">
              <Image src={qrData} width={200} height={200} alt="QR Code" />
            </div>

            <div className="text-sm text-green-600">
              Scan this QR code to view tree details
            </div>

            <button
              onClick={handleDownload}
              className="bg-green-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-green-700 active:scale-[0.98] transition-all"
            >
              Download QR Code
            </button>

            <a
              href="/pages/addTree"
              className="text-green-600 hover:text-green-800 underline"
            >
              Add Another Tree
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TreeAddedPage() {
    return (
        <main className="min-h-screen bg-green-100 font-sans text-gray-900 py-12">
            <Suspense fallback={<div className="text-center pt-20">Loading...</div>}>
                <TreeAddedContent />
            </Suspense>
        </main>
    );
}
