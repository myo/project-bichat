import logo from './logo.svg';
import './App.css';
import Avatar from "react-avatar-edit"
import { useState, useEffect, useContext } from 'react';
import * as tf from "@tensorflow/tfjs"
import {YOLOContext} from "./YOLOProvider"

const names = [
  "miocardiocit",
  "vassanguin",
  "ductbiliar",
  "hepatocit",
  "glomerul",
  "tubulirenali",
  "pneumocit",
  "alveola"
  ];

function App() {
  const YOLO = useContext(YOLOContext);
  const [preview, setPreview] = useState(undefined);
  const [isPreviewQueuedForYOLO, setIsPreviewQueuedForYOLO] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [rankedResults, setRankedResults] = useState([{key: "Necunoscut", value: 1.00}]);

  const resetRankedResults = () => {
    setRankedResults([{key: "Necunoscut", value: 1.00}]);
  };

  const onAvatarCrop = (result) => {
    setPreview(result);
    setIsPreviewQueuedForYOLO(true);
    setIsRendered(false);
  };
  
  const onAvatarDeleteImage = (evt) => {
    resetRankedResults();
    setPreview(undefined);
    setIsRendered(false);
  };

  useEffect(()=>{
    const rendererEl = document.querySelector("#renderer");
    if (isPreviewQueuedForYOLO && YOLO && preview !== undefined && isRendered) {
      let img_tensor = tf.browser.fromPixels(rendererEl);
      //failsafe
      const [img_h, img_w] = img_tensor.shape;
      if (img_h < 416 || img_w < 416) {
        const pad = [[0, 416-img_h], [0, 416-img_w], [0,0]];
        img_tensor = img_tensor.pad(pad, 0);
      }
      img_tensor = img_tensor.div(255.0).expandDims(0);
      YOLO.executeAsync(img_tensor).then((result) => {
        const best_results = result[1].max(0).max(0).arraySync();
        const kvp = names.map((name, id) => ({key: name, value: best_results[id]}));
        kvp.sort((a, b) => b.value - a.value);
        setRankedResults(kvp);
      })
    }
  }, [isPreviewQueuedForYOLO, isRendered]);

  return (
    <div className="App" style={{width:"100%", height:"100vh"}}>
      <div className="AvatarContainer">
        <Avatar 
          width={window.innerWidth}
          height={window.innerHeight - 0.23 * window.innerHeight}
          cropRadius={0}
          exportSize={416}
          exportMimeType={"image/jpeg"}
          onCrop={onAvatarCrop}
          onClose={onAvatarDeleteImage}>
        </Avatar>
      </div>
      <div className="ClassProbabilitiesContainer">
        <table>
          <thead>
            <tr>
              <th>Clasa</th>
              <th>Probabilitatea</th>
            </tr>
          </thead>
          <tbody>
            {rankedResults.map((res, id) => (<tr><td>{res.key}</td><td>{(res.value*100).toFixed(2)}%</td></tr>))}
          </tbody>
        </table>
      </div>
      <div className="RendererContainer">
        <img id="renderer" src={preview} alt="preview" onLoad={()=>{setIsRendered(true);}}></img>
      </div>
    </div>
  );
}

export default App;
