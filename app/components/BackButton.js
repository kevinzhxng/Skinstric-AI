"use client";

import { useRouter } from "next/navigation";

function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <button 
      onClick={handleBack}
      className="flex items-center gap-4 cursor-pointer"
    >
      <div className="relative">
        {/* rotated box */}
        <div className="w-8 h-8 border-[0.5px] border-black rotate-45 bg-white"></div>
        {/* centered triangle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-0 h-0 border-t-[5px] border-b-[5px] border-r-[8px] border-t-transparent border-b-transparent border-r-black -translate-x-0.5"></div>
        </div>
      </div>
      <div className="text-[0.5rem] font-semibold tracking-[0.05em] cursor-pointer">
        BACK
      </div>
    </button>
  );
}

export default BackButton;
