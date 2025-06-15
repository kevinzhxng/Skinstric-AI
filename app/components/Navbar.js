"use client"

import Link from "next/link";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <header className="flex items-center justify-between h-[64px] w-full px-[16px]">
        <div className="flex items-center justify-center">
          <div className="font-semibold text-[10px] pl-[16px]">
            <Link href="/">SKINSTRIC</Link>
          </div>
          <div className="text-[10px] pl-4">
            {" "}
            <span className="pr-2">[</span>INTRO<span className="pl-2">]</span>
          </div>
        </div>
        <div className="flex items-center pr-[16px]">
          <button className="bg-[#1a1b1c] relative text-center text-[#fcfcfc] w-[92px] h-[34px] text-[10px] font-semibold inline-block cursor-pointer hover:bg-white hover:text-black transition-all duration-300">
            <span className="">ENTER CODE</span>
          </button>
        </div>
      </header>
    </nav>
  );
}
export default Navbar;

