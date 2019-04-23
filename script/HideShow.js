/*eslint-env browser*/

// Display drop down menu when settings button is clicked on the header.
document.addEventListener('click', function(event){
    if(event.target.id != "settingsbtn"){
        var menu = document.getElementsByClassName("settings-menu")[0];
        menu.style.display = "none";
    }
});

function show(String){
    var ele = document.getElementsByClassName(String)[0];
    if (ele.style.display == "none" || ele.style.display == "") ele.style.display = "block";
    else ele.style.display = "none";
}

// Toggle between 'Posts' and 'Places' on user profile.
window.addEventListener('load', userChecked);
document.addEventListener('click', userChecked);

// Toggle between 'Sign in' and 'Register' on login page.
window.addEventListener('load', loginChecked);
document.addEventListener('click', loginChecked);

function userChecked(){
    if(document.getElementById('posts').checked) {
        // Posts radio button is checked. 
        toggleCard('user-grid-card', 'places-card');
    }
    if(document.getElementById('places').checked) {
        // Places radio button is checked.
        toggleCard('places-card', 'user-grid-card');
    }
}

function loginChecked(){
    if(document.getElementById('sign-in').checked) {
        // Sign in radio button is checked.
        toggleCard('sign-in-card', 'register-card');
    } 
    if(document.getElementById('register').checked) {
        // Register radio button is checked.
        toggleCard('register-card', 'sign-in-card');
    }
}

function toggleCard(String1, String2){
    var show = document.getElementsByClassName(String1)[0];
    show.style.display = "flex";
    var hide = document.getElementsByClassName(String2)[0];
    hide.style.display = "none";
}