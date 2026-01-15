import Link from "next/link";
import { Plus, TreeDeciduous } from "lucide-react";

const Navbar = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md w-full h-16 flex items-center px-6 border-b border-neutral-200 sticky top-0 z-50">
      <div className="w-full max-w-2xl mx-auto flex justify-between items-center h-full">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-green-100 p-2 rounded-lg group-hover:bg-green-200 transition">
             <TreeDeciduous size={20} className="text-green-700" />
          </div>
          <h1 className="text-lg font-bold text-gray-800 tracking-tight">QR Tree</h1>
        </Link>
        <Link 
          href="/pages/addTree"
          title="Add Tree"
          className="bg-gray-900 text-white p-2 rounded-full hover:bg-black transition shadow-sm"
        >
          <Plus size={20} />
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
