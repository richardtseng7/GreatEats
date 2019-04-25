/*eslint-env browser*/
var images = document.getElementsByClassName("preview");
var imageIndex = 0;
var descList = [];

// Add onclick to each image opening the overlay with the clicked image.
window.onload = function() {
    for(var i = 0; i < images.length; i++){
        var image = images[i];
        image.setAttribute("index", i);

        var arr = ["Restaurant name", "Location", "A great review awaits!"];
        cacheDescription(arr);
        image.onclick = function(){
            changeImage(this.getAttribute("index"));
        };
    }
};

function cacheDescription(desc){
    //    console.log("Add " + desc + " to cache.");
    descList.push(desc);
}

// Add the event listener that allows for keyboard navigation.
function enableKeyboardShortcuts(){
    document.addEventListener('keydown', addKeyboardNav);
}

// Remove the event listener that allows for keyboard navigation.
function disableKeyboardShortcuts(){
    document.removeEventListener('keydown', addKeyboardNav);
}

// Close overlay on esc key press. Switch between previous and next posts using right and left arrow keys respectively.
function addKeyboardNav(event) {
    if (event.key === "Escape") {
        closeNav();
    }
    if (event.key === "ArrowLeft") {
        prev();
    }
    if (event.key === "ArrowRight") {
        next();
    }
}

// Display overlay including clicked image and its respective description.
function changeImage(imageNumber){
    document.getElementById("myNav").style.display = "flex";
    var PopUpImage = document.getElementById("pop-up-img");
    PopUpImage.src = images[imageNumber].src;

    document.getElementById("restaurant-name").innerHTML = descList[imageNumber][0];
    document.getElementById("restaurant-location").innerHTML = descList[imageNumber][1];
    document.getElementById("description-text").innerHTML = descList[imageNumber][2];
    // Allow user to navigate using keyboard.
    enableKeyboardShortcuts();
    // Prevent scrolling while in overlay.
    document.documentElement.style.overflow = 'hidden';
    document.body.scroll = "no";
    // Set current imageIndex to image number.
    imageIndex = imageNumber;
}

// Close the overlay and allow scrolling.
function closeNav() {
    document.getElementById("myNav").style.display = "none";
    // Disable keyboard shortcuts.
    disableKeyboardShortcuts();
    // Allow scrolling after closing overlay.
    document.documentElement.style.overflow = 'scroll';
    document.body.scroll = "yes";
}

// Go to previous post.
function prev(){
    if (imageIndex == 0) changeImage(images.length - 1);
    else changeImage(imageIndex - 1);
}

// Go to next post.
function next(){
    if (imageIndex == (images.length - 1)) changeImage(0);
    else {
        changeImage(parseInt(imageIndex) + parseInt(1));
    }
}

// TODO: Figure out how to use this to search.
function loadPage(){
    var param = window.location.toString().split('?');
    if (param.length > 1) {
        var query = param[1].split("search=");
        if (query.length > 1) {
            var key = query[1].split("%20").join(' ');
            retrieveFromDatabase(key);
        }
    }
}