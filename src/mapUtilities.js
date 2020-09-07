//Creating new map
export const createMap = () => {
    let mapOptions = {
        center: [17.385044, 78.486671],
        zoom: 1,
        preferCanvas:true,
    };
    
    let map = new L.map('map', mapOptions);
    return map;
}

//This is used to create a layer of map image
export const createLayer = () => {
    let layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
                noWrap:false,
                bounds:[
                    [-90,-180],
                    [90,180]
                ]
    });
    return layer;
}

//Adds Covid deaths to map
export function addCircleToMap(circleArray,map,covidDate) {
    const covidDateDiv = document.querySelector('#date');

    let i = 0;
    let mappedLayers =  (function (i) {
        let mapping = setInterval(function () {
            circleArray[i].addTo(map);
            covidDateDiv.innerHTML = covidDate[i];
            i++;
            if (i === circleArray.length) clearInterval(mapping);
            }, 10)
            return mapping;
    })(i)
}