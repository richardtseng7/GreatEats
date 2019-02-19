/*eslint-env browser*/
var images = document.getElementsByTagName("img");

function openNav(description) {
    document.getElementById("myNav").style.display = "block";
    document.getElementById("descriptionText").innerHTML = description;
}

function closeNav() {
    document.getElementById("myNav").style.display = "none";
}

for(var i = 0; i < images.length; i++){
    var image = images[i];
    if (image.getAttribute("id") == "content"){
         image.onclick = function(event){
             openNav("Insert a great review here...");
             var PopUpImage = document.getElementById("PopUpImage");
             PopUpImage.src = this.src;
         };
        var buttons = document.getElementsByTagName("a")
        for (var j = 0; j < buttons.length; j++){
                 var b = buttons[j];
                 if (b.getAttribute("class") == "prev"){
                     b.onclick = function(event){
                         var x = i - 1;
                         if (x < 0){
                             x = images.length - 1;
                         }
                         var prev = images[x];
                         PopUpImage.src = prev;
                     };
                 }
                 else if (b.getAttribute("class" == "next")){
                     b.onclick = function(event){
                         var y = i + 1;
                         if (y == (images.length)){
                             y = 0;
                         }
                         var next = images[y];
                         PopUpImage.src = next.src;
                     };
                 }
             }
    }
}

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