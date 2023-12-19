import { useState } from "react";

const timestamp = new Date();
const year = timestamp.getFullYear();
const month = timestamp.getMonth() + 1;
const day = timestamp.getDate();
// const todaysImage = `https://picsum.photos/seed/${day}-${month}-${year}/800/450`;
const todaysImage = 'samples/6.jpg';


function App() {

  const [noOfColors, setNoOfColors] = useState(7);
  const [uploading, setUploading] = useState(false);
  const [imgSrc, setImgSrc] = useState(todaysImage);
  const [colors, setcolor] = useState(["#ccd6ec", "#162d3d", "#637181", "#eae1ee", "#a197a0", "#2d4c63", "#a4cbe5"]);

  return (
    <main className="flex p-4 w-full bg-base-300 min-h-screen">
      <section className="flex flex-col flex-initial bg-base-100 w-1/3 min-h-full rounded-box p-4 justify-between items-center">
        {/* HEADER */}
        <h1 className="text-5xl text-center mt-16">
          Input an Image!
        </h1>

        {/* IMAGE PREVIEW AREA */}
        <div className="imgBox w-full h-1/2 flex justify-center items-center">
          <img src={imgSrc} alt="preview image" className="w-full h-full object-contain" />
        </div>

        <div className="w-11/12 grouped-inputs">
          {/* BUTTON GROUP */}
          <div className="btn-group w-full join-item flex justify-between items-center">
            <button className="btn btn-primary w-1/3 flex-initial">
              {uploading === true ? <span className="loading loading-spinner"></span> : ""}
              Upload
            </button>
            <button className="btn btn-secondary w-1/3 flex-initial"
              onClick={() => {
                alert("This feature is still under development!");
              }}
            >
              Random
            </button>
          </div>

          {/* RANGE INPUT */}
          <div className="inputRange w-full mt-4">
            <input type="range" min="2" max="8" className="range range-accent w-full" step="1"
              value={noOfColors} onChange={(e) => setNoOfColors(e.target.value)} />
            <div className="w-full flex justify-between text-xs px-2">
              {[2, 3, 4, 5, 6, 7, 8].map((n) => (<span className="text-center">{n}</span>))}
            </div>
          </div>
        </div>
      </section>
      <div className="divider divider-horizontal divider-neutral mt-2"></div>
      <section className="flex-initial bg-base-100 w-2/3 min-h-full rounded-box join join-horizontal">
        {
          colors.map((color) => (
            <div className="colorTheme flex justify-center items-center join-item border-base-100 w-full" style={{ backgroundColor: color }}>
              <span className="text-4xl text-center font-bold contrastingText"
                style={{ writingMode: "sideways-lr" }}
              >
                {color}
              </span>
            </div>
          ))
        }
      </section>
    </main>
  );
}

export default App;
