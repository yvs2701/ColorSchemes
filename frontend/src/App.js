import { useState, useEffect } from "react";
import { sampleImg } from "./components/sampleImageBase64";
import { Toaster } from 'react-hot-toast';
import useToast from "./components/useToast";

function App() {

  const [noOfColors, setNoOfColors] = useState(5);
  const [uploading, setUploading] = useState(false);
  const [imgData, setImgData] = useState(sampleImg);
  const [colors, setColors] = useState({
    "hex_colors": ["#223e51", "#ccd6ed", "#737a88", "#a6c5dd", "#eae1ee"],
    "rgb_colors": [[34, 62, 81], [204, 214, 237], [115, 122, 136], [166, 197, 221], [234, 225, 238]],
  });
  const toast = useToast().toast;

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
        setColors(data);
        setUploading(false)
      })
      .catch((err) => {
        console.error(err);
        setUploading(false)
      })
  }

  return (
    <>
      <main
        className="flex p-4 w-full bg-base-300 min-h-screen"
      >

        <section
          className="flex flex-col flex-initial bg-base-100 w-1/3 min-h-full rounded-box p-4 justify-between items-center"
        >
          {/* HEADER */}
          <h1
            className="md:text-4xl lg:text-5xl text-center mt-16"
          >
            Upload an Image!
          </h1>

          {/* File upload */}
          <div className="fileUpload w-full join join-vertical">
            <input type="file" accept="image/jpeg, image/png"
              className="file-input file-input-bordered file-input-accent join-item"
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
              className="max-h-[300px] 3xl:max-h-[500px] max-w-full join-item rounded overflow-hidden"
              style={{ background: `no-repeat center/cover url(${imgData})` }}
            >
              <img src={imgData} alt="preview of uploaded file"
                className="w-full h-full object-contain backdrop-blur-3xl"
              />
            </div>
            <small className="join-item text-center text-sm">* We do not store your images! *</small>
          </div>

          <div
            className="w-full grouped-inputs"
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
        <div className="divider divider-horizontal divider-neutral pt-2 pb-2 md:ml-1 md:mr-1 lg:ml-4 lg:mr-4"></div>
        <section
          className="flex-initial bg-base-100 w-2/3 min-h-full rounded-box join join-horizontal"
        >
          {
            colors?.hex_colors?.map((color, idx) => (
              <div
                key={idx}
                className="colorTheme flex justify-center items-center join-item w-full"
                style={{ backgroundColor: color }}
              >
                <div className="tooltip tooltip-left lg:tooltip-top bg-inherit" data-tip="click to copy">
                  <button
                    className="md:text-3xl lg:text-5xl text-center font-bold contrasting-text vertical-text cursor-copy select-all"
                    onClick={(e) => {
                      if (!navigator.clipboard) {
                        console.error("Clipboard access denied!")
                        return;
                      }
                      const text = e.target.innerText
                      navigator.clipboard.writeText(text)
                      toast.custom((t) => (
                        <span>
                          <div className={"alert rounded-lg p-2 " +
                            (t.visible ? 'animate-fade-in' : 'animate-fade-out')}
                          >
                            copied to clipboard
                          </div>
                        </span>
                      ))
                    }}
                  >
                    {color}
                  </button>
                </div>
              </div>
            ))
          }
        </section>
      </main >
      <Toaster position="bottom-center" toastOptions={{ custom: { duration: 2000 } }} />
    </>
  );
}

export default App
