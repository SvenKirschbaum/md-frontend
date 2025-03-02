import React from 'react';
import './index.css';
import App from './App';
import * as ReactDOM from "react-dom/client";

import moment from "moment";
import momentDurationFormatSetup from 'moment-duration-format';

momentDurationFormatSetup(moment);

ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
);