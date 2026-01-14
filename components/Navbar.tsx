import Link from "next/link";

const Navbar = () => {
  return (
    <header className="bg-green-200 w-screen h-14 flex items-center px-6">
      <div className="w-full h-full flex justify-between items-center">
        <h1 className="text-lg font-bold">QR_TREE</h1>
        <Link href="/pages/addTree">
          <button className="bg-white p-1.5 font-bold">+ Add</button>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
