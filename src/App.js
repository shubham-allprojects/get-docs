import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { pdfData, imageData } from "./Data";
let cnt = 0;
function App() {
  let s1 = "";
  const [fileName, setFileName] = useState();
  const [fileExtension, setFileExtension] = useState();
  const getChunksOfDocuments = async () => {
    let dataToPost = {
      document_id: 1,
      property_id: 1,
      chunk_number: cnt,
      chunk_size:500,
    };
    await axios
      .post(`/sam/v1/property/auth/property-docs`, dataToPost, {
        headers: {
          Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRob3JpemVkIjp0cnVlLCJlbWFpbCI6ImFkbWluQHNhbXRvb2wuY29tIiwiZXhwIjoxNjgyNjA2MzE1LCJyb2xlIjoiQWRtaW4sIiwidXNlcmlkIjoxfQ.82R4c3cgNDnFNVNPG_9sMv0uarjoHW1ST2qE1LsKPzw",
        },
      })
      .then((res) => {
        let totalChunks;
        if (s1 !== res.data.data) {
          s1 += res.data.data;
        }

        //   if (cnt === 0) {
        //     setFileName(res.data.file_name.split(".")[0]);
        //     setFileExtension(res.data.file_name.split(".")[1]);
        //   }

        if (res.data.last_chunk !== true) {
          totalChunks = Math.ceil(
            res.data.total_file_size / res.data.chunk_size
          );
          console.log(totalChunks);
          cnt += 1;
          if (cnt <= totalChunks - 1) {
            getChunksOfDocuments();
          }
        }
      });
  };
  useEffect(() => {
    getChunksOfDocuments();
    // eslint-disable-next-line
  }, []);

  const [ObjUrl, setObjUrl] = useState("");
  const [typeOfFile, setTypeOfFile] = useState("");
  const onBtnClick = async (base64DataFromDB, fileExtension) => {
    let dataString = "";
    if (fileExtension === "pdf") {
      setTypeOfFile("pdf");
      dataString = "data:application/pdf;base64,";
    } else if (
      fileExtension === "jpg" ||
      fileExtension === "jpeg" ||
      fileExtension === "png"
    ) {
      setTypeOfFile("image");
      dataString = `data:image/${fileExtension};base64,`;
    }
    const base64Data = base64DataFromDB;
    const base64Response = await fetch(`${dataString}${base64Data}`);
    const blob = await base64Response.blob();
    console.log(blob);
    setObjUrl(URL.createObjectURL(blob));
    // window.open(URL.createObjectURL(blob));
  };

  return (
    <div className="App">
      <div className="container my-5">
        <button
          onClick={() => {
            console.log(s1);
          }}
          className="mx-2 btn btn-primary"
        >
          see combined chunk data
        </button>
        <button
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          className="btn btn-outline-success"
          onClick={() => {
            onBtnClick(pdfData, "pdf");
          }}
        >
          View PDF
        </button>

        <button
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          className="btn btn-outline-success ms-2"
          onClick={() => {
            onBtnClick(imageData, "png");
          }}
        >
          View Image
        </button>

        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body" style={{ height: "600px" }}>
                <div className="container position-relative">
                  <div className="row justify-content-center">
                    <div className="col-md-10">
                      {typeOfFile === "image" ? (
                        <img src={ObjUrl} alt="" className="h-100 w-100" />
                      ) : typeOfFile === "pdf" ? (
                        <>
                          <iframe
                            title="pdf-docs"
                            style={{ height: "500px" }}
                            className="w-100"
                            type="application/pdf"
                            src={ObjUrl}
                            frameBorder="0"
                          ></iframe>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
    </div>
  );
}

export default App;
