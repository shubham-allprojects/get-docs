import React, { useEffect, useState } from "react";

export default function App() {
  const [maxPages, setMaxPages] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  const getPdf = async (pageNumber = 1) => {
    const pdfJS = await import("pdfjs-dist/build/pdf");
    pdfJS.GlobalWorkerOptions.workerSrc =
      window.location.origin + "/pdf.worker.min.js";
    const pdf = await pdfJS.getDocument("sample.pdf").promise;
    setMaxPages(pdf._pdfInfo.numPages);
    const page = await pdf.getPage(pageNumber);
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
  };

  const onNextClick = () => {
    if (currentPage < maxPages) {
      setCurrentPage(currentPage + 1);
      getPdf(currentPage + 1);
    }
  };

  const onPrevClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      getPdf(currentPage - 1);
    }
  };

  useEffect(() => {
    getPdf(1);
  }, []);

  return (
    <>
          <div>
        <button className="btn btn-primary" onClick={onPrevClick}>
          Prev
        </button>
        currentPage = {currentPage}
        <button className="btn btn-primary" onClick={onNextClick}>
          Next
        </button>
      </div>
      <div id="sample">
        {/* <canvas ref={canvasRef} style={{ height: "100vh" }} /> */}
      </div>

    </>
  );
}
