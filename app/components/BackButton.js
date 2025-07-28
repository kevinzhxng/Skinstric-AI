"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import gsap from "gsap";

function BackButton({onNavigate}) {
  const router = useRouter();

  const leftInnerDottedButtonRef = useRef(null);
  const leftOuterButtonRef = useRef(null);
  const leftInnerDiamondRef = useRef(null);
  const leftOuterDiamondRef = useRef(null);
  const backTextRef = useRef(null);

  const handleBackHover = () => {
    // Expand left diamond
    gsap.to(leftOuterDiamondRef.current, {
      scale: 1,
      opacity: 1,
      duration: 1,
      ease: "power2.out",
    });
    gsap.to(leftInnerDiamondRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
    });

    //expand left button
    gsap.to(leftOuterButtonRef.current, {
      scale: 2.0,
      duration: 0.6,
      ease: "power2.out",
    });

    gsap.to(leftInnerDottedButtonRef.current, {
      scale: 1.6,
      opacity: 1,
      duration: 0.6,
      ease: "power2.out",
    });

    //move BACK text right
    gsap.to(backTextRef.current, {
      translateX: 28,
      duration: 0.6,
      ease: "power2.out",
    });
  };

  const handleBackLeave = () => {
    // Contract diamond
    gsap.to(leftOuterDiamondRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
    });
    gsap.to(leftInnerDiamondRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
    });

    // Contract button
    gsap.to(leftOuterButtonRef.current, {
      scale: 1,
      duration: 0.6,
      ease: "power2.out",
    });
    gsap.to(leftInnerDottedButtonRef.current, {
      scale: 1,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
    });

    // Move text back
    gsap.to(backTextRef.current, {
      x: 0,
      duration: 0.6,
      ease: "power2.out",
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <button
      onClick={onNavigate}
      onMouseEnter={handleBackHover}
      onMouseLeave={handleBackLeave}
      className="flex items-center gap-4 cursor-pointer"
      type="button"
    >
      <div className="relative">
        {/* Outer diamond */}
        <div
          ref={leftOuterDiamondRef}
          className="absolute top-1/2 left-1/2 w-12 h-12 border-dotted border-[1.5px] border-gray-300 transform -translate-x-1/2 -translate-y-1/2 rotate-45 pointer-events-none opacity-0 scale-80"
        ></div>
        {/* Inner diamond */}
        <div
          ref={leftInnerDiamondRef}
          className="absolute top-1/2 left-1/2 w-10 h-10 border-dotted border-[1.5px] border-[#b7bcc5] transform -translate-x-1/2 -translate-y-1/2 rotate-45 pointer-events-none opacity-0 scale-80"
        ></div>
        {/* Button (diamond) */}
        <div
          ref={leftOuterButtonRef}
          className="w-8 h-8 border-[0.5px] border-black rotate-45 bg-white relative z-10"
        ></div>
        {/* Dotted button */}
        <div
          ref={leftInnerDottedButtonRef}
          className="absolute top-1/2 left-1/2 w-8 h-8 border-dotted border-[1px] border-[#b7bcc5] rotate-45 bg-transparent opacity-0 scale-80 transform -translate-x-1/2 -translate-y-1/2 z-20"
        ></div>
        {/* Triangle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
          <div className="w-0 h-0 border-t-[5px] border-b-[5px] border-r-[8px] border-t-transparent border-b-transparent border-r-black -translate-x-0.5"></div>
        </div>
      </div>
      <div
        ref={backTextRef}
        className="text-[0.5rem] font-semibold tracking-[0.05em] cursor-pointer"
      >
        BACK
      </div>
    </button>
  );
}

export default BackButton;
