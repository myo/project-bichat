import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as tf from "@tensorflow/tfjs-core"
import '@tensorflow/tfjs-backend-wasm';
import {loadGraphModel} from '@tensorflow/tfjs-converter';
import {YOLOProvider} from "./YOLOProvider"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <YOLOProvider>
      {/* SWAGProvider goes here*/}
      <App/>
    </YOLOProvider>
  </React.StrictMode>
);