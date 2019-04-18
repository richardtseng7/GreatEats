/*eslint-env browser*/
var images = document.getElementsByClassName("preview");
var imageIndex = 0;

// Add onclick to each image opening the overlay with the clicked image.
window.onload = function() {
    for(var i = 0; i < images.length; i++){
        var image = images[i];
        image.setAttribute("index", i);
        image.onclick = function(){
            changeImage(this.getAttribute("index"));
        };
    }
};

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
// TODO: Retrieve description from database based on image src.
function changeImage(imageNumber){

    document.getElementById("myNav").style.display = "flex";
    var PopUpImage = document.getElementById("pop-up-img");
    PopUpImage.src = images[imageNumber].src;
    document.getElementById("description-text").innerHTML = "Insert a great review here.";
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
    else changeImage(parseInt(imageIndex) + parseInt(1));
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