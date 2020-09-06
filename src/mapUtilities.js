export const createMap = () => {
    let mapOptions = {
        center: [17.385044, 78.486671],
        zoom: 1,
        preferCanvas:true,
    };
    
    let map = new L.map('map', mapOptions);
    return map;
}

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
