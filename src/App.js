import "./App.css";
import axios from "axios";
import { useEffect } from "react";

let cnt = 0;
function App() {
  let s1 = "";
  const getChunksOfDocuments = async () => {
    let dataToPost = {
      document_id: 2,
      property_id: 1,
      chunk_number: cnt,
      chunk_size: 5000,
    };
    await axios
      .post(`/sam/v1/property/auth/property-docs`, dataToPost, {
        headers: {
          Authorization:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRob3JpemVkIjp0cnVlLCJlbWFpbCI6ImFkbWluQHNhbXRvb2wuY29tIiwiZXhwIjoxNjgyNDIzMTI2LCJyb2xlIjoiQWRtaW4sIiwidXNlcmlkIjoxfQ.sbTmNamYFld4Gdaks6w7ZKQY4AjNic5GIC-Yh6AFkjM",
        },
      })
      .then((res) => {
        if (res.data.data !== "") {
          cnt += 1;
          if (s1 !== res.data.data) {
            s1 += res.data.data;
          }
          getChunksOfDocuments();
        }
      });
  };
  useEffect(() => {
    getChunksOfDocuments();
    // eslint-disable-next-line
  }, []);

  // const base64 = "";
  return (
    <div className="App">
      <button
        onClick={() => {
          console.log(s1);
        }}
      >
        Check
      </button>
    </div>
  );
}

export default App;
