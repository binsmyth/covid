import component from './component';
import getChart from './getChart';
import {fetchData} from './fetchData';

import "./main.css";
import "./../node_modules/leaflet/dist/leaflet.css";
import l from "leaflet";
import ChartDataLabels from 'chartjs-plugin-datalabels';

fetchData();

let chartContainer = component("chart-container", "div");
chartContainer.appendChild(component("myChart", "canvas"));
document.body.appendChild(chartContainer);
document.body.appendChild(component("date", "div"));
document.body.appendChild(component("next", "button", "+"));
document.body.appendChild(component("play", "button", "play"));
document.body.appendChild(component("pause", "button", "pause"));
document.body.appendChild(component("clear", "button", "clear"));
document.body.appendChild(component("map", "div"));
document.body.appendChild(component("stop", "button", "stop"));
//getChart();
