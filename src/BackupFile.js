import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";

let cnt = 0;
function BackupFile() {
  let s1 = "";
  let combinedBinaryFormatOfChunks = "";
  const [fileName, setFileName] = useState();
  const [fileExtension, setFileExtension] = useState();
  const [originalBase64, setOriginalBase64] = useState();
  const getChunksOfDocuments = async () => {
    let dataToPost = {
      document_id: 2,
      property_id: 17,
      chunk_number: cnt,
      chunk_size: 2000000,
    };
    await axios
      .post(`/sam/v1/property/auth/property-docs`, dataToPost, {
        headers: {
          Authorization:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRob3JpemVkIjp0cnVlLCJlbWFpbCI6ImFkbWluQHNhbXRvb2wuY29tIiwiZXhwIjoxNjkwMzI4MDA0LCJpc3N1ZWRUaW1lIjoiMjAyMy0wNS0xN1QxMjo1MzoyNC42NDA1OTM5NThaIiwicm9sZSI6IkFkbWluLCIsInVzZXJpZCI6MX0.wrjXxLShj1vnhu_G3TGbQXHcmNmBAK5bOySgZHbjEJE",
        },
      })
      .then((res) => {
        if (s1 !== res.data.data) {
          s1 += res.data.data;
          // console.log(res.data.data);
          combinedBinaryFormatOfChunks += window.atob(res.data.data);
          if (res.data.last_chunk !== true) {
            cnt += 1;
            getChunksOfDocuments();
          } else {
            setFileName(res.data.file_name);
            console.log(res.data);
            let extension = res.data.file_name.split(".")[1];
            setFileExtension(extension);
            console.log(extension);
            if (extension === "pdf") {
              document.getElementById("btn").removeAttribute("data-bs-toggle");
              document.getElementById("btn").removeAttribute("data-bs-target");
            }
            setOriginalBase64(window.btoa(combinedBinaryFormatOfChunks));
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
  const onViewButtonClick = async () => {
    let dataString = "";
    if (fileExtension === "pdf") {
      // setTypeOfFile("pdf");
      dataString = "data:application/pdf;base64,";
    } else if (
      fileExtension === "jpg" ||
      fileExtension === "jpeg" ||
      fileExtension === "png"
    ) {
      // setTypeOfFile("image");
      document.getElementById("exampleModal").classList.add("show");
      dataString = `data:image/${fileExtension};base64,`;
    }
    const base64Data = originalBase64;
    const base64Response = await fetch(`${dataString}${base64Data}`);
    const blob = await base64Response.blob();
    console.log(blob);
    setObjUrl(URL.createObjectURL(blob));

    if (fileExtension === "pdf") {
      window.open(URL.createObjectURL(blob));
    }
  };

  const onDownloadBtnClick = async () => {
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
    const base64Data = originalBase64;
    const base64Response = await fetch(`${dataString}${base64Data}`);
    const blob = await base64Response.blob();
    let href = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), {
      href,
      style: "display:none",
      download: `${fileName.split(".")[0]}.${fileExtension}`,
    });
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(href);
    a.remove();
  };
  return (
    <div className="App">
      <div className="container my-5">
        <div className="row">
          <div className="col-md-3">
            <button
              onClick={() => {
                console.log(originalBase64, fileName, fileExtension);
              }}
              className="mx-2 btn btn-primary"
            >
              Full chunk
            </button>
          </div>
          <div className="col-md-3 mt-md-0 mt-3">
            <button className="btn btn-primary" onClick={onDownloadBtnClick}>
              Download File
            </button>
          </div>
          <div className="col-md-3 mt-md-0 mt-3">
            <button
              id="btn"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              className="btn btn-outline-success"
              onClick={onViewButtonClick}
            >
              View File
            </button>
          </div>
        </div>

        <div
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
        </div>
      </div>
      <br />
    </div>
  );
}

export default BackupFile;
