import React from "react";

const App = () => {
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
                  <button className="btn btn-warning" id="go_previous">
                    Previous
                  </button>
                </span>
                <span>
                  <input
                    className="form-control"
                    id="current_page"
                    value="1"
                    type="number"
                  />
                </span>
                <span>
                  <button className="btn btn-warning" id="go_next">
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
