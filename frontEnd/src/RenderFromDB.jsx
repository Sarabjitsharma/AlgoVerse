// import React, { useEffect, useState } from "react";
// import * as Babel from "@babel/standalone";
// import * as LucideIcons from "lucide-react";

// export default function RenderFromDB({ componentId }) {
//   const [Component, setComponent] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await fetch(`http://localhost:8000/get-jsx/${componentId}`);
//         const data = await res.json();

//         if (!data.jsx) throw new Error("No JSX found for this component");

//         // 🔹 1. Clean imports and exports
//         let cleanCode = data.jsx
//           .replace(/^\s*import[^;]+;?/gm, "")
//           .replace(/export\s+default\s+/g, "")
//           .trim();

//         // 🔹 2. Try to detect the component name dynamically
//         const nameMatch =
//           cleanCode.match(/function\s+([A-Za-z0-9_]+)/) ||
//           cleanCode.match(/const\s+([A-Za-z0-9_]+)\s*=\s*\(/) ||
//           cleanCode.match(/class\s+([A-Za-z0-9_]+)/);

//         const compName = nameMatch ? nameMatch[1] : "DefaultComponent";

//         // 🔹 3. Wrap code inside an IIFE (safe return)
//         const wrappedCode = `
//           (function() {
//             ${cleanCode}
//             return typeof ${compName} !== 'undefined' ? ${compName} : DefaultComponent;
//           })()
//         `;

//         // 🔹 4. Compile JSX → JS
//         const transformed = Babel.transform(wrappedCode, {
//           presets: ["react"],
//         }).code;

//         // 🔹 5. Evaluate safely
//         const Comp = new Function("React", "LucideIcons", "DefaultComponent", transformed)(
//           React,
//           LucideIcons,
//           () => <div>⚠️ Component rendered but not found</div>
//         );

//         setComponent(() => Comp);
//         setError(null);
//       } catch (err) {
//         console.error("Error rendering JSX:", err);
//         setError(err.message);
//       }
//     };

//     load();
//   }, [componentId]);

//   if (error)
//     return <div className="p-4 text-red-500">Error rendering JSX: {error}</div>;
//   if (!Component)
//     return <div className="p-4 text-gray-400">Loading component...</div>;

//   return (
//     <div className="p-4">
//       <Component />
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import * as Babel from "@babel/standalone";

export default function RenderFromDB({ componentId }) {
  const [Component, setComponent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!componentId) return;

    async function fetchAndRender() {
      try {
        const res = await fetch(`http://localhost:8000/get-jsx/${componentId}`);
        const data = await res.json();

        if (!data.code) throw new Error("No code found in response");

        // ✅ Transform JSX → JS
        const transformed = Babel.transform(data.code, { presets: ["react"] }).code;

        // ✅ Evaluate in isolated scope
        const module = { exports: {} };
        // eslint-disable-next-line no-eval
        eval(`${transformed}; module.exports = Component || module.exports.default;`);

        setComponent(() => module.exports);
      } catch (err) {
        console.error("Error rendering JSX:", err);
        setError(err.message);
      }
    }

    fetchAndRender();
  }, [componentId]);

  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
  if (!Component) return <div>Loading component...</div>;

  const Comp = Component;
  return (
    <div style={{ padding: "20px" }}>
      <Comp />
    </div>
  );
}
