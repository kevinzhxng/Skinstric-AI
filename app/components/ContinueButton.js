"use client";

import { useRouter } from "next/navigation";

function ContinueButton({ to = "/about" }) {
  const router = useRouter();

  const handleContinue = () => {
    router.push(to);
  };

  return (
    <button 
      onClick={handleContinue}
      className="flex items-center gap-4 cursor-pointer">
      <div className="text-[0.5rem] font-semibold tracking-[0.05em]">
        CONTINUE
      </div>
      <div className="relative">
        <div className="w-8 h-8 border-[0.5px] border-black -rotate-45 bg-white"></div>
        {/* centered triangle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-0 h-0 border-t-[5px] border-b-[5px] border-l-[8px] border-t-transparent border-b-transparent border-l-black translate-x-0.5"></div>
        </div>
      </div>
    </button>
  );
}

export default ContinueButton;
