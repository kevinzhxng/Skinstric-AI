"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function InitialLoading({ onLoadingComplete }) {
  const loadingRef = useRef(null);
  const diamondRef = useRef(null);
  const diamondInnerRef = useRef(null);
  const diamondOuterRef = useRef(null);

  useEffect(() => {
    //create the loading animation sequence
    const tl = gsap.timeline({
      onComplete: () => {
        //fade out the loading screen
        gsap.to(loadingRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => {
            onLoadingComplete();
          },
        });
      },
    });

    gsap.set([diamondRef.current], {
      opacity: 0,
      scale: 0.4,
    });
    gsap.set([diamondInnerRef.current], {
      opacity: 0,
      scale: 0.3,
    });
    gsap.set([diamondOuterRef.current], {
      opacity: 0,
      scale: 0.2,
    });

    // Animate diamond in
    tl.to(
      diamondRef.current,
      {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "power2.out",
      },
      0.4
    );
    tl.to(
      diamondInnerRef.current,
      {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: "power2.out",
      },
      0.4
    );
    tl.to(
      diamondOuterRef.current,
      {
        opacity: 1,
        scale: 1,
        duration: 1.4,
        ease: "power2.out",
      },
      0.4
    );

    // Hold for a moment
    tl.to({}, { duration: 1.2 });

    // Animate diamond out
    tl.to(
      diamondRef.current,
      {
        opacity: 0,
        scale: 0.8,
        duration: 0.6,
        ease: "power2.in",
      },
      "-=0.6"
    );
    tl.to(
        diamondInnerRef.current,
        {
          opacity: 0,
          scale: 0.8,
          duration: 0.8,
          ease: "power2.in",
        },
        "-=0.6"
      );
      tl.to(
        diamondOuterRef.current,
        {
          opacity: 0,
          scale: 0.8,
          duration: 1,
          ease: "power2.in",
        },
        "-=0.6"
      );
  }, [onLoadingComplete]);

  return (
    <div 
      ref={loadingRef}
      className="fixed inset-0 bg-white z-50 flex items-center justify-center"
    >
      <div className="relative">
        {/* Center diamond - smallest */}
        <div
          ref={diamondRef}
          className="absolute top-1/2 left-1/2 w-80 h-80 border-dotted border-2 border-gray-400 transform rotate-45 -translate-x-1/2 -translate-y-1/2 opacity-0"
        ></div>
        
        {/* Inner diamond - medium size */}
        <div
          ref={diamondInnerRef}
          className="absolute top-1/2 left-1/2 w-90 h-90 border-dotted border-2 border-[#b7bcc5] transform rotate-45 -translate-x-1/2 -translate-y-1/2 opacity-0"
        ></div>
        
        {/* Outer diamond - largest */}
        <div
          ref={diamondOuterRef}
          className="absolute top-1/2 left-1/2 w-100 h-100 border-dotted border-2 border-gray-300 transform rotate-45 -translate-x-1/2 -translate-y-1/2 opacity-0"
        ></div>
      </div>
    </div>
  );
}
