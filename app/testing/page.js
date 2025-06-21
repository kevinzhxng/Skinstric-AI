"use client"; //so i can add interactivity

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import ContinueButton from "../components/ContinueButton";
import BackButton from "../components/BackButton";

export default function TestingPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [cameraMode, setCameraMode] = useState(false);

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
      <div className="absolute p-8 text-xs font-semibold mt-14">
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
              <div className="w-64 h-64 flex items-center justify-center transform rotate-45 border-2 border-gray-300 border-dotted">
                <button
                  className="w-40 h-40 flex items-center justify-center bg-white rounded-full shadow-lg transform -rotate-45"
                  onClick={handleOpenCamera}
                >
                  {/* Camera Icon (SVG) */}
                  <svg
                    width="64"
                    height="64"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="black"
                  >
                    <circle cx="12" cy="12" r="8" strokeWidth="2" />
                    <path
                      d="M8 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0z"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
              </div>
              <div className="absolute left-0 top-full mt-4 w-40 text-center text-xs font-light">
                ALLOW A.I. TO SCAN
                <br />
                YOUR FACE
              </div>
            </div>
          )}

          {/* Right Diamond Button */}
          <div className="relative flex flex-col items-center">
            <div className="w-64 h-64 flex items-center justify-center transform rotate-45 border-2 border-gray-300 border-dotted">
              <button
                className="w-40 h-40 flex items-center justify-center bg-white rounded-full shadow-lg transform -rotate-45 cursor-pointer"
                onClick={() => fileInputRef.current.click()}
              >
                <svg
                  width="64"
                  height="64"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="black"
                >
                  <circle cx="12" cy="12" r="8" strokeWidth="2" />
                  <rect x="8" y="12" width="8" height="4" strokeWidth="2" />
                  <circle cx="12" cy="14" r="1" fill="black" />
                </svg>
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
            <div className="absolute right-0 top-full mt-4 w-40 text-center text-xs font-light">
              ALLOW A.I. TO ACCESS
              <br />
              GALLERY
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
