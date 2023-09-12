import React, { createContext, useEffect, useState } from 'react';
import * as tf from "@tensorflow/tfjs-core";
import '@tensorflow/tfjs-backend-wasm';
import {loadGraphModel} from '@tensorflow/tfjs-converter';

// Create a context
export const YOLOContext = createContext();

export const YOLOProvider = ({ children }) => {
    const [model, setModel] = useState(null);

    useEffect(() => {
        const loadModel = async () => {
            await tf.setBackend('wasm');
            const model = await loadGraphModel('./model/model.json');
            setModel(model);
        };
        loadModel();
    }, []);

    return (
    <YOLOContext.Provider value={model}>
        {children}
    </YOLOContext.Provider>
    );
};