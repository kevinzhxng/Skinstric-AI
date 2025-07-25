"use client"; //so i can add interactivity

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
      <div className="absolute p-8 text-[10px] font-semibold mt-14">
        <p>TO START ANALYSIS</p>
      </div>

      <div className="min-h-screen flex items-center justify-center">
        <div className="flex w-full items-center justify-center gap-84">
          {/* Left Diamond Button */}
          {cameraMode ? (
            <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
              <video
                ref={videoRef}
                className="w-full max-w-md rounded"
                autoPlay
                playsInline
              />
              <canvas ref={canvasRef} style={{ display: "none" }} />
              <button
                className="mt-4 px-6 py-2 bg-white rounded shadow font-bold"
                onClick={handleCapture}
                disabled={loading}
              >
                {loading ? "Analyzing..." : "Take Picture"}
              </button>
              <button
                className="mt-2 px-4 py-1 bg-gray-200 rounded"
                onClick={() => {
                  if (videoRef.current && videoRef.current.srcObject) {
                    videoRef.current.srcObject
                      .getTracks()
                      .forEach((track) => track.stop());
                  }
                  setCameraMode(false);
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="relative flex flex-col items-center">
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
          <div className="relative flex flex-col items-center">
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
                    stroke-width="2"
                  ></circle>
                  <path
                    d="M78.321 68c7.042 0 12.75-5.708 12.75-12.75S85.363 42.5 78.321 42.5c-7.041 0-12.75 5.708-12.75 12.75S71.28 68 78.321 68Z"
                    fill="#1A1B1C"
                  ></path>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
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
      <div className="fixed bottom-8 left-18 transform -translate-x-1/2 z-50">
        <BackButton no />
      </div>
    </div>
  );
}
