import { useState, useEffect } from "react"
import useToast from "./useToast"
import { Link, useLoaderData } from "react-router-dom"

export default function ColorTheme() {
  const { hex_colors, theme } = useLoaderData()
  const toast = useToast()
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

  const [input_color, setInputColor] = useState([theme[0], theme[1]])
  const [colors, setColors] = useState({
    "hex_colors": theme,
    "locked": [false, false, false, false, false],
    "lock_count": 0
  });

  useEffect(() => {
    setColors({ ...colors, "hex_colors": theme })
    setInputColor([theme[0], theme[1]])
  }, [hex_colors]);

  useEffect(() => {
    setInputColor([colors.hex_colors[0], colors.hex_colors[1]])
  }, [colors]);

  return (
    <>
      <main className="flex p-4 w-full bg-base-300 min-h-screen">

        <section className="flex flex-col flex-initial bg-base-100 w-1/3 min-h-full rounded-box p-4 justify-between items-center">
          {/* HEADER */}
          <h1 className="md:text-4xl lg:text-5xl text-center mt-16">
            Pick a Color
          </h1>

          {/* COLOR SELECTOR AREA */}
          <div className="colorPreview w-full flex justify-around items-center min-h-[33%]">
            <span className="inline-block w-full rounded aspect-square overflow-hidden mr-4" style={{ background: colors.hex_colors[0] }}>
              <input type="color" className="cursor-pointer w-full h-full rounded"
                value={input_color[0]} onChange={(e) => setInputColor(prev => [e.target.value, prev[1]])}
              />
            </span>
            <span className="inline-block w-full rounded aspect-square overflow-hidden" style={{ background: colors.hex_colors[1] }}>
              <input type="color" className="cursor-pointer w-full h-full rounded"
                value={input_color[1]} onChange={(e) => setInputColor(prev => [prev[0], e.target.value])}
              />
            </span>
          </div>

          <div
            className="w-full grouped-inputs"
          >
            {/* BUTTON GROUP */}
            <div
              className="btn-group w-full join-item flex justify-center items-center"
            >
              {
                input_color[0] === hex_colors[0] && input_color[1] === hex_colors[1] ?
                  <p
                    className={'btn btn-secondary w-1/3 flex-initial btn-disabled'}
                  >
                    Generate Theme
                  </p> :
                  <Link to={`/theme-from?c=${input_color[0].substring(1)},${input_color[1].substring(1)}`}
                    className={'btn btn-secondary w-1/3 flex-initial'}
                  >
                    Generate Theme
                  </Link>
              }
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
  )
}
