/*TODO: 
    addCircleToMap does too many things refactor it.
    Refactor Map methods to different place
*/
import { addCircleToMap } from './addCircleToMap';
import { createMap } from './mapUtilities';
import { createLayer } from './mapUtilities';

//A function to fetch data from local json file
export function fetchEpidemiologyData() {
    return fetch('./data/epidemiology.json')
        .then(epidemiologyResult => epidemiologyResult.json())
        .then(epidemiologyData => epidemiologyData.data.map((data => removeColumnRangeFromData(data, 2, 5))));
}

export function fetchGeographyData() {
    return fetch('./data/geography.json')
        .then(geographyResult => geographyResult.json())
        .then(geographyData => geographyData.data.map(data => removeColumnRangeFromData(data, 4, 7, 1)))
        .then(obj => changeArrayKeyObj(obj))
}

export async function fetchData() {
    let geographyData = await fetchGeographyData();
    let epidemiologyData = await fetchEpidemiologyData();
    let epidemiologyDeathData = epidemiologyData.filter(death => death[3] > 0);

    
    const map = createMap();
    const layer = createLayer();

    map.addLayer(layer);


    let circle = [];
    let covidDate = [];
    for (let i = 0; i <= epidemiologyDeathData.length; i++){
        if (epidemiologyDeathData[i] !== undefined) {
            let latLng = geographyData[epidemiologyDeathData[i][1]];
            if (latLng !== undefined) {
                if (latLng[0] !== undefined || latLng[1] !== undefined) {  
                    let check;
                    if (latLng[0] === null && latLng[1] === null) {
                        check = false;
                    }
                    else {
                        check = true;
                    }

                    if (check === true) {
                        covidDate.push(epidemiologyDeathData[i][0])
                        circle.push(new L.circle(
                            [latLng[0], latLng[1]],
                            {
                                color: '#262527',
                                radius: 0.5,
                                fillColor: '#262527',
                                fillOpacity: 0.5,
                            }
                        ));
                    }
                } 
            }
            
        }
    }
    var intervalId = addCircleToMap(circle, map, covidDate);

    // const stop = document.getElementById('stop');

    // stop.addEventListener('click', function () {
    //     intervalId.forEach(value => clearInterval(value));
    // })
    

}

function changeArrayKeyObj(arr) {
    let obj = {};
    arr.forEach(value => {
        let key = value[0];
        obj[key]= [value[1],value[2]];
    });
    return obj;
}

function removeColumnRangeFromData(data,min,max, otherElement) { // remove range of columns
    return data.filter((value,index) => {
        if (index >= min && index <= max) {
            return false;
        }
        if (index === otherElement) {
            return false;
        }
        return true;
    })
}