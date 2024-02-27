import { useState, useEffect } from "react"
import useToast from "./useToast"
import { Link, useLoaderData } from "react-router-dom"

export default function ColorTheme() {

  const extractColors = async () => {
    setUploading(true)
    try {
      alert("This feature is still under development!")
      setUploading(false)
    } catch (err) {
      console.error(err)
      setUploading(false)
    }
  }

  const { rgb_color, theme_data } = useLoaderData()
  const toast = useToast()

  useEffect(() => {
    setColors(theme_data)
  }, [rgb_color]);

  const [uploading, setUploading] = useState(false)
  const [colors, setColors] = useState(theme_data)

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

          {/* COLOR PREVIEW AREA */}
          <div className="colorPreview w-full join join-vertical">
            <svg viewBox="0 0 100 100" className="preview-svg rounded w-full h-full">
              <rect x={0} y={0} className="w-full h-full rounded" style={{ fill: `rgb(${rgb_color.join(",")})` }} />
            </svg>
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
        <section
          className="flex-initial bg-base-100 w-2/3 min-h-full rounded-box join join-horizontal overflow-hidden"
        >
          {
            colors?.hex_colors?.map((color, idx) => (
              <div
                key={color[0]}
                className="flex flex-col justify-center items-center join-item w-full overflow-hidden"
                style={{ backgroundColor: color[1] }}
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
                      {color[1]}
                    </button>
                  </div>
                </div>
                <Link to={`/theme-from?c=${colors.rgb_colors[idx][1]}`} className="btn btn-block border-none rounded-none">
                  Get Theme
                </Link>
              </div>
            ))
          }
        </section>
      </main >
    </>
  )
}
