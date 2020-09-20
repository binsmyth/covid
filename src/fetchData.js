/*TODO: 
    Refactor Map methods to different place.
    makeCircleArray is too long.
*/


//A function to fetch data from local json file
export function fetchEpidemiologyData() {
    return fetch('./data/epidemiology.json')
        .then(epidemiologyResult => epidemiologyResult.json())
        .then(epidemiologyData=>epidemiologyData.data)
}

export function fetchGeographyData() {
    return fetch('./data/geography.json')
        .then(geographyResult => geographyResult.json())
        .then(result=>removeArrayWithNull(result.data))
        .then(arr => changeArrayKeyObj(arr))
}

//Removes arrays that have null values
function removeArrayWithNull(arr) {
    return arr.filter(v => {
            if (v[2] !== null && v[3] !== null) {
                return true;
            }
            return false;
        });
}
//Changes array to key object value
function changeArrayKeyObj(arr) {
    let obj = {};
    arr.forEach(value => {
        let key = value[0];
        obj[key]= [value[2],value[3],value[1]];
    });
    return obj;
}