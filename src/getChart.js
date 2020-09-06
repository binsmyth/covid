import Chart from 'chart.js';
import 'chartjs-plugin-zoom';
import * as esri from 'esri-leaflet';
import * as geocoder from 'esri-leaflet-geocoder';

function makeChart(ctx, yLabel, xData){
    let myChart = new Chart(ctx,{
            type:'bar',
            data:{
                labels:yLabel,
                datasets:[{
                    label:'deaths',
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    data:xData
                }]
                
            },
            options: {
                animation:{
                    easing:'easeOutQuad'
                },
                responsive:false,
                maintainAspectRatio:false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                plugins:{
                    zoom:{
                        pan:{
                            enabled:true,
                            mode:'xy',
                            rangeMin:{
                                x:null,
                                y:null
                            },
                            rangeMax:{
                                x:null,
                                y:null
                            },
                            speed:10,
                            threshold:10
                        },
                        zoom:{
                            enabled:true,
                            mode:'xy',
                            speed:0.01,
                            sensitivity:3
                        }
                    }
                }
            }
        });
}
function getDeaths(data, keyToUse) {
    let death = data.reduce((a,c)=>{
        if(Object.keys(a).length === 0 && a.constructor === Object){
            a[c[keyToUse]] = {
                    death:[]
               }
        }

        if(a[c[keyToUse]] === undefined){
                a[c[keyToUse]] = {
                    death:[]
               }
            }
        a[c[keyToUse]].death.push(c.Deaths);
        return a;
    }, {})
    let eachDeath = [];
    for (let key in death) {
        let totalDeaths = death[key].death.reduce((prev, next) => prev + next);
        eachDeath[key] = totalDeaths || 0;
    }
    return eachDeath;
}

function moreThan500(arr){
    return arr.filter(value=>{
        if(value[1]>500){
            return value;
        }
    })
}

function addLayer(layer, map) {
    layer.addTo(map);
}

export default function getChart() {   
    fetch('https://open-covid-19.github.io/data/data_latest.json')
        .then(response=>response.json())
        .then(data => {
            let mapOptions = {
                center: [17.385044, 78.486671],
                zoom: 1,
                preferCanvas:true,
                };
            let map = new L.map('map',mapOptions);
        
            let layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
                noWrap:false,
                bounds:[
                    [-90,-180],
                    [90,180]
                ]
            });
            map.addLayer(layer);

            //decrease data to include deaths and valid coordinates
            let deathWithCoordinatesArray = data.filter((value) => {
                // if (value.Deaths !== null) {
                    if (value.Latitude !== null || value.Longitude !== null) {
                        return value;
                    } 
                // };
            });

            // Make circle Array for datas
            let circleArray = deathWithCoordinatesArray.map((value) => {
                let circle = new L.circle(
                    [value.Latitude, value.Longitude],
                    {
                        color: '#262527',
                        radius: 0.5,
                        fillColor: '#262527',
                        fillOpacity: 0.5,
                    }
                )
                .bindPopup(`${value.RegionName}\n${value.Latitude},${value.Longitude}`);
                return {
                    circle: circle,
                    date: value.Date
                };
            });
            const dateDiv = document.getElementById('date');
            //use button to move forward using each data
            const forward = document.getElementById('next');
            const play = document.getElementById('play');
            const clear = document.getElementById('clear');
            let caseIncrement = 0;
            forward.onclick = function () {
                if (i < circleArray.length) {
                    addLayer(circleArray[i],map);
                    caseIncrement++;
                }
            }

            //Create coordinate circle functions
            let mappedArray = function () {
                return circleArray.map((value, index) => {
                    let mappedLayers =  (function (index) {
                        let mapping = setInterval(function () {
                                if (stopPlaceMapping === false) {
                                    addLayer(value.circle, map);
                                }
                            }, 1 * index)
                            return mapping;
                    })(index)
                    
                    return mappedLayers;
                })
            }

            let mapped;
            play.onclick = function () {
                stopPlaceMapping = false;
                mapped = mappedArray();
            }

            pause.onclick = function () {
                stopPlaceMapping = true;
            }

            let clearMap = function () {
                for (var i in map._layers) {
                    if (map._layers[i]._point != undefined) {
                        try {
                            map.removeLayer(map._layers[i])
                        }
                        catch (e) {
                            console.log("problem with " + e + map._layers[i]);
                        }
                    }
                }
            }
            clear.onclick = function () {
                clearMap();
            }

        
            //Should stop mapping places
            let stopPlaceMapping = false;  
            
            let eachCountryDeath = getDeaths(data,'CountryName');
            let eachDateDeath = getDeaths(data, 'Date');
            let coordinate = data.map(value=>[value.Deaths||0, value.Latitude,value.Longitude, value.RegionName,value.CountryName]);
            let eachCountryDeathArray = Object.entries(eachCountryDeath);
            let countryDeath500 = moreThan500(eachCountryDeathArray);
            let countries500 = countryDeath500.map(value=>value[0]);
            let deaths500 = countryDeath500.map(value=>value[1]);
            let ctx = document.getElementById('myChart');

            //makeChart(ctx, countries500,deaths500);
        })
}