import "./App.css";
import axios from "axios";
import { useState } from "react";

let cnt = 0;
function App() {
  let s1 = "";
  let combinedBinaryFormatOfChunks = "";
  const [fileName, setFileName] = useState();
  const getChunksOfDocuments = async (documentId, propertyId) => {
    let dataToPost = {
      document_id: documentId,
      property_id: propertyId,
      chunk_number: cnt,
      chunk_size: 2000000,
    };
    await axios
      .post(`/sam/v1/property/auth/property-docs`, dataToPost, {
        headers: {
          Authorization:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRob3JpemVkIjp0cnVlLCJlbWFpbCI6ImFkbWluQHNhbXRvb2wuY29tIiwiZXhwIjoxNjg1MTAwMjc5LCJpc3N1ZWRUaW1lIjoiMjAyMy0wNS0xOVQxMjo0NDozOS43MTgxMjU3NzRaIiwicm9sZSI6IkFkbWluLCIsInVzZXJpZCI6MX0.aSmwR_af6mH-1_hLO6TzcM1Dy0736i17YPt27hwLNTQ",
        },
      })
      .then(async (res) => {
        if (s1 !== res.data.data) {
          s1 += res.data.data;
          // console.log(res.data.data);
          combinedBinaryFormatOfChunks += window.atob(res.data.data);
          if (res.data.last_chunk !== true) {
            cnt += 1;
            getChunksOfDocuments();
          } else {
            let dataString = "";
            setFileName(res.data.file_name);
            let fileExtension = res.data.file_name.split(".")[1];
            if (fileExtension === "pdf") {
              // setTypeOfFile("pdf");
              dataString = "data:application/pdf;base64,";
            } else if (
              fileExtension === "jpg" ||
              fileExtension === "jpeg" ||
              fileExtension === "png"
            ) {
              // setTypeOfFile("image");
              // document.getElementById("exampleModal").classList.add("show");
              dataString = `data:image/${fileExtension};base64,`;
            }
            let originalBase64 = window.btoa(combinedBinaryFormatOfChunks);
            const base64Data = originalBase64;
            const base64Response = await fetch(`${dataString}${base64Data}`);
            const blob = await base64Response.blob();
            window.open(URL.createObjectURL(blob));
          }
        }
      });
  };

  const [ObjUrl, setObjUrl] = useState("");
  const [typeOfFile, setTypeOfFile] = useState("");

  // const onDownloadBtnClick = async () => {
  //   let dataString = "";
  //   if (fileExtension === "pdf") {
  //     setTypeOfFile("pdf");
  //     dataString = "data:application/pdf;base64,";
  //   } else if (
  //     fileExtension === "jpg" ||
  //     fileExtension === "jpeg" ||
  //     fileExtension === "png"
  //   ) {
  //     setTypeOfFile("image");
  //     dataString = `data:image/${fileExtension};base64,`;
  //   }
  //   const base64Data = originalBase64;
  //   const base64Response = await fetch(`${dataString}${base64Data}`);
  //   const blob = await base64Response.blob();
  //   let href = URL.createObjectURL(blob);
  //   const a = Object.assign(document.createElement("a"), {
  //     href,
  //     style: "display:none",
  //     download: `${fileName.split(".")[0]}.${fileExtension}`,
  //   });
  //   document.body.appendChild(a);
  //   a.click();
  //   URL.revokeObjectURL(href);
  //   a.remove();
  // };
  return (
    <div className="App">
      <div className="container my-5">
        <div className="row">
          <div className="col-md-3 mt-md-0 mt-3">
            <button
              id="btn"
              // data-bs-toggle="modal"
              // data-bs-target="#exampleModal"
              className="btn btn-outline-success"
              onClick={() => {
                getChunksOfDocuments(4, 17);
              }}
            >
              View File
            </button>
          </div>
        </div>

        {/* <div
          className="modal fade"
          id={`${
            fileExtension === "jpg" ||
            fileExtension === "jpeg" ||
            fileExtension === "png"
              ? "exampleModal"
              : ""
          }`}
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
              <div className="modal-body documents-modal-body">
                <div className="container position-relative">
                  <div className="row justify-content-center">
                    <div className="col-12 px-0">
                      {fileExtension === "jpg" ||
                      fileExtension === "jpeg" ||
                      fileExtension === "png" ? (
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
        </div> */}
      </div>
      <br />
    </div>
  );
}

export default App;
