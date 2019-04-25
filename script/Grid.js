/*eslint-env browser*/

window.addEventListener('load', populateGrid);

function populateGrid(){
    if (localStorage.hasOwnProperty("userLocation")){
        var key = localStorage.getItem("userLocation");
        retrieveFromDatabase(key);
    }
}