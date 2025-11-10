// import React from "react";
// import { useParams } from "react-router-dom";
// import RenderFromDB from "../RenderFromDB";

// export default function RenderPage() {
//   const { id } = useParams();
//   return <RenderFromDB componentId={id} />;
// }

import React from "react";
import { useParams } from "react-router-dom";
import RenderFromDB from "../RenderFromDB";

export default function RenderPage() {
  const { id } = useParams();
  return <RenderFromDB componentId={id} />;
}
