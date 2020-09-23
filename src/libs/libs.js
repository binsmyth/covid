//Removes arrays that have null values in geographyData
export function removeArrayWithNull(arr) {
    return arr.filter(v => {
            if (v[2] !== null && v[3] !== null) {
                return true;
            }
            return false;
        });
}
//Changes array to key object value
export function changeArrayKeyObj(arr) {
    let obj = {};
    arr.forEach(value => {
        let key = value[0];
        obj[key]= [value[2],value[3],value[1]];
    });
    return obj;
}