import Link from "next/link";

function Navbar() {
  return (
    <header className="flex items-center justify-between h-[64px] w-full px-[16px]">
      <div className="flex items-center justify-center">
        <div className="font-semibold text-[10px] ">
          <Link href="/">SKINSTRIC</Link>
        </div>
        <div className="text-[10px] pl-6">
          {" "}
          <span className="pr-2">[</span>INTRO<span className="pl-2">]</span>
        </div>
      </div>
      <div className="flex items-center">
        <button className="bg-[#1a1b1c] relative text-center text-[#fcfcfc] w-[92px] h-[32px] text-[9px] font-semibold inline-block cursor-pointer hover:bg-white hover:text-black transition-all duration-300">
          <span className="">ENTER CODE</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
