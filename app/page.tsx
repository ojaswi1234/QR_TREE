"use client";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-green-100 font-sans text-gray-900 overflow-x-hidden">
      <Navbar />

      <div className="max-w-2xl mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-green-900">Namaste</h1>
          <p className="text-green-700 opacity-80">
            Scan a QR code to view tree details.
          </p>
        </header>

        <div className="flex justify-center p-12 bg-white rounded-3xl shadow-xl border border-green-200">
           <p className="text-green-800 text-center text-lg">
             Use your camera to scan a tree QR code. <br/>
             <span className="text-sm text-green-600 mt-2 block">
               (Or add a new tree to generate one!)
             </span>
           </p>
        </div>
      </div>
    </main>
  );
}
