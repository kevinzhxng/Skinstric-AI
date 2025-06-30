"use client";

import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useRef, useState, useEffect } from "react";
import InitialLoading from "./components/InitialLoading";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);

  const sophisticatedRef = useRef(null);
  const skincareRef = useRef(null);
  const leftGroupRef = useRef(null);
  const rightGroupRef = useRef(null);

  //diamond refs for animation
  const leftOuterDiamondRef = useRef(null);
  const leftInnerDiamondRef = useRef(null);
  const rightOuterDiamondRef = useRef(null);
  const rightInnerDiamondRef = useRef(null);

  //button refs for animation
  const leftInnerDottedButtonRef = useRef(null);
  const leftOuterButtonRef = useRef(null);
  const rightInnerDottedButtonRef = useRef(null);
  const rightOuterButtonRef = useRef(null);
  const discoverAIText = useRef(null);
  const takeTestText = useRef(null);

  useEffect(() => {
    //checks if page refresh by looking at performance navigation type
    const isRefresh =
      performance.navigation.type === 1 ||
      (typeof window !== "undefined" &&
        window.performance &&
        window.performance.getEntriesByType("navigation")[0]?.type ===
          "reload");

    //skip loading if its not a refresh
    if (!isRefresh) {
      setIsLoading(false);
      setHasInitialized(true);
    }
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setHasInitialized(true);
  };

  // Entrance animations for main content
  useEffect(() => {
    if (hasInitialized && !isLoading) {
      // Set initial state - text positioned below center
      gsap.set([sophisticatedRef.current, skincareRef.current], {
        y: 100, // Start 100px below their final position
        opacity: 0,
      });

      gsap.set([leftGroupRef.current, rightGroupRef.current], {
        opacity: 0,
      });

      // Animate text emerging from below
      gsap.to(sophisticatedRef.current, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.2,
      });

      gsap.to(skincareRef.current, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.2,
      });

      gsap.to(leftGroupRef.current, {
        opacity: 1,
        duration: 2,
        ease: "power3.out",
        delay: 0.4,
      });

      gsap.to(rightGroupRef.current, {
        opacity: 1,
        duration: 2,
        ease: "power3.out",
        delay: 0.4,
      });
    }
  }, [hasInitialized, isLoading]);

  //this handler for TAKE TEST button
  const handleTakeTestHover = () => {
    //moves text to left
    gsap.to(sophisticatedRef.current, {
      x: -(window.innerWidth / 2) + 240, //moves left by 40% of viewport width
      duration: 1,
      ease: "power3.out",
    });
    gsap.to(skincareRef.current, {
      x: -(window.innerWidth / 2) + 163,
      duration: 1,
      ease: "power3.out",
    });
    //move DISCOVER AI off the screen
    gsap.to(leftGroupRef.current, {
      x: "-50vw",
      duration: 0.7,
      ease: "power3.out",
    });

    // Expand right diamond
    gsap.to(rightOuterDiamondRef.current, {
      scale: 1,
      opacity: 1,
      duration: 1,
      ease: "power2.out",
    });
    gsap.to(rightInnerDiamondRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
    });

    // Expand right button - outer button scales up first
    gsap.to(rightOuterButtonRef.current, {
      scale: 2.0,
      duration: 0.6,
      ease: "power2.out",
    });

    // Inner dotted button appears with slight delay
    gsap.to(rightInnerDottedButtonRef.current, {
      scale: 1.6,
      opacity: 1,
      duration: 0.6,
      ease: "power2.out",
    });

    gsap.to(takeTestText.current, {
      translateX: -28,
      duration: 0.6,
      ease: "power2.out",
    });
  };

  const handleTakeTestLeave = () => {
    //to prevent the animations to freeze and stay displayed on the screen
    gsap.killTweensOf([
      sophisticatedRef.current,
      skincareRef.current,
      leftGroupRef.current,
      rightOuterDiamondRef.current,
      rightInnerDiamondRef.current,
      rightInnerDottedButtonRef.current,
      rightOuterButtonRef.current,
      takeTestText.current,
    ]);

    gsap.to(sophisticatedRef.current, {
      x: 0, //moves left by 40% of viewport width
      duration: 1,
      ease: "power3.out",
    });
    gsap.to(skincareRef.current, {
      x: 0, //moves left by 40% of viewport width
      duration: 1,
      ease: "power3.out",
    });
    gsap.to(leftGroupRef.current, {
      x: "0vw",
      duration: 1,
      ease: "power3.out",
    });

    //contract right diamond
    gsap.to(rightOuterDiamondRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
    });
    gsap.to(rightInnerDiamondRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
    });

    //contract right button
    gsap.to(rightInnerDottedButtonRef.current, {
      scale: 1,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
    });
    gsap.to(rightOuterButtonRef.current, {
      scale: 1,
      duration: 0.6,
      ease: "power2.out",
    });

    gsap.to(takeTestText.current, {
      translateX: 0,
      duration: 0.6,
      ease: "power2.out",
    });
  };

  //this is handler for  DISCOVER AI button
  const handleDiscoverAIHover = () => {
    //moves text to right
    gsap.to(sophisticatedRef.current, {
      x: window.innerWidth / 2 - 240, //moves left by 40% of viewport width
      duration: 1,
      ease: "power3.out",
    });
    gsap.to(skincareRef.current, {
      x: window.innerWidth / 2 - 160,
      duration: 1,
      ease: "power3.out",
    });
    gsap.to(rightGroupRef.current, {
      x: "50vw",
      duration: 1,
      ease: "power3.out",
    });

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

    //move Discover AI right
    gsap.to(discoverAIText.current, {
      translateX: 28,
      duration: 0.6,
      ease: "power2.out",
    });
  };

  const handleDiscoverAILeave = () => {
    //to prevent the animations to freeze and stay on the screen
    gsap.killTweensOf([
      sophisticatedRef.current,
      skincareRef.current,
      rightGroupRef.current,
      leftOuterDiamondRef.current,
      leftInnerDiamondRef.current,
      leftInnerDottedButtonRef.current,
      leftOuterButtonRef.current,
      discoverAIText.current,
    ]);

    gsap.to(sophisticatedRef.current, {
      x: 0, //moves left by 40% of viewport width
      duration: 1,
      ease: "power3.out",
    });
    gsap.to(skincareRef.current, {
      x: 0,
      duration: 1,
      ease: "power3.out",
    });
    gsap.to(rightGroupRef.current, {
      x: "0vw",
      duration: 1,
      ease: "power3.out",
    });

    //contract left diamond
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

    //contract left button
    gsap.to(leftInnerDottedButtonRef.current, {
      scale: 1,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
    });

    gsap.to(leftOuterButtonRef.current, {
      scale: 1,
      duration: 0.6,
      ease: "power2.out",
    });

    //move Discover AI Text back
    gsap.to(discoverAIText.current, {
      translateX: 0,
      duration: 0.6,
      ease: "power2.out",
    });
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Show loading screen only on page refresh */}
      {isLoading && (
        <InitialLoading onLoadingComplete={handleLoadingComplete} />
      )}

      {/* Main content - only show after loading is complete */}
      {hasInitialized && (
        <>
          {/* left diamond */}
          <div>
            <div
              ref={leftGroupRef}
              className="absolute inset-y-0 left-0 flex items-center h-full z-10"
            >
              {/* Diamond */}
              <div className="relative">
                <div className="absolute top-1/2 left-0 w-[360px] h-[360px] border-dotted border-[1.5px] border-gray-400 transform rotate-45 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                <div
                  ref={leftInnerDiamondRef}
                  className="absolute top-1/2 left-0 w-[400px] h-[400px] border-dotted border-[1.5px] border-[#b7bcc5] transform rotate-45 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 scale-80"
                ></div>
                <div
                  ref={leftOuterDiamondRef}
                  className="absolute top-1/2 left-0 w-[440px] h-[440px] border-dotted border-[1.5px] border-gray-300 transform rotate-45 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 scale-80"
                ></div>
              </div>
              {/* Button group */}
              <div
                className="flex items-center gap-5 ml-10"
                onMouseEnter={handleDiscoverAIHover}
                onMouseLeave={handleDiscoverAILeave}
              >
                <div
                  className="relative cursor-pointer"
                  onClick={() => router.push("/about")}
                >
                  {/* rotated box */}
                  <div
                    ref={leftOuterButtonRef}
                    className="w-8 h-8 border-[0.5px] border-black rotate-45 bg-white"
                  ></div>

                  <div
                    ref={leftInnerDottedButtonRef}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-dotted border-[1px] border-[#b7bcc5] rotate-45 bg-transparent opacity-0 scale-80"
                  ></div>

                  {/* centered triangle */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-0 h-0 border-t-[5px] border-b-[5px] border-r-[8px] border-t-transparent border-b-transparent border-r-black -translate-x-0.5"></div>
                  </div>
                </div>
                <button
                  ref={discoverAIText}
                  className="text-[9px] cursor-pointer bg-transparent border-none outline-none"
                  onClick={() => router.push("/about")}
                  type="button"
                >
                  DISCOVER A.I
                </button>
              </div>
            </div>
          </div>

          <div
            ref={rightGroupRef}
            className="absolute inset-y-0 right-0 flex items-center h-full z-10"
          >
            {/* Diamond */}
            <div
              className="absolute top-1/2 right-0 w-[360px] h-[360px] 
            border-dotted border-[1.5px] border-gray-400 transform rotate-45 
            translate-x-1/2 -translate-y-1/2 pointer-events-none"
            ></div>
            <div
              ref={rightInnerDiamondRef}
              className="absolute top-1/2 right-0 w-[400px] h-[400px] border-dotted border-[1.5px] border-[#b7bcc5] transform rotate-45 translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 scale-80"
            ></div>
            <div
              ref={rightOuterDiamondRef}
              className="absolute top-1/2 right-0 w-[440px] h-[440px] border-dotted border-[1.5px] border-gray-300 transform rotate-45 translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 scale-80"
            ></div>

            {/* Button group */}
            <div
              className="flex items-center gap-5 mr-10 z-10"
              onMouseEnter={handleTakeTestHover}
              onMouseLeave={handleTakeTestLeave}
            >
              <button
                ref={takeTestText}
                className="text-[9px] cursor-pointer bg-transparent border-none outline-none"
                onClick={() => router.push("/testing")}
                type="button"
              >
                TAKE TEST
              </button>
              <div
                className="relative cursor-pointer"
                onClick={() => router.push("/testing")}
              >
                {/* rotated box */}
                <div
                  ref={rightOuterButtonRef}
                  className="w-8 h-8 border-[0.5px] border-black -rotate-45 bg-white"
                ></div>

                <div
                  ref={rightInnerDottedButtonRef}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-dotted border-[1px] border-[#b7bcc5] -rotate-45 bg-transparent opacity-0 scale-80"
                ></div>

                {/* centered triangle */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-0 h-0 border-t-[5px] border-b-[5px] border-l-[8px] border-t-transparent border-b-transparent border-l-black translate-x-0.5"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute top-[45%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div
              ref={sophisticatedRef}
              className="text-[76px] font-normal text-center leading-[1] tracking-[-0.04em]"
            >
              Sophisticated
            </div>

            <div
              ref={skincareRef}
              className="text-[76px] font-normal text-center leading-[1] tracking-[-0.04em]"
            >
              skincare
            </div>
          </div>

          <div className="absolute bottom-8 left-8 max-w-xs z-10">
            <p className="text-xs leading-5.5">
              SKINSTRIC DEVELOPED AN A.I. THAT CREATES A<br />
              HIGHLY-PERSONALIZED ROUTINE TAILORED TO
              <br />
              WHAT YOUR SKIN NEEDS.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
