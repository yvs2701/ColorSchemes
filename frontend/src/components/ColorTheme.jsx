import { useState } from "react"
import useToast from "./useToast"
import { useLoaderData } from "react-router-dom"

export const getTheme = async (rgb_color) => {
  try {
    const payload = JSON.stringify({ rgb_color })

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/generate_colors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: payload
    })

    const data = await res.json()
    return data

  } catch (err) {
    console.error(err)
    throw err
  }
}

export default function ColorTheme() {
  const rgb_color = useLoaderData()
  const [uploading, setUploading] = useState(false)
  const [colors, setColors] = useState({
    "hex_colors": ["#223e51", "#ccd6ed", "#737a88", "#a6c5dd", "#eae1ee"],
    "rgb_colors": [[34, 62, 81], [204, 214, 237], [115, 122, 136], [166, 197, 221], [234, 225, 238]],
  })
  const toast = useToast()

  const extractColors = () => { }

  return (
    <>
      <main
        className="flex p-4 w-full bg-base-300 min-h-screen">

        <section
          className="flex flex-col flex-initial bg-base-100 w-1/3 min-h-full rounded-box p-4 justify-between items-center"
        >
          {/* HEADER */}
          <h1
            className="md:text-4xl lg:text-5xl text-center mt-16"
          >
            Pick a Color
          </h1>

          {/* File upload */}
          <div className="fileUpload w-full join join-vertical">
            {/* IMAGE PREVIEW AREA */}
            <img src='https://picsum.photos/800/450' alt="preview of uploaded file"
              className="w-full h-full object-contain backdrop-blur-3xl"
            />
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
              <button
                className="btn btn-secondary w-1/3 flex-initial"
                onClick={() => {
                  alert("This feature is still under development!");
                }}
              >
                Random
              </button>
            </div>
          </div>
        </section>
        <div className="divider divider-horizontal pt-2 pb-2 md:ml-1 md:mr-1 lg:ml-4 lg:mr-4"></div>
      </main >
    </>
  )
}
