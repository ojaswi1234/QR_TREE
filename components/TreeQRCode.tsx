"use client";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import Image from "next/image";

interface TreeQRCodeProps {
  treeId: number;
  treeName: string;
}

export default function TreeQRCode({ treeId, treeName }: TreeQRCodeProps) {
  const [qrUrl, setQrUrl] = useState<string>("");

  useEffect(() => {
    // Generate QR code for the tree detail page
    if (typeof window !== 'undefined') {
        const url = `${window.location.origin}/tree/${treeId}`;
        QRCode.toDataURL(url, { width: 400, margin: 2 })
        .then((dataUrl) => {
            setQrUrl(dataUrl);
        })
        .catch((err) => console.error(err));
    }
  }, [treeId]);

  const downloadQR = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    if (!qrUrl) return;

    const link = document.createElement("a");
    link.href = qrUrl;
    link.download = `QR_${treeName.replace(/\s+/g, "_")}_${treeId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!qrUrl) return <div className="w-16 h-16 bg-gray-200 rounded animate-pulse"></div>;

  return (
    <div className="flex flex-col items-center gap-1 bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
      <Image 
        src={qrUrl} 
        alt="QR Code" 
        width={80} 
        height={80} 
        className="rounded"
      />
      <button
        onClick={downloadQR}
        className="px-2 py-1 bg-green-600 text-white text-[10px] font-bold rounded hover:bg-green-700 transition w-full text-center"
      >
        Download
      </button>
    </div>
  );
}
