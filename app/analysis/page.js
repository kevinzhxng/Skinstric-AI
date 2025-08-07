"use client";

import { useState, useEffect, useRef } from "react";
import BackButton from "../components/BackButton";
import gsap from "gsap";

function AnalysisPage() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  const rightSquare1 = useRef(null);
  const rightSquare2 = useRef(null);
  const rightSquare3 = useRef(null);

  const bookTextRef = useRef(null);
  const preparingAnalysis = useRef(null);

  const rotationAnims = useRef([]);

  useEffect(() => {
    if (loading && bookTextRef.current) {
      gsap.fromTo(
        bookTextRef.current,
        {
          clipPath: "inset(0 50% 0 50%)",
        },
        {
          clipPath: "inset(0 0% 0 0%)",
          duration: 1.2,
          ease: "power2.out",
        }
      );
    }
  }, [loading]);

  useEffect(() => {
    setTimeout(() => {
      //reversing animation
      if (bookTextRef.current) {
        gsap.to(bookTextRef.current, {
          clipPath: "inset(0 50% 0 50%)",
          duration: 1.2,
          ease: "power2.in",
          onComplete: () => {
            const stored = localStorage.getItem("analysisResult");
            if (stored) {
              setResult(JSON.parse(stored));
            }
            setLoading(false);
          },
        });
      } else {
        const stored = localStorage.getItem("analysisResult");
        if (stored) {
          setResult(JSON.parse(stored));
        }
        setLoading(false);
      }
    }, 5000);
  }, []);

  useEffect(() => {
    if (loading) {
      // Set initial positions first
      if (rightSquare1.current) gsap.set(rightSquare1.current, { rotate: 45 });
      if (rightSquare2.current) gsap.set(rightSquare2.current, { rotate: 75 });
      if (rightSquare3.current) gsap.set(rightSquare3.current, { rotate: 105 });
      
      // Start spinning
      rotationAnims.current = [
        gsap.to(rightSquare1.current, {
          rotate: 405,
          duration: 65,
          repeat: -1,
          ease: "linear",
        }),
        gsap.to(rightSquare2.current, {
          rotate: 405,
          duration: 78,
          repeat: -1,
          ease: "linear",
        }),
        gsap.to(rightSquare3.current, {
          rotate: 405,
          duration: 91,
          repeat: -1,
          ease: "linear",
        }),
      ];
    } else {
      // Stop spinning - the squares will be unmounted anyway
      rotationAnims.current.forEach((anim) => anim && anim.kill());
    }
  }, [loading]);

  // Cleanup effect to kill all animations when component unmounts
  useEffect(() => {
    return () => {
      rotationAnims.current.forEach((anim) => anim && anim.kill());
    };
  }, []);

  const handleNavigateOut = () => {
    //animating main content out
    gsap.to(
      [toStartAnalysisTextRef.current, cameraRef.current, galleryRef.current],
      {
        opacity: 0,
        y: 60,
        duration: 0.7,
        ease: "power2.in",
        stagger: 0.05,
        onComplete: () => {
          router.back();
        },
      }
    );
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-white">
        <div
          ref={preparingAnalysis}
          className="flex min-h-screen items-center justify-center"
        >
          <div className="flex items-center justify-center relative">
            <div
              ref={rightSquare1}
              className="w-88 h-88 border-2 border-gray-400 border-dotted relative z-10"
            />
            <div
              ref={rightSquare2}
              className="w-94 h-94 border-2 border-[#b7bcc5] border-dotted absolute z-20"
            />
            <div
              ref={rightSquare3}
              className="w-100 h-100 border-2 border-gray-300 border-dotted absolute z-30"
            />
            <div
              ref={bookTextRef}
              className="absolute flex items-center justify-center text-[12px] font-semibold z-40"
              style={{ clipPath: "inset(0 50% 0 50%)" }}
            >
              PREPARING YOUR ANALYSIS...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div>No analysis data found.</div>
      </div>
    );
  }

  return (
    <div className="" style={{ transform: 'none', rotate: '0deg' }}>
      <div className="pt-[72px] pl-[32px] pr-[32px] pb-[32px]" style={{ transform: 'none', rotate: '0deg' }}>
        <div className="border-1 flex-col" style={{ transform: 'none', rotate: '0deg' }}>
          <div className="text-[13px] font-[400]" style={{ transform: 'none', rotate: '0deg' }}>A.I. ANALYSIS</div>
          <div className="font-[400] text-[54px] tracking-[-0.05em]" style={{ transform: 'none', rotate: '0deg' }}>
            DEMOGRAPHIC
          </div>
          <div style={{ transform: 'none', rotate: '0deg' }}>PREDICTED RACE & AGE</div>
        </div>
        <div className="border-1 flex transform-none rotate-0">
          <div className="border-1 transform-none rotate-0">column 1</div>
          <div className="border-1 transform-none rotate-0">column 2</div>
          <div className="border-1 transform-none rotate-0">column 3</div>
        </div>
      </div>
      <div style={{ transform: 'none', rotate: '0deg' }}>
        <BackButton onNavigate={() => handleNavigateOut("/")} />
      </div>
    </div>
  );
}

export default AnalysisPage;
