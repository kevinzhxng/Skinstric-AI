"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import ContinueButton from "../components/ContinueButton";
import BackButton from "../components/BackButton";
import gsap from "gsap";

export default function TestingPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [cameraMode, setCameraMode] = useState(false);

  //animating the dotted squares
  const leftSquare1 = useRef(null);
  const leftSquare2 = useRef(null);
  const leftSquare3 = useRef(null);

  const rightSquare1 = useRef(null);
  const rightSquare2 = useRef(null);
  const rightSquare3 = useRef(null);

  //initial loading effect
  const toStartAnalysisTextRef = useRef(null);
  const cameraRef = useRef(null);
  const galleryRef = useRef(null);

  useEffect(() => {
    //left squares
    gsap.to(leftSquare1.current, {
      rotate: 405, // 360 + 45 to keep diamond at 45 degrees
      duration: 65,
      repeat: -1,
      ease: "linear",
    });
    gsap.to(leftSquare2.current, {
      rotate: 405, // 360 + 45 to keep diamond at 45 degrees
      duration: 78,
      repeat: -1,
      ease: "linear",
    });
    gsap.to(leftSquare3.current, {
      rotate: 405, // 360 + 45 to keep diamond at 45 degrees
      duration: 91,
      repeat: -1,
      ease: "linear",
    });

    //right squares
    gsap.to(rightSquare1.current, {
      rotate: 405, // 360 + 45 to keep diamond at 45 degrees
      duration: 65,
      repeat: -1,
      ease: "linear",
    });
    gsap.to(rightSquare2.current, {
      rotate: 405, // 360 + 45 to keep diamond at 45 degrees
      duration: 78,
      repeat: -1,
      ease: "linear",
    });
    gsap.to(rightSquare3.current, {
      rotate: 405, // 360 + 45 to keep diamond at 45 degrees
      duration: 91,
      repeat: -1,
      ease: "linear",
    });
  });

  useEffect(() => {
    gsap.to(toStartAnalysisTextRef.current, {
      opacity: 1,
      duration: 1.5,
      ease: "power2.out",
    });

    gsap.to(cameraRef.current, {
      opacity: 1,
      x: 0,
      duration: 1,
      ease: "power2.out",
      delay: 0.2,
    });
    gsap.to(galleryRef.current, {
      opacity: 1,
      x: 0,
      duration: 1,
      ease: "power2.out",
      delay: 0.4,
    });
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

  //starts the camera
  const handleOpenCamera = async () => {
    setCameraMode(true);
    setTimeout(async () => {
      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    }, 100);
  };

  const handleCapture = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/png");
      await handleImageDataUrl(dataUrl);
      //stops camera
      const stream = video.srcObject;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      setCameraMode(false);
    }
  };

  const handleImageDataUrl = async (dataUrl) => {
    const base64String = dataUrl.split(",")[1];
    setLoading(true);
    try {
      const response = await fetch(
        "https://us-central1-frontend-simplified.cloudfunctions.net/skinstricPhaseTwo",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64String }),
        }
      );
      const data = await response.json();
      localStorage.setItem("analysisResult", JSON.stringify(data));
      router.push("analysis");
    } catch (err) {
      alert("failed to scan image");
    }
    setLoading(false);
  };

  const handleFileChange = async (e) => {
    //async lets me await
    const file = e.target.files[0]; //
    if (!file) {
      //if no file selected, return
      return;
    }

    const reader = new FileReader(); //creates a new FileReader to read file's data
    reader.onloadend = async () => {
      //runs the file when its done reading it
      const base64String = reader.result.split(",")[1]; //reader.result is data URL. split just gets the base64 url part
      setLoading(true);
      try {
        const response = await fetch(
          "https://us-central1-frontend-simplified.cloudfunctions.net/skinstricPhaseTwo",
          {
            method: "POST", //send data
            headers: { "Content-Type": "application/json" }, //tells server i am sending json
            body: JSON.stringify({ image: base64String }), //sending an image object with Base64 image
          }
        );
        const data = await response.json(); //waits for response and parse it in JSON
        console.log(data);
        localStorage.setItem("analysisResult", JSON.stringify(data));
        router.push("/analysis");
      } catch (err) {
        alert("Failed to scan image");
      }
      setLoading(false);
    };
    reader.readAsDataURL(file); //reads the file as data URL (base64)
  };

  return (
    <div className="">
      <div
        ref={toStartAnalysisTextRef}
        className="absolute p-8 text-[10px] font-semibold mt-14 opacity-0"
      >
        <p>TO START ANALYSIS</p>
      </div>

      <div className="min-h-screen flex items-center justify-center">
        <div className="flex w-full items-center justify-center gap-84">
          {/* Left Diamond Button */}
          {cameraMode ? (
            <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                style={{ position: "absolute", top: 0, left: 0 }}
              />

              <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                  WebkitMaskImage:
                    "radial-gradient(circle 190px at 50% 50%, transparent 180px, black 250px)",
                  maskImage:
                    "radial-gradient(circle 190px at 50% 50%, transparent 180px, black 250px)",
                  backdropFilter: "blur(6px)",
                  WebkitBackdropFilter: "blur(6px)",
                }}
              />

              <div
                className="absolute left-1/2 top-1/2 z-20"
                style={{
                  transform: "translate(-50%, -50%)",
                  width: "380px",
                  height: "500px",
                  border: "1px solid white",
                  borderRadius: "50%",
                  boxSizing: "border-box",
                  pointerEvents: "none",
                }}
              />
              <div className="absolute text-gray-300 top-50 text-xs">
                PLACE YOUR HEAD IN CIRCLE
              </div>
              <div className="absolute right-0 flex flex-col items-center z-10 pr-8">
                <canvas ref={canvasRef} style={{ display: "none" }} />

                <button
                  className="mb-4 w-20 h-20 flex items-center justify-center rounded-full bg-white shadow-lg border-2 border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-50"
                  onClick={handleCapture}
                  disabled={loading}
                >
                  {loading ? (
                    //spinning animation for camera
                    <svg
                      className="animate-spin w-8 h-8 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      ></path>
                    </svg>
                  ) : (
                    // Camera icon SVG
                    <svg
                      className="w-10 h-10 text-gray-700"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21 19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2l2-3h6l2 3h2a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div
              ref={cameraRef}
              className="relative flex flex-col items-center opacity-0 -translate-x-8"
            >
              <div className="flex items-center justify-center transform">
                <button
                  className="absolute p-16 z-20 transition-transform duration-400 hover:scale-80 ease-out cursor-pointer"
                  onClick={handleOpenCamera}
                >
                  {/* Camera Icon (SVG) */}
                  <svg
                    width="112"
                    height="112"
                    fill="none"
                    viewBox="0 0 136 136"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="68.001" cy="68" r="57.786" stroke="#1A1B1C" />
                    <circle cx="68" cy="68" r="51" fill="#1A1B1C" />
                    <path
                      d="M100.668 35.412C92.315 27.038 80.763 21.857 68 21.857a46.39 46.39 0 0 0-8.64.808c4.774 7.898 22.22 35.59 25.58 40.515.653.957 1.813-.944 8.838-14.487l6.89-13.281ZM25.088 51.004c5.493-13.858 17.506-24.422 32.253-27.91 1.746 2.619 5.081 7.793 8.726 13.555l9.26 14.642H48.886c-12.76 0-20.217-.083-23.798-.287ZM31.87 96.703A45.947 45.947 0 0 1 21.856 68c0-5.199.86-10.197 2.445-14.86h14.865c17.385 0 17.78.027 17.16 1.19-1.232 2.304-19.503 33.932-24.458 42.373ZM76.964 113.273c-2.9.57-5.897.87-8.964.87-13.808 0-26.2-6.066-34.656-15.678 1.827-4.06 6.585-12.533 14.828-26.454.775-1.31 1.56-2.23 1.745-2.045.185.184 6.687 10.554 14.45 23.042l12.597 20.265ZM111.529 83.348c-5.157 14.625-17.476 25.872-32.745 29.528-4.206-6.487-18.172-28.92-18.172-29.267 0-.143 12.07-.261 26.82-.261h24.097ZM101.902 36.697C109.5 44.922 114.143 55.919 114.143 68a46.11 46.11 0 0 1-2.199 14.115H96.597c-9.973 0-18.132-.15-18.132-.335 0-.38 19.972-38.764 23.437-45.083Z"
                      fill="#FCFCFC"
                    />
                  </svg>
                </button>

                <div
                  ref={leftSquare1}
                  className="w-60 h-60 border-2 border-gray-400 border-dotted rotate-45 "
                />
                <div
                  ref={leftSquare2}
                  className="w-66 h-66 border-2 border-[#b7bcc5] border-dotted rotate-75 absolute"
                />
                <div
                  ref={leftSquare3}
                  className="w-72 h-72 border-2 border-gray-300 border-dotted rotate-105 absolute"
                />
              </div>
              <div
                className="absolute"
                style={{
                  left: "50%",
                  top: "60%", // adjust as needed
                  width: "1px",
                  height: "60px", // adjust as needed
                  background: "black",
                  transform: "translateX(-50%)",
                }}
              />
              <div
                className="absolute text-xs font-medium text-center w-40 text-gray-600"
                style={{
                  left: "50%",
                  top: "calc(60% + 60px)", // adjust as needed to match the line
                  transform: "translateX(-50%)",
                }}
              >
                ALLOW A.I. TO SCAN
                <br />
                <span className="mt-2 inline-block">YOUR FACE</span>
              </div>
            </div>
          )}

          {/* Right Diamond Button */}
          <div
            ref={galleryRef}
            className="relative flex flex-col items-center opacity-0 -translate-x-8"
          >
            <div className="flex items-center justify-center transform">
              <button
                className="absolute p-16 z-20 transition-transform duration-400 hover:scale-80 ease-out cursor-pointer"
                onClick={() => fileInputRef.current.click()}
              >
                <svg
                  width="112"
                  height="112"
                  viewBox="0 0 136 136"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="68.001"
                    cy="68"
                    r="57.786"
                    stroke="#1A1B1C"
                  ></circle>
                  <circle
                    cx="68"
                    cy="68"
                    r="50"
                    fill="#FCFCFC"
                    stroke="#1A1B1C"
                    strokeWidth="2"
                  ></circle>
                  <path
                    d="M78.321 68c7.042 0 12.75-5.708 12.75-12.75S85.363 42.5 78.321 42.5c-7.041 0-12.75 5.708-12.75 12.75S71.28 68 78.321 68Z"
                    fill="#1A1B1C"
                  ></path>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M17 68c0 3.96.451 7.815 1.306 11.516C23.526 102.136 43.794 119 68 119c26.867 0 48.882-20.776 50.856-47.138A51.96 51.96 0 0 0 119 68c0-28.166-22.834-51-51-51S17 39.834 17 68Zm18.337-.274L19.382 78.77A49.962 49.962 0 0 1 18.215 68c0-27.496 22.29-49.786 49.786-49.786 27.496 0 49.786 22.29 49.786 49.786 0 1.541-.07 3.066-.207 4.572l-34.634 19.24a7.286 7.286 0 0 1-7.91-.54l-31.18-23.385a7.286 7.286 0 0 0-8.518-.161Z"
                    fill="#1A1B1C"
                  ></path>
                </svg>
              </button>

              <div
                ref={rightSquare1}
                className="w-60 h-60 border-2 border-gray-400 border-dotted rotate-45 "
              />
              <div
                ref={rightSquare2}
                className="w-66 h-66 border-2 border-[#b7bcc5] border-dotted rotate-75 absolute"
              />
              <div
                ref={rightSquare3}
                className="w-72 h-72 border-2 border-gray-300 border-dotted rotate-105 absolute"
              />

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>

            <div
              className="absolute"
              style={{
                left: "50%",
                top: "60%", // adjust as needed
                width: "1px",
                height: "60px", // adjust as needed
                background: "black",
                transform: "translateX(-50%)",
              }}
            />
            <div
              className="absolute text-xs font-medium text-center w-40 text-gray-600"
              style={{
                left: "50%",
                top: "calc(60% + 60px)", // adjust as needed to match the line
                transform: "translateX(-50%)",
              }}
            >
              ALLOW A.I. TO ACCESS
              <br />
              <span className="mt-2 inline-block">GALLERY</span>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-10 left-20 transform -translate-x-1/2 z-50">
        <BackButton onNavigate={() => handleNavigateOut("/")} />
      </div>
    </div>
  );
}
