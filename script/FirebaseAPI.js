/*eslint-env browser*/
var config = {
    apiKey: "AIzaSyCV6KAUerSJ_5N1x4Do4GwWg4aufLuxHWk",
    authDomain: "good-eats-project.firebaseapp.com",
    databaseURL: "https://good-eats-project.firebaseio.com",
    projectId: "good-eats-project",
    storageBucket: "good-eats-project.appspot.com", 
    messagingSenderId: "180389004605"
};
firebase.initializeApp(config);

var ref = firebase.database().ref();
var locationRef = ref.child("City/");
var storageRef = firebase.storage().ref();

var displayLocation = document.getElementById("displayLocation");

function addToDatabase() {
    var l = document.getElementById("locationField").value.split(',');
    var location = l[0] + ", " + l[1];
    var restaurant = document.getElementById("restaurantField").value.split(',')[0];
    var description = document.getElementById("descriptionField").value;
    var photo = getFile();
    if (typeof photo != undefined) {
        uploadImageToDatabase(photo);
        photo = photo.name.split('.').join('%');
    }
    var user = "Wendy";
    var timestamp = createTimestamp();
    ref.child("/City/" + location + "/" + timestamp).set(photo);
    var formatted = location.split(', ').join('').toLowerCase();
    ref.child("/City/" + location + "/" + "lowercase").set(formatted);
    var newPost = ref.child("/Post/").push().key;
    ref.child("/Photo/" + photo).set(newPost);
    ref.child("/Post/" + newPost + "/description/").set(description);
    ref.child("/Post/" + newPost + "/photo/").set(photo);
    ref.child("/Post/" + newPost + "/restaurant/").set(restaurant);
    ref.child("/Post/" + newPost + "/timestamp/").set(timestamp); 
    ref.child("/Post/" + newPost + "/userID/").set(user);
    ref.child("/Restaurant/" + restaurant + "/" + timestamp).set(newPost);
    ref.child("/User/" + user + "/reviews/" + restaurant).set(newPost);
    clearForms();
    clearPreview();
}

function createTimestamp() {
    var now = new Date();
    var date = [now.getMonth() + 1, now.getDate(), now.getFullYear()];
    var time = [now.getHours(), now.getMinutes(), now.getSeconds()];
    var suffix = (time[0] < 12) ? "AM" : "PM";
    time[0] = (time[0] < 12) ? time[0]: time[0] - 12;
    time[0] = time[0] || 12;
    for (var i = 1; i < 3; i++) {
        if (time[i] < 10) {
            time[i] = "0" + time[i];
        }
    }
    return date.join("-") + " " + time.join(":") + " " + suffix;
}

function retrieveFromDatabase(key) {
    var cityRef = ref.child("City/" + key);
    var columnDiv = ["column1", "column2", "column3"];
    var i = 0;
    cityRef.orderByKey().once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            if (childSnapshot.key != "lowercase"){
                var description = childSnapshot.val();
                var photo = childSnapshot.val().split('%').join('.');
                storageRef.child(photo).getDownloadURL().then(function(url){
                    var img = document.createElement('img');
                    img.src = url;
                    img.setAttribute("id", "content");
                    img.onclick = function(event){
                        openNav(description);
                        var PopUpImage = document.getElementById("PopUpImage");
                        PopUpImage.src = img.src;
                    };
                    var grid = document.getElementById(columnDiv[i]);
                    grid.appendChild(img);
                    if (i == 2) i = 0;
                    else{
                        i++;
                    }
                });
            }
        });
    });
}

function searchDatabase() {
    var searchText = document.getElementById("searchQuery");
    var query = searchText.value.split(/^\s+|\s+$/).join('').toLowerCase();
    if (query){
        locationRef.orderByChild('lowercase').startAt(query).endAt(query + "\uf8ff").once('value', function(snapshot){
            snapshot.forEach(function(childSnapshot) {
                var childKey = childSnapshot.key;
                window.location.href = 'index.html?search=' + childKey;
            });
        });
    }
}

function showPassword() {
    var x = document.getElementById("password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

function signInWithGoogle(){
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
    firebase.auth().getRedirectResult().then(function(result) {
        if (result.credential) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
        }
        // The signed-in user info.
        var user = result.user;
        console.log(user);
        window.location.href = "index.html";
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });

}

function register(){
    var email = document.getElementById("register-email").value;
    var password = document.getElementById("register-password").value;
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(){
        //Registration successful. Show ?
        window.location.href = "index.html";
    }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
        window.location.reload();
    });
}

function signIn() {
    var email = document.getElementById("login-email").value;
    var password = document.getElementById("login-password").value;
    firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
        // Sign-in successful. Show user explore page
        window.location.href = "index.html";
    }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
        window.location.reload();
    });
}

function signOut(){
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        window.location.href = "index.html";
    }).catch(function(error) {
        // An error happened.
    });
}

function uploadImageToDatabase(file){
    var fileRef = storageRef.child(file.name);
    fileRef.put(file);
}

function format(str){
    return str.split(', ').join('').toLowerCase();
}