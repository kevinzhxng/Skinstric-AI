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

  const getHighestConfidence = (obj) => {
    //Object.entries(obj) converts object into an array with key, value pairs
    //.reduce((a,b) => ...) goes thru each pair and compares them
    //obj[a[0]] > obj[b[0]] ? a : b compares values
    return Object.entries(obj).reduce((a, b) =>
      obj[a[0]] > obj[b[0]] ? a : b
    );
  };

  const getHighestAge = () => {
    //!result?.data?.age means if result exists and result.data exists and result.data.age exists...
    if (!result?.data?.age) {
      return "unknown";
    }
    //input: { "0-2": 0.001, "10-19": 0.452, "20-29": 0.062 }
    const [ageRange, confidence] = getHighestConfidence(result.data.age);
    //returns: ["10-19", 0.452]
    return ageRange;
  };

  const getHighestGender = () => {
    if (!result?.data?.gender) {
      return "unknown";
    }
    const [gender, confidence] = getHighestConfidence(result.data.gender);
    //charAt(0) gets first letter, .slice(1) removes first letter
    return gender.toUpperCase();
  };

  const getHighestRace = () => {
    if (!result?.data?.race) {
      return "Unknown";
    }
    const [race, confidence] = getHighestConfidence(result.data.race);
    return race.toUpperCase();
  };

  const CircularProgress = ({ percentage, size = 120, strokeWidth = 4 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const progress = (percentage / 100) * circumference;
    const offset = circumference - progress;

    return (
      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#000000"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute text-center">
          <div className="text-2xl font-bold">{percentage}%</div>
        </div>
      </div>
    );
  };

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
              const parsedResult = JSON.parse(stored);
              console.log("Parsed Result: ", parsedResult);
              setResult(parsedResult);
            }
            setLoading(false);
          },
        });
      } else {
        const stored = localStorage.getItem("analysisResult");
        if (stored) {
          const parsedResult = JSON.parse(stored);
          console.log("Parsed Result: ", parsedResult);
          setResult(parsedResult);
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
    <div className="min-h-screen flex flex-col transform-none rotate-0">
      <div className="flex-1 pt-[72px] pl-[32px] pr-[32px] pb-[32px]">
        <div
          className="border-1 flex-col"
          style={{ transform: "none", rotate: "0deg" }}
        >
          <div
            className="text-[13px] font-[400]"
            style={{ transform: "none", rotate: "0deg" }}
          >
            A.I. ANALYSIS
          </div>
          <div
            className="font-[400] text-[54px] tracking-[-0.05em]"
            style={{ transform: "none", rotate: "0deg" }}
          >
            DEMOGRAPHICS
          </div>
          <div
            className="text-[14px] font-[300]"
            style={{ transform: "none", rotate: "0deg" }}
          >
            PREDICTED RACE & AGE
          </div>
        </div>
        <div
          className="flex transform-none rotate-0 mt-[32px] flex-1"
          style={{ minHeight: "calc(100vh - 343px)" }}
        >
          <div className="transform-none rotate-0 w-[13%] mr-[8px]">
            <div className="border-t-2 bg-gray-100">
              <div className="pt-[8px] pl-[12px] mb-[36px] text-[14px] tracking-[-0.03em] font-semibold">
                {getHighestRace()}
              </div>
              <div className="pl-[12px] pb-[8px] text-[14px] tracking-[-0.03em] font-semibold">
                RACE
              </div>
            </div>
            <div className="border-t-2 bg-gray-100 mt-[8px] mb-[8px]">
              <div className="pt-[8px] pl-[12px] mb-[36px] text-[14px] tracking-[-0.03em] font-semibold">
                {getHighestAge()}
              </div>
              <div className="pl-[12px] pb-[8px] text-[14px] tracking-[-0.03em] font-semibold">
                AGE
              </div>
            </div>
            <div className="border-t-2 bg-gray-100">
              <div className="pt-[8px] pl-[12px] mb-[36px] text-[14px] tracking-[-0.03em] font-semibold">
                {getHighestGender()}
              </div>
              <div className="pl-[12px] pb-[8px] text-[14px] tracking-[-0.03em] font-semibold">
                GENDER
              </div>
            </div>
          </div>
          <div className="border-t-2 bg-gray-100 transform-none rotate-0 w-[60%] mr-[8px] ml-[8px]">
            <div className="pl-[24px] pt-[16px] pb-[16px] pr-[24px]">
              <div className="font-[600] text-[14px]">A.I. CONFIDENCE</div>
              <div className="flex-1 flex items-end justify-end ">
                <CircularProgress
                  percentage={
                    result?.data?.race
                      ? (
                          Math.max(...Object.values(result.data.race)) * 100
                        ).toFixed(1)
                      : "0"
                  }
                  size={140}
                  strokeWidth={3}
                />
              </div>
            </div>
          </div>
          <div className="transform-none rotate-0 w-[27%] ml-[8px] border-t-2 bg-gray-100">
            <div className="border-1 pr-[16px] pl-[16px] pt-[12px] pb-[12px] flex justify-between">
              <div>RACE</div>
              <div>A.I. CONFIDENCE</div>
            </div>
            <div>
              {result?.data?.race &&
                Object.entries(result.data.race)
                  .sort(([, a], [, b]) => b - a)
                  .map(([race, confidence], index) => (
                    <div
                      key={index}
                      className="border-1 pr-[16px] pl-[16px] pt-[12px] pb-[12px] flex justify-between"
                    >
                      <div className={index === 0 ? "font-semibold" : ""}>
                        {race.toUpperCase()}
                      </div>
                      <div>{(confidence * 100).toFixed(1)}%</div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>
      <div className="border-1 flex justify-between items-center px-[32px] py-[24px]">
        <div className="transform-none rotate-0 relative">
          <BackButton onNavigate={() => handleNavigateOut("/testing")} />
        </div>
        <div className="text-[12px] text-gray-600">
          If A.I. estimate is wrong, select the correct one.
        </div>
        <div className="flex gap-[12px]">
          <button className="px-[16px] py-[8px] border border-gray-300 text-[12px]">
            RESET
          </button>
          <button className="px-[16px] py-[8px] bg-black text-white text-[12px]">
            CONFIRM
          </button>
        </div>
      </div>
    </div>
  );
}

export default AnalysisPage;
