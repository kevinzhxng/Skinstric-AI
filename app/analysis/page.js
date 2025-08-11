"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import BackButton from "../components/BackButton";
import gsap from "gsap";

function AnalysisPage() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [selectedRace, setSelectedRace] = useState(null);
  const [selectedAge, setSelectedAge] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("race");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const rightSquare1 = useRef(null);
  const rightSquare2 = useRef(null);
  const rightSquare3 = useRef(null);

  const bookTextRef = useRef(null);
  const preparingAnalysis = useRef(null);

  //main content animations
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const descriptionRef = useRef(null);
  const leftColumnRef = useRef(null);
  const middleColumnRef = useRef(null);
  const rightColumnRef = useRef(null);
  const bottomSectionRef = useRef(null);

  const rotationAnims = useRef([]);

  // Set mounted state to prevent hydration flash
  useEffect(() => {
    setMounted(true);
  }, []);

  //for right column button
  const DiamondIcon = ({ filled = false, size = 12 }) => {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 12 12"
        className="flex-shrink-0"
      >
        <path
          d="M6 1L11 6L6 11L1 6L6 1Z"
          fill={filled ? "white" : "transparent"}
          stroke="black"
          strokeWidth="1"
        />
      </svg>
    );
  };

  const getSelectedConfidence = () => {
    if (!result?.data) return 0;

    if (
      selectedCategory === "race" &&
      selectedRace &&
      result.data.race[selectedRace]
    ) {
      return (result.data.race[selectedRace] * 100).toFixed(1);
    }

    if (
      selectedCategory === "age" &&
      selectedAge &&
      result.data.age[selectedAge]
    ) {
      return (result.data.age[selectedAge] * 100).toFixed(1);
    }

    if (
      selectedCategory === "gender" &&
      selectedGender &&
      result.data.gender[selectedGender]
    ) {
      return (result.data.gender[selectedGender] * 100).toFixed(1);
    }

    if (selectedCategory === "race") {
      const [race, confidence] = getHighestConfidence(result.data.race);
      return (confidence * 100).toFixed(1);
    }

    if (selectedCategory === "age") {
      const [age, confidence] = getHighestConfidence(result.data.age);
      return (confidence * 100).toFixed(1);
    }

    if (selectedCategory === "gender") {
      const [gender, confidence] = getHighestConfidence(result.data.gender);
      return (confidence * 100).toFixed(1);
    }

    return 0;
  };

  const getSelectedName = () => {
    if (selectedCategory === "race") {
      if (selectedRace) {
        return selectedRace.toUpperCase();
      }
      const [race, confidence] = getHighestConfidence(result.data.race);
      return race.toUpperCase();
    }

    if (selectedCategory === "age") {
      if (selectedAge) {
        return selectedAge;
      }
      const [age, confidence] = getHighestConfidence(result.data.age);
      return age;
    }

    if (selectedCategory === "gender") {
      if (selectedGender) {
        return selectedGender.toUpperCase();
      }
      const [gender, confidence] = getHighestConfidence(result.data.gender);
      return gender.toUpperCase();
    }

    return "Unknown";
  };

  const getSelectedRaceName = () => {
    if (selectedRace) {
      return selectedRace.toUpperCase();
    }

    if (!result?.data?.race) {
      return "unknown";
    }
    const [race, confidence] = getHighestConfidence(result.data.race);
    return race.toUpperCase();
  };

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
      <div className="flex items-end justify-end h-full">
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
          <div className="absolute text-center flex">
            <div className="text-4xl">{percentage}</div>
            <div>%</div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (loading && mounted && bookTextRef.current) {
      gsap.fromTo(
        bookTextRef.current,
        {
          clipPath: "inset(0 50% 0 50%)",
        },
        {
          clipPath: "inset(0 0% 0 0%)",
          duration: 1.2,
          ease: "power2.out",
          delay: 0.5, // Delay the text animation by 1 second
        }
      );
    }
  }, [loading, mounted]);

  useEffect(() => {
    setTimeout(() => {
      // Animate squares and text out simultaneously
      gsap.to([rightSquare1.current, rightSquare2.current, rightSquare3.current], {
        opacity: 0,
        scale: 0.8,
        duration: 0.8,
        ease: "power2.in",
        stagger: 0.1,
      });

      if (bookTextRef.current) {
        gsap.to(bookTextRef.current, {
          clipPath: "inset(0 50% 0 50%)",
          duration: 0.8,
          ease: "power2.in",
        });
      }

      // Wait for both animations to complete before transitioning
      gsap.delayedCall(0.8, () => {
        const stored = localStorage.getItem("analysisResult");
        if (stored) {
          const parsedResult = JSON.parse(stored);
          console.log("Parsed Result: ", parsedResult);
          setResult(parsedResult);
        }
        setLoading(false);
      });
    }, 6500);
  }, []);

  useEffect(() => {
    if (loading && mounted) {
      // Set initial positions and opacity
      if (rightSquare1.current) gsap.set(rightSquare1.current, { rotate: 45, opacity: 0 });
      if (rightSquare2.current) gsap.set(rightSquare2.current, { rotate: 75, opacity: 0 });
      if (rightSquare3.current) gsap.set(rightSquare3.current, { rotate: 105, opacity: 0 });

      // Start spinning immediately
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

      // Fade in the squares with stagger (spinning will already be happening)
      gsap.to([rightSquare1.current, rightSquare2.current, rightSquare3.current], {
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
        delay: 0.5,
      });
    } else {
      // Stop spinning - the squares will be unmounted anyway
      rotationAnims.current.forEach((anim) => anim && anim.kill());
    }
  }, [loading, mounted]);

  // Cleanup effect to kill all animations when component unmounts
  useEffect(() => {
    return () => {
      rotationAnims.current.forEach((anim) => anim && anim.kill());
    };
  }, []);

  // Entrance animations when loading finishes
  useEffect(() => {
    if (!loading && result) {
      // Set initial positions
      gsap.set([titleRef.current, subtitleRef.current, descriptionRef.current], {
        clipPath: "inset(0 100% 0 0)",
        opacity: 0
      });
      
      gsap.set([leftColumnRef.current, middleColumnRef.current, rightColumnRef.current], {
        clipPath: "inset(0 0 100% 0)",
        opacity: 0
      });
      
      gsap.set(bottomSectionRef.current, {
        opacity: 0,
        y: 30
      });

      // Animate text elements from left to right
      gsap.to([titleRef.current, subtitleRef.current, descriptionRef.current], {
        clipPath: "inset(0 0% 0 0)",
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
        stagger: 0.2
      });

      // Animate columns from top to bottom
      gsap.to([leftColumnRef.current, middleColumnRef.current, rightColumnRef.current], {
        clipPath: "inset(0% 0 0% 0)",
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
        stagger: 0.1,
        delay: 0.5
      });

      // Animate bottom section
      gsap.to(bottomSectionRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.9
      });
    }
  }, [loading, result]);

  const handleNavigateOut = () => {
    //animating main content out
    gsap.to(
      [titleRef.current, subtitleRef.current, descriptionRef.current, leftColumnRef.current, middleColumnRef.current, rightColumnRef.current, bottomSectionRef.current],
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

  const handleConfirm = () => {
    const currentSelections = {
      race: selectedRace || getHighestConfidence(result.data.race)[0],
      age: selectedAge || getHighestConfidence(result.data.age)[0],
      gender: selectedGender || getHighestConfidence(result.data.gender)[0],
      category: selectedCategory,
    };

    localStorage.setItem(
      "confirmedSelections",
      JSON.stringify(currentSelections)
    );

    router.push("/summary");
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
              style={{ opacity: 0 }}
            />
            <div
              ref={rightSquare2}
              className="w-94 h-94 border-2 border-[#b7bcc5] border-dotted absolute z-20"
              style={{ opacity: 0 }}
            />
            <div
              ref={rightSquare3}
              className="w-100 h-100 border-2 border-gray-300 border-dotted absolute z-30"
              style={{ opacity: 0 }}
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
        <div className="flex-col !transform-none !rotate-0">
          <div ref={titleRef} className="text-[13px] font-[400] !transform-none !rotate-0">
            A.I. ANALYSIS
          </div>
          <div ref={subtitleRef} className="font-[400] text-[54px] tracking-[-0.05em] !transform-none !rotate-0">
            DEMOGRAPHICS
          </div>
          <div ref={descriptionRef} className="text-[14px] font-[300] !transform-none !rotate-0">
            PREDICTED RACE & AGE
          </div>
        </div>
        <div
          className="flex transform-none rotate-0 mt-[32px] flex-1"
          style={{ minHeight: "calc(100vh - 364px)" }}
        >
          <div ref={leftColumnRef} className="transform-none rotate-0 w-[13%] mr-[8px]">
            <button
              onClick={() => {
                setSelectedCategory("race");
                setSelectedRace(null);
              }}
              className={`w-full cursor-pointer border-t-2 transition-colors ${
                selectedCategory === "race"
                  ? "bg-black text-white"
                  : "bg-[#f3f3f4] hover:bg-gray-200"
              }`}
            >
              <div className="flex pt-[8px] pl-[12px] mb-[36px] text-[14px] tracking-[-0.03em] font-semibold">
                {getSelectedRaceName()}
              </div>
              <div className="flex pl-[12px] pb-[8px] text-[14px] tracking-[-0.03em] font-semibold">
                RACE
              </div>
            </button>

            <button
              onClick={() => {
                setSelectedCategory("age");
                setSelectedAge(null);
              }}
              className={`w-full border-t-2 mt-[8px] mb-[8px] cursor-pointer transition-colors ${
                selectedCategory === "age"
                  ? "bg-black text-white"
                  : "bg-[#f3f3f4] hover:bg-gray-200"
              }`}
            >
              <div className="flex pt-[8px] pl-[12px] mb-[36px] text-[14px] tracking-[-0.03em] font-semibold">
                {selectedCategory === "age"
                  ? getSelectedName()
                  : getHighestAge()}
              </div>
              <div className="flex pl-[12px] pb-[8px] text-[14px] tracking-[-0.03em] font-semibold">
                AGE
              </div>
            </button>

            <button
              onClick={() => {
                setSelectedCategory("gender");
                setSelectedGender(null);
              }}
              className={`w-full border-t-2 transition-colors cursor-pointer ${
                selectedCategory === "gender"
                  ? "bg-black text-white"
                  : "bg-[#f3f3f4] hover:bg-gray-200"
              }`}
            >
              <div className="flex pt-[8px] pl-[12px] mb-[36px] text-[14px] tracking-[-0.03em] font-semibold">
                {selectedCategory === "gender"
                  ? getSelectedName()
                  : getHighestGender()}
              </div>
              <div className="flex pl-[12px] pb-[8px] text-[14px] tracking-[-0.03em] font-semibold">
                SEX
              </div>
            </button>
          </div>
          <div ref={middleColumnRef} className="border-t-2 bg-[#f3f3f4] transform-none rotate-0 w-[60%] mr-[8px] ml-[8px]">
            <div className="pl-[24px] pt-[16px] pb-[16px] pr-[24px] h-full">
              <div className="font-[600] text-[14px]">A.I. CONFIDENCE</div>
              <div className="flex-1 flex items-end justify-end pb-[32px] pr-[16px] h-full">
                  <CircularProgress
                    percentage={getSelectedConfidence()}
                    size={240}
                    strokeWidth={2}
                  />
              </div>
            </div>
          </div>
          <div ref={rightColumnRef} className="transform-none rotate-0 w-[27%] ml-[8px] border-t-2 bg-[#f3f3f4]">
            <div className="pr-[16px] pl-[16px] pt-[12px] pb-[12px] flex justify-between text-[14px] text-[#5f6060] tracking-[-0.05em]">
              <div>RACE</div>
              <div>A.I. CONFIDENCE</div>
            </div>
            <div>
              {selectedCategory === "race" &&
                result?.data?.race &&
                Object.entries(result.data.race)
                  .sort(([, a], [, b]) => b - a)
                  .map(([race, confidence], index) => {
                    const isSelected =
                      selectedRace === race || (!selectedRace && index === 0);

                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedRace(race)}
                        className={`w-full pr-[16px] pl-[16px] pt-[12px] pb-[12px] flex justify-between items-center transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-black text-white"
                            : "bg-[#f3f3f4] hover:bg-[#e4e4e5]"
                        }`}
                      >
                        <div className="flex items-center gap-[8px]">
                          <DiamondIcon filled={isSelected} />
                          <span className={isSelected ? "" : ""}>
                            {race.charAt(0).toUpperCase() + race.slice(1)}
                          </span>
                        </div>
                        <div className="font-mono">
                          {(confidence * 100).toFixed(1)}%
                        </div>
                      </button>
                    );
                  })}

              {selectedCategory === "age" &&
                result?.data?.age &&
                Object.entries(result.data.age)
                  .sort(([, a], [, b]) => b - a)
                  .map(([age, confidence], index) => {
                    const isSelected =
                      selectedAge === age || (!selectedAge && index === 0);

                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedAge(age)}
                        className={`w-full pr-[16px] pl-[16px] pt-[12px] pb-[12px] flex justify-between items-center transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-black text-white"
                            : "bg-[#f3f3f4] hover:bg-[#e4e4e5]"
                        }`}
                      >
                        <div className="flex items-center gap-[8px]">
                          <DiamondIcon filled={isSelected} />
                          <span className={isSelected}>{age}</span>
                        </div>
                        <div className="font-mono">
                          {(confidence * 100).toFixed(1)}%
                        </div>
                      </button>
                    );
                  })}

              {selectedCategory === "gender" &&
                result?.data?.gender &&
                Object.entries(result.data.gender)
                  .sort(([, a], [, b]) => b - a)
                  .map(([gender, confidence], index) => {
                    const isSelected =
                      selectedGender === gender ||
                      (!selectedGender && index === 0);

                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedGender(gender)}
                        className={`w-full pr-[16px] pl-[16px] pt-[12px] pb-[12px] flex justify-between items-center transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-black text-white"
                            : "bg-[#f3f3f4] hover:bg-[#e4e4e5]"
                        }`}
                      >
                        <div className="flex items-center gap-[8px]">
                          <DiamondIcon filled={isSelected} />
                          <span className={isSelected ? "" : ""}>
                            {gender.charAt(0).toUpperCase() + gender.slice(1)}
                          </span>
                        </div>
                        <div className="font-mono">
                          {(confidence * 100).toFixed(1)}%
                        </div>
                      </button>
                    );
                  })}
            </div>
          </div>
        </div>
      </div>
      <div ref={bottomSectionRef} className="flex justify-between items-center px-[42px] py-[36px]">
        <div className="transform-none rotate-0 relative">
          <BackButton onNavigate={() => handleNavigateOut()} />
        </div>
        <div className="text-[12px] text-gray-600">
          If A.I. estimate is wrong, select the correct one.
        </div>
        <div className="flex gap-[12px]">
          <button
            onClick={handleConfirm}
            className=" cursor-pointer px-[16px] py-[8px] bg-black text-white text-[12px] hover:bg-white hover:text-black hover:border-1"
          >
            CONFIRM
          </button>
        </div>
      </div>
    </div>
  );
}

export default AnalysisPage;
