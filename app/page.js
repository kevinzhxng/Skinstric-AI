"use client"

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  
  return (
    <div className="relative h-screen">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="text-[86px] font-semi-semi-bold text-center leading-[1]">
          Sophisticated
          <br />
          skincare
        </div>
      </div>
      <div className="absolute inset-y-0 left-0 flex items-center cursor-pointer">
        <button className="ml-12 text-xs" onClick={() => router.push("/about")}>DISCOVER A.I</button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center">
        <button
          className="mr-12 text-xs cursor-pointer"
          onClick={() => router.push("/testing")}
        >
          TAKE TEST
        </button>
      </div>
    </div>
  );
}
