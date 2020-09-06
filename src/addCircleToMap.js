export function addCircleToMap(circleArray,map,covidDate) {
    const covidDateDiv = document.querySelector('#date');
    console.log(covidDateDiv);
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
