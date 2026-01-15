"use client";

import React, { useEffect, useState, Suspense } from "react";
import QRCode from "qrcode";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { CheckCircle, AlertTriangle, Download, Plus } from "lucide-react";

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
        
        // Fetch tree from MongoDB to ensure it exists
        const treeResponse = await fetch(`/api/trees/${tree_id}`);
        const treeResult = await treeResponse.json();
        
        if (!treeResult.success || !treeResult.data) {
          setError("Tree not found in database");
          return;
        }

        const origin = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
        const qrUrl = `${origin}/tree/${tree_id}`;
        
        const qrDataUrl = await QRCode.toDataURL(qrUrl);

        console.log('[QR Code] Generated for tree ID:', tree_id);

        // Sync QR code back to MongoDB
        try {
            const response = await fetch(`/api/trees/${tree_id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ qr_code: qrDataUrl }),
            });

            const result = await response.json();
            if (result.success) {
              console.log('[QR Code] ✅ Saved to MongoDB');
            } else {
              console.log('[QR Code] ⚠️ MongoDB update failed:', result.error);
            }
        } catch (err) {
            console.log('[QR Code] ⚠️ MongoDB sync failed:', err);
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
      <div className="flex items-center justify-center p-8 min-h-screen bg-neutral-50">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-red-100 text-center max-w-sm">
            <div className="flex justify-center mb-4 text-red-500">
               <AlertTriangle size={64} />
            </div>
            <div className="text-gray-900 text-lg font-bold mb-4">{error}</div>
            <a href="/pages/addTree" className="text-sm font-bold text-gray-500 hover:text-gray-900 underline">Go Back</a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-100 m-4 max-w-xl mx-auto">
      <div className="text-center">
        <div className="mb-8">
           <div className="flex justify-center mb-4">
               <CheckCircle size={64} className="text-green-500" />
           </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Tree Added Successfully
          </h2>
          <p className="text-gray-500">
            Registered with ID: {tree_id}
          </p>
        </div>

        {qrData && (
          <div className="flex flex-col items-center space-y-8">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-200">
              <Image src={qrData} width={200} height={200} alt="QR Code" className="rounded-lg" />
            </div>

            <div className="text-sm text-gray-400">
              Scan this QR code to view tree details
            </div>

            <button
              onClick={handleDownload}
              className="bg-gray-900 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:bg-black transition-all flex items-center gap-2"
            >
              <Download size={18} />
              Download QR Code
            </button>

            <a
              href="/pages/addTree"
              className="text-green-600 hover:text-green-700 font-medium flex items-center gap-2"
            >
              <Plus size={16} />
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
        <main className="min-h-screen bg-neutral-50 font-sans text-gray-900 py-12">
            <Suspense fallback={<div className="text-center pt-20 text-gray-400">Loading...</div>}>
                <TreeAddedContent />
            </Suspense>
        </main>
    );
}
