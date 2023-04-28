import React, { useEffect } from "react";
// import pdfjsLib from "pdfjs-dist/build/pdf";
import * as pdfjsLib from "pdfjs-dist/webpack";
// import * as pdfjsLib from "pdfjs-dist/build/pdf";
// import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

const App = () => {
  const myState = {
    pdf: null,
    currentPage: 1,
    zoom: 1,
  };

  const render = () => {
    myState.pdf.getPage(myState.currentPage).then((page) => {
      var canvas = document.getElementById("pdf_renderer");
      var ctx = canvas.getContext("2d");
      var viewport = page.getViewport(myState.zoom);
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      page.render({
        canvasContext: ctx,
        viewport: viewport,
      });
    });
  };

  const onPrevBtnClick = (e) => {
    if (myState.pdf === null || myState.currentPage === 1) return;
    myState.currentPage -= 1;
    document.getElementById("current_page").value = myState.currentPage;
    render();
  };

  const onNextBtnClick = (e) => {
    if (
      myState.pdf === null ||
      myState.currentPage > myState.pdf._pdfInfo.numPages
    )
      return;
    myState.currentPage += 1;
    document.getElementById("current_page").value = myState.currentPage;
    render();
  };

  useEffect(() => {
    const pdfData = pdfjsLib.getDocument("sample.pdf");
    pdfData._capability.promise.then((pdf) => {
      if (myState.pdf) {
        myState.pdf.destroy();
      }
      myState.pdf = pdf;
      render();
    });
  }, []);

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-xl-10 border border-2 border-info p-5">
          <h1 className="fw-bold text-primary text-center">Pdf Viewer</h1>
          <hr />
          <div id="my_pdf_viewer" className="container-fluid">
            <div className="row">
              <div id="canvas_container" className="col-12">
                <canvas id="pdf_renderer"></canvas>
              </div>
            </div>

            <div
              id="navigation_controls"
              className="row justify-content-center mt-3"
            >
              <div className="col-xl-12 d-flex">
                <span>
                  <button
                    onClick={onPrevBtnClick}
                    className="btn btn-warning"
                    id="go_previous"
                  >
                    Previous
                  </button>
                </span>
                <span>
                  <input
                    className="form-control"
                    id="current_page"
                    value="1"
                    type="number"
                    onChange={() => {
                      // console.log("");
                    }}
                  />
                </span>
                <span>
                  <button
                    onClick={onNextBtnClick}
                    className="btn btn-warning"
                    id="go_next"
                  >
                    Next
                  </button>
                </span>
              </div>
            </div>
            <div id="zoom_controls" className="row justify-content-center mt-3">
              <div className="col-12 d-flex">
                <span>
                  <button className="btn btn-outline-primary" id="zoom_in">
                    +
                  </button>
                </span>
                <span>
                  <button
                    className="btn btn-outline-primary ms-2"
                    id="zoom_out"
                  >
                    -
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
