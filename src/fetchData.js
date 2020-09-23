/*TODO: 
    Refactor Map methods to different place.
    makeCircleArray is too long.
*/

import { removeArrayWithNull, changeArrayKeyObj } from './libs/libs';
//A function to fetch data from local json file
export async function fetchEpidemiologyData() {//TODO Change this fetch method to use cached data
    // const fetchEpidemiologyDataFromCache = await caches.match('https://storage.googleapis.com/covid19-open-data/v2/epidemiology.json');
    // let epidemiologyData = (await fetchEpidemiologyDataFromCache.json()).data;
    // return epidemiologyData;
    return fetch('https://storage.googleapis.com/covid19-open-data/v2/epidemiology.json')
        .then(epidemiologyResult => epidemiologyResult.json())
        .then(epidemiologyData=>epidemiologyData.data)
}

//A function to fetch and save to cache
const fetchToCache = cacheName => async (url) => {
    const cache = await caches.open(cacheName);
    const cacheKey = await cache.keys();
    const lengthOfCache = cacheKey.length;
    if (lengthOfCache === 0) cache.add(url);
}

const epidemiologyUrl = 'https://storage.googleapis.com/covid19-open-data/v2/epidemiology.json';
const  geographyUrl = './data/geography.json';

//Fetching geography and epidemiology cache
export const fetchGeographyCache = () => fetchToCache('geography-cache')(geographyUrl);
export const fetchEpidemiologyCache = () => fetchToCache('epidemiology-cache')(epidemiologyUrl);

export function fetchGeographyData() {
    return fetch('./data/geography.json')
        .then(geographyResult => geographyResult.json())
        .then(result=>removeArrayWithNull(result.data))
        .then(arr => changeArrayKeyObj(arr))
}

export function fetchVicLgaGeoJSON() {
    return fetch('https://data.gov.au/geoserver/vic-local-government-areas-psma-administrative-boundaries/wfs?request=GetFeature&typeName=ckan_bdf92691_c6fe_42b9_a0e2_a4cd716fa811&outputFormat=json')
        .then(LgaGeoJson => LgaGeoJson.json())
}