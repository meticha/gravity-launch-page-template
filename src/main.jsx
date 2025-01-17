import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import TagManager from "react-gtm-module";
import Clarity from "@microsoft/clarity";

const tagManagerArgs = {
  gtmId: import.meta.env.G_TAG_KEY, // Replace with your GTM Container ID
};

TagManager.initialize(tagManagerArgs);
const projectId = import.meta.env.VITE_CLARITY_PROJECT_ID;

Clarity.init(projectId);

createRoot(document.getElementById('root')).render(
  <>
    <App />
  </>,
)
