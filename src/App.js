// pages/index.js
import React, { useEffect, useRef, useState } from "react";

export default function App() {
  const [maxPages, setMaxPages] = useState();

  useEffect(() => {
    (async function () {
      // We import this here so that it's only loaded during client-side rendering.
      const pdfJS = await import("pdfjs-dist/build/pdf");
      pdfJS.GlobalWorkerOptions.workerSrc =
        window.location.origin + "/pdf.worker.min.js";
      const pdf = await pdfJS.getDocument("sample.pdf").promise;
      setMaxPages(pdf._pdfInfo.numPages);
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvasSample = document.createElement("canvas");
      let mainDiv = document.getElementById("sample");
      if (mainDiv.firstChild) {
        mainDiv.removeChild(mainDiv.firstChild);
      }
      mainDiv.appendChild(canvasSample);
      // Prepare canvas using PDF page dimensions.
      const canvas = canvasSample;
      const canvasContext = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Render PDF page into canvas context.
      const renderContext = { canvasContext, viewport };
      page.render(renderContext);
    })();
  }, []);

  return (
    <div id="sample">
      {/* <canvas ref={canvasRef} style={{ height: "100vh" }} /> */}
    </div>
  );
}
