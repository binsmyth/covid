//TODO: simplify makeCircleArray


import { fetchEpidemiologyData, fetchGeographyData, fetchVicLgaGeoJSON } from './fetchData';

//Creating new map
export const createMap = () => {
    let mapOptions = {
        center: [17.385044, 78.486671],
        zoom: 2,
        preferCanvas: true,
        zoomSnap: 0.25,
        worldCopyJump: true,
    };
    
    let map = new L.map('map', mapOptions);
    return map;
}

//This is used to create a layer of map image
export const createLayer = () => {
    let layer = new L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmluc215dGgiLCJhIjoiY2tlc240OHkyMW5zaTJzcG53ZmVjcW9jZiJ9.S0iygkdSP5_VWreKBlDaJQ', {
        attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: 'mapbox/streets-v11',
        accessToken: 'pk.eyJ1IjoiYmluc215dGgiLCJhIjoiY2tlc240OHkyMW5zaTJzcG53ZmVjcW9jZiJ9.S0iygkdSP5_VWreKBlDaJQ'
    });
    return layer;
}

const createVicLgaGeojsonLayer = () => {
    var geojsonLayer = fetchVicLgaGeoJSON();     
    return geojsonLayer;
}

//Adds Covid deaths to map
export const addCircleToMap = (circleArray, map, covidDate) => {
    const covidDateDiv = document.querySelector('#date');
    let i = 0;
    let mappedLayers =  (function (i) {
        let mapping = setInterval(function () {
            circleArray[i].addTo(map);
            covidDateDiv.innerHTML = covidDate[i];
            i++;
            if (i === circleArray.length) clearInterval(mapping);
            }, 1)
            return mapping;
    })(i)
}


//Creates arrays of circle to be put into map with confirmed deaths and cases
export const makeCircleArray = (epidemiologyData, geographyData, covidDate, circle, circle1) => {
    return epidemiologyData.map((data, index) => { //TODO:returning undefined elements in array
        let epidemiologyKey = data[1];
        let latLng = geographyData[epidemiologyKey];
        if (latLng !== undefined && latLng[0] !== undefined && latLng[1] !== undefined) {
            return new L.circle(
                [latLng[0], latLng[1]],
                {
                    color: '#00008B',
                    radius: 0.5,
                    fillColor: '#262527',
                    fillOpacity:0.5,
                }
            )
        }
    })
    .filter(value=>value !== undefined)
}
export const makeCovidDateArray = (epidemiologyData, geographyData) => {
    return epidemiologyData.map((data, index) => {
        let epidemiologyKey = data[1];
        let latLng = geographyData[epidemiologyKey];
        if (latLng !== undefined) {
            return data[0];
        }
    })
    .filter(value=>value !== undefined)
}

export async function addCovidDataToMap() {//TODO:This is an async function and has too many functions inside.
    let geographyData = await fetchGeographyData();
    
    let epidemiologyData = await fetchEpidemiologyData();
    let circle = makeCircleArray(epidemiologyData, geographyData);
    console.log(geographyData);
    let covidDate = makeCovidDateArray(epidemiologyData, geographyData);
    // console.log(await fetchEpidemiologyData());
    const map = createMap();
    const layer = createLayer();
    const geoJSONLayer = createVicLgaGeojsonLayer();
    const vicLgaStyles = {
        "color": "#000",
        "weight": 1,
        "opacity": 0.4,
        "fillColor": "#e4ebf7"
    };

    geoJSONLayer.then(data => {
        L.geoJSON(data, {
            style: vicLgaStyles
        }).addTo(map);
    });
    map.addLayer(layer);
    // addCircleToMap(circle, map, covidDate)
    let intervalId = addCircleToMap(circle, map, covidDate);
}