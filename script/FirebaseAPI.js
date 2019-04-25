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

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        //User is signed in.
        updateProfile();
        toggleCard('user-header', 'guest-header');
    } else {
        //No user signed in.
        toggleCard('guest-header', 'user-header');
    }
});

function updateProfile(){
    var user = firebase.auth().currentUser;
    var name, email, photoURL, uid;
    if (user){
        // User is signed in.
        name = user.displayName;
        email = user.email;
        photoURL = user.photoURL;
        uid = user.uid;

        // Temporarily set name on profile to email address before @

        //        var username = email.split("@")[0];
        //        document.getElementById("name").innerHTML = username;
        //        document.getElementById("bio").innerHTML = email;
    }
    else{
        // No user signed in.
    }
}

function addToDatabase() {
    var l = document.getElementById("locationField").value.split(',');
    var location = l[0] + "," + l[1];
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
    //    ref.child("/City/" + location + "/" + "lowercase").set(formatted);
    var newPost = ref.child("/Post/").push().key;
    //    ref.child("/City/" + location + "/" + "post").set(newPost);
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
    var cityRef = ref.child("/City/" + key);
    cityRef.orderByKey().once('value', function(snapshot) {  
        snapshot.forEach(function(childSnapshot) {
            var photoKey = childSnapshot.val();
            var photo = photoKey.split('%').join('.'); 
            storageRef.child(photo).getDownloadURL().then(function(url){
                var img = document.createElement('img');
                img.src = url;
                img.setAttribute("class", "preview");
                img.setAttribute("id", "content");
                var images = document.getElementsByClassName("preview");
                img.setAttribute("index", images.length);
                getDesc(photoKey).then(function(data) {
                    img.onclick = function(){
                        changeImage(img.getAttribute("index"));
                    };
                });
                var grid = document.getElementById("grid");
                grid.appendChild(img);
            });
        });
    });
}

function getDesc(photoKey){
    return ref.child("/Photo/" + photoKey).once('value').then(function(snapshot) {
        var post = snapshot.val();
        var shortcut =  ref.child("/Post/" + post);
        shortcut.child("/restaurant").once('value', function(snapshot) {
            var restaurant = snapshot.val();
            shortcut.child("/userID").once('value', function(snapshot) {
                var location = snapshot.val();
                shortcut.child("/description").once('value', function(snapshot) {
                    var review = snapshot.val();
                    var arr = [restaurant, location, review];
                    cacheDescription(arr);
                });
            });
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
    var x = document.getElementById("login-password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

function signInWithGoogle() {
    if (!firebase.auth().currentUser){
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope(‘profile’);
        provider.addScope(‘email’);
        firebase.auth().signInWithRedirect(provider);
        firebase.auth().getRedirectResult().then(function(result) {
            if (result.credential) {
                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = result.credential.accessToken;
            }
            // The signed-in user info.
            var user = result.user;
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
    else {
        window.location.href = "index.html";
    }
}

function register(){
    //Current user is null. No user signed in.
    if (!firebase.auth().currentUser){
        var email = document.getElementById("register-email").value;
        var password = document.getElementById("register-password").value;
        firebase.auth().createUserWithEmailAndPassword(email, password).then(function(){
            //Registration successful.
            window.location.href = "index.html";
        }).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage);
            window.location.reload();
        });
    }
    else {
        window.location.href = "index.html";
    }
}

function signIn() {
    if (!firebase.auth().currentUser){
        var email = document.getElementById("login-email").value;
        var password = document.getElementById("login-password").value;
        firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
            // Sign-in successful.
            window.location.href = "index.html";
        }).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage);
            window.location.reload();
        });
    }
    else {
        window.location.href = "index.html";
    }
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