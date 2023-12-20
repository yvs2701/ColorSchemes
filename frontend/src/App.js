import { useState, useEffect } from "react";
import { sampleImg } from "./components/sampleImageBase64";

function App() {

  const [noOfColors, setNoOfColors] = useState(7);
  const [uploading, setUploading] = useState(false);
  const [imgData, setImgData] = useState(sampleImg);
  const [colors, setColors] = useState({
    "hex_colors": ["#1c374a", "#dadaee", "#948e99", "#9fc9e4", "#ece2ee", "#4d6275", "#c0d2e9"],
    "rgb_colors": [[28, 55, 74], [218, 218, 238], [148, 142, 153], [159, 201, 228], [236, 226, 238], [77, 98, 117], [192, 210, 233]]
  });

  useEffect(() => {
    // TODO: FETCH AN IMAGE AND SET IT AS THE DEFAULT IMAGE
    // const timestamp = new Date()
    // const year = timestamp.getFullYear()
    // const month = timestamp.getMonth() + 1
    // const day = timestamp.getDate()
    // const imgURL = `https://picsum.photos/seed/${day}-${month}-${year}/800/450`
    // fetch(imgData)
    //   .then((res) => {
    //     console.log(res);
    //     return res.blob()
    //   })
    //   .then((data) => {
    //     console.log(URL.createObjectURL(data))
    //     setImgData(URL.createObjectURL(data))
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   });
  }, [])

  const extractColors = () => {

    const formData = new FormData()

    formData.append("imgData", imgData)
    formData.append("noOfColors", noOfColors)

    setUploading(true)

    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/extract_colors`, {
      method: "POST",
      /* headers: {
        // "Content-Type": "multipart/form-data" // NOTE: MANUALLY SETTING THIS HEADER WILL CAUSE UNEXPECTED BEHAVIOUR
      }, */
      body: formData
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setColors(data);
        setUploading(false)
      })
      .catch((err) => {
        console.log(err);
        setUploading(false)
      })
  }

  return (
    <main
      className="flex p-4 w-full bg-base-300 min-h-screen"
    >
      <section
        className="flex flex-col flex-initial bg-base-100 w-1/3 min-h-full rounded-box p-4 justify-between items-center"
      >
        {/* HEADER */}
        <h1
          className="text-5xl text-center mt-16"
        >
          Input an Image!
        </h1>

        {/* File upload */}
        <div className="fileUpload w-full h-1/2 join join-vertical">
          <input type="file" accept="image/jpeg, image/png"
            className="file-input file-input-bordered file-input-accent join-item flex-initial h-1/6"
            onChange={(e) => {
              if (e.target.files.length === 0) return
              const file = e.target.files[0]
              const reader = new FileReader()
              reader.onload = () => {
                setImgData(reader.result)
              }
              reader.readAsDataURL(file)
            }}
          />
          {/* IMAGE PREVIEW AREA */}
          <div
            className="w-full h-5/6 flex-initial join-item rounded overflow-hidden"
            style={{ background: `no-repeat center/cover url(${imgData})` }}
          >
            <img src={imgData} alt="preview image"
              className="w-full h-full object-contain"
              style={{ backdropFilter: "blur(64px)" }}
            />
          </div>
        </div>

        <div
          className="w-11/12 grouped-inputs"
        >
          {/* BUTTON GROUP */}
          <div
            className="btn-group w-full join-item flex justify-between items-center"
          >
            <button
              className="btn btn-primary w-1/3 flex-initial"
              onClick={extractColors}
            >
              {uploading === true ? <span className="loading loading-spinner"></span> : ""}
              Upload
            </button>
            <button
              className="btn btn-secondary w-1/3 flex-initial"
              onClick={() => {
                alert("This feature is still under development!");
              }}
            >
              Random
            </button>
          </div>

          {/* RANGE INPUT */}
          <div
            className="inputRange w-full mt-4"
          >
            <input type="range" min="2" max="8"
              className="range range-accent w-full" step="1"
              value={noOfColors} onChange={(e) => setNoOfColors(e.target.value)} />
            <div className="w-full flex justify-between text-xs px-2">
              {[2, 3, 4, 5, 6, 7, 8].map((n) => (
                <span key={n} className="text-center">{n}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
      <div className="divider divider-horizontal divider-neutral mt-2"></div>
      <section
        className="flex-initial bg-base-100 w-2/3 min-h-full rounded-box join join-horizontal"
      >
        {
          colors?.hex_colors?.map((color, idx) => (
            <div
              key={idx}
              className="colorTheme flex justify-center items-center join-item border-base-100 w-full"
              style={{ backgroundColor: color }}
            >
              <span
                className="text-4xl text-center font-bold contrastingText"
                style={{ writingMode: "sideways-lr" }}
              >
                {color}
              </span>
            </div>
          ))
        }
      </section>
    </main >
  );
}

export default App
