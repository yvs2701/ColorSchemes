import { useState } from "react";
import { Link } from "react-router-dom";
import { sampleImg } from "./sampleImageBase64";
import useToast from "./useToast";

export default function ColorExtractor() {

  const [noOfColors, setNoOfColors] = useState(5);
  const [uploading, setUploading] = useState(false);
  const [imgData, setImgData] = useState(sampleImg);
  const [colors, setColors] = useState({
    "hex_colors": ["#223e51", "#ccd6ed", "#737a88", "#a6c5dd", "#eae1ee"],
    "locked": [false, false, false, false, false],
    "lock_count": 0
  });
  const toast = useToast();

  const lockColor = (index) => {
    setColors((prev) => {
      const newLocked = [...prev.locked]
      const newColors = [...prev.hex_colors]
      let newLockCount = prev.lock_count

      // only 2 colors can be locked at a time
      if (newLocked[index] === true) {
        newLocked[index] = false
        newLockCount--
      } else if (prev.lock_count === 2) {
        newLocked[0] = false
        newLocked[index] = true
      } else {
        newLockCount++
        newLocked[index] = true
      }

      // swap all locked colors to the left
      let false_ptr = 0, true_ptr = 1;
      while (false_ptr < true_ptr && true_ptr < newLocked.length) {
        if (newLocked[false_ptr] === false && newLocked[true_ptr] === true) {
          const temp = newColors[false_ptr]
          newColors[false_ptr] = newColors[true_ptr]
          newColors[true_ptr] = temp

          newLocked[false_ptr] = true
          newLocked[true_ptr] = false
        }
        if (newLocked[true_ptr] === false) {
          true_ptr++;
        }
        if (newLocked[false_ptr] === true) {
          false_ptr++;
        }
      }
      return { 'hex_colors': newColors, 'locked': newLocked, 'lock_count': newLockCount }
    })
  }

  const extractColors = async () => {

    setUploading(true)
    const formData = new FormData()

    formData.append("imgData", imgData)
    formData.append("noOfColors", noOfColors)

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/extract_colors`, {
        method: "POST",
        /* headers: {
          // "Content-Type": "multipart/form-data" // NOTE: MANUALLY SETTING THIS HEADER WILL CAUSE UNEXPECTED BEHAVIOUR
        }, */
        body: formData
      })
      const data = await res.json()
      setColors({ 'hex_colors': data['hex_colors'], 'locked': Array(data['hex_colors'].length).fill(false), 'lock_count': 0 })
    } catch (err) {
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <main className="flex p-4 w-full bg-base-300 min-h-screen">

        <section className="flex flex-col flex-initial bg-base-100 w-1/3 min-h-full rounded-box p-4 justify-between items-center">
          {/* HEADER */}
          <h1 className="md:text-4xl lg:text-5xl text-center mt-16">
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
                className={"btn btn-primary w-1/3 flex-initial" + (uploading === true ? "btn-disabled" : "")}
                onClick={extractColors} disabled={uploading}
              >
                {uploading === true ? <span className="loading loading-spinner"></span> : ""}
                {uploading === true ? "Uploading" : "Upload"}
              </button>
              {
                colors.lock_count !== 2 ?
                  <p className='btn btn-secondary w-1/3 flex-initial btn-disabled'>
                    Generate Theme
                  </p> :
                  <Link to={`/theme-from?c=${colors['hex_colors'][0].substring(1)},${colors['hex_colors'][1].substring(1)}`}
                    className='btn btn-secondary w-1/3 flex-initial'
                  >
                    Generate Theme
                  </Link>
              }

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
        <div className="divider divider-horizontal pt-2 pb-2 md:ml-1 md:mr-1 lg:ml-4 lg:mr-4"></div>
        <section
          className="flex-initial bg-base-100 w-2/3 min-h-full rounded-box join join-horizontal overflow-hidden"
        >
          {
            colors?.hex_colors?.map((color, idx) => (
              <div
                key={idx + color}
                className="flex flex-col justify-center items-center join-item w-full overflow-hidden"
                style={{ backgroundColor: color }}
              >
                <div className="h-full bg-inherit flex justify-center items-center">
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
                          <span className={"bg-success text-center text-success-content rounded-lg p-2 pl-3 pr-3 " +
                            (t.visible === true ? 'animate-fade-in' : 'animate-fade-out')}
                          >
                            copied to clipboard
                          </span>
                        ))
                      }}
                    >
                      {color}
                    </button>
                  </div>
                </div>
                <button onClick={() => lockColor(idx)} className="btn btn-block border-none rounded-none">
                  {
                    colors.locked[idx] ? "Locked: " + (idx + 1) : "Lock"
                  }
                </button>
              </div>
            ))
          }
        </section>
      </main >
    </>
  );
}