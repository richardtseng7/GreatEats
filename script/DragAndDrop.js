var dropArea = document.getElementById('drop-area');
var file;

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function(event) {
    dropArea.addEventListener(event, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault()
    e.stopPropagation()
}

['dragenter', 'dragover'].forEach(function(event) {
    dropArea.addEventListener(event, highlight, false);
});

['dragleave', 'drop'].forEach(function(event) {
    dropArea.addEventListener(event, unhighlight, false);
});

function highlight(e) {
    dropArea.classList.add('highlight')
}

function unhighlight(e) {
    dropArea.classList.remove('highlight')
}

dropArea.addEventListener('drop', handleDrop, false)

function handleDrop(e) {
    var dt = e.dataTransfer;
    var files = dt.files;
    handleFiles(files);
}

//TODO: Figure out how to accept and display multiple image files.
function handleFiles(files) {
    var f = Array.from(files);
    uploadFile(f[0]);
    uploadImageToDatabase(f[0]);
    previewFile(f[0]);
    file = f[0];
}

function uploadFile(file) {
    var url = 'http://127.0.0.1:62888/public/Content.html';
    var formData = new FormData();
    formData.append('file', file);
    fetch(url, {
        method: 'POST',
        body: formData
    });
}

function previewFile(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function() {
        var div = document.createElement('div');
        div.id = "div-image";
        var button = document.createElement('button');
        button.id = "button-close";
        button.innerHTML = "&times";
        button.onclick = function(){
            clearPreview();
        };
        var img = document.createElement('img');
        img.id = "uploaded-img";
        div.appendChild(img);
        div.appendChild(button);
        img.src = reader.result;
        clearPreview();
        document.getElementById('gallery').appendChild(div);
    };
}

function clearForms(){
    for (var i = 0; i < document.forms.length; i++){
        document.forms[i].reset();
    }
}

function clearPreview(){
    var gallery = document.getElementById('gallery');
    var prev = gallery.firstChild;
    if (prev) gallery.removeChild(prev);
}

function getFile(){
    return file;
}