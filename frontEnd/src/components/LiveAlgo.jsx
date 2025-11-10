import React, { useEffect, useState } from "react";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import { useParams } from "react-router-dom";
import * as Icons from "lucide-react";

export default function LiveAlgo() {
  const { id } = useParams();
  const [algo, setAlgo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlgo = async () => {
      try {
        const res = await fetch(`https://algo-verse-7sci.vercel.app/get-algo/${id}`);
        const data = await res.json();
        setAlgo(data);
      } catch (err) {
        console.error("Error fetching algorithm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlgo();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!algo) return <div>Algorithm not found</div>;

  // 🧹 Clean the fetched code
  const cleanCode = algo.code
    // Remove imports since React Live already provides them
    .replace(/import\s+.*from\s+['"].*['"];?/g, "")
    // Remove exports if any
    .replace(/export\s+default\s+\w+;?/g, "")
    // Keep the render(<DFS />); line — React Live will execute it
    .trim();

  // 🧠 Define scope (everything React Live can "see")
  const scope = {
    React,
    ...React,
    ...Icons,
    console,
    setTimeout,
    clearTimeout,
    window,
    document,
  };

  return (
    <div className="p-6">
      <LiveProvider code={cleanCode} scope={scope} noInline>
        {/* <div className="grid grid-cols-2 gap-4"> */}
          {/* Right: Live output preview */}
            <LivePreview />
          {/* </div> */}
        {/* </div> */}

        {/* Show live runtime errors */}
        <div className="text-red-500 mt-2">
          <LiveError />
        </div>
      </LiveProvider>
    </div>
  );
}
