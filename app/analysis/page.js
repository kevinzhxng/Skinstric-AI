"use client";

import { useState, useEffect } from "react";
import ContinueButton from "../components/BackButton";

function AnalysisPage() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      const stored = localStorage.getItem("analysisResult");
      if (stored) {
        setResult(JSON.parse(stored));
      }
      setLoading(false);
    }, 3000); //simulates loading
  }, []); //[] means it only runs once

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Analyzing your image...</div>;
  }

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div>No analysis data found.</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div>
        <h1 className="text-xl font-bold mb-4">Analysis Result</h1>
        <pre>{JSON.stringify(result, null, 2)}</pre> 
      </div>
  
    </div>
  )
}

export default AnalysisPage;
