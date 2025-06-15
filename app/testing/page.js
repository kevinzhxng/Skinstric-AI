"use client";

export default function TestingPage() {
  return (
    <div className="">
      <div className="absolute p-8 text-xs font-semibold mt-14">
        <p>TO START ANALYSIS</p>
      </div>
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex w-full items-center justify-center gap-84">
          {/* Left Diamond Button */}
          <div className="relative flex flex-col items-center">
            <div className="w-64 h-64 flex items-center justify-center transform rotate-45 border-2 border-gray-300 border-dotted">
              <div className="w-40 h-40 flex items-center justify-center bg-white rounded-full shadow-lg transform -rotate-45">
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
              </div>
            </div>
            <div className="absolute left-0 top-full mt-4 w-40 text-center text-xs font-light">
              ALLOW A.I. TO SCAN
              <br />
              YOUR FACE
            </div>
          </div>

          {/* Right Diamond Button */}
          <div className="relative flex flex-col items-center">
            <div className="w-64 h-64 flex items-center justify-center transform rotate-45 border-2 border-gray-300 border-dotted">
              <div className="w-40 h-40 flex items-center justify-center bg-white rounded-full shadow-lg transform -rotate-45">
                {/* Gallery Icon (SVG) */}
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
              </div>
            </div>
            <div className="absolute right-0 top-full mt-4 w-40 text-center text-xs font-light">
              ALLOW A.I. ACCESS
              <br />
              GALLERY
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
