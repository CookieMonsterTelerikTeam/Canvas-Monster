var canvas, context, tool;
var onDraw = false;
var color = 'black';
var brushWidth = 10;
var isHelpDivOn = false;
var isRubberOn = false;
var rubberPreviousColor;

canvas = document.getElementById('the-canvas');
context = canvas.getContext('2d');

// Attach the mousedown, mousemove and mouseup event listeners.
canvas.addEventListener('mousedown', ev_canvas, false);
canvas.addEventListener('mousemove', ev_canvas, false);
canvas.addEventListener('mouseup', ev_canvas, false);

var tool = this;
this.started = false;
//Show width value
changeWidth();
// This is called when you start holding down the mouse button.
this.mousedown = function (ev) {
    //If Brush Mode Is ON
    if (onDraw === true) {
        context.beginPath();
        context.moveTo(ev._x, ev._y);
        tool.started = true;
    }

};

this.mousemove = function (ev) {
    if (tool.started) {
        context.save();
        context.lineTo(ev._x, ev._y);
        context.lineWidth = brushWidth;
        context.strokeStyle = color;
        context.lineCap = 'round';
        context.stroke();
        context.restore();
    }
};

this.mouseup = function (ev) {
    if (tool.started) {
        tool.mousemove(ev);
        tool.started = false;
    }
};

this.onmouseout = function (ev) {
    if (tool.started) {
        tool.mousemove(ev);
        tool.started = false;
    }
};

// The general-purpose event handler. This function just determines the mouse 
// position relative to the canvas element.
function ev_canvas(ev) {
    ev._x = ev.offsetX;
    ev._y = ev.offsetY;

    // Call the event handler of the tool.
    var func = tool[ev.type];
    if (func) {
        func(ev);
    }
}

//Switch on/off brush mode
function toggleDraw() {
    onDraw = !onDraw;
    var btn = document.getElementById('brush');
    document.body.style.cursor = (onDraw) ? 'crosshair' : 'default';
    changeButtonToPressed(btn, onDraw);
}

//TODO - Rubber Mode (when on 1) gets the old color 2) sets the main color to white;  when off puts the old color back)
function toggleRubber() {
    if (isRubberOn = false) {
        rubberPreviousColor = document.getElementById('color-button').value;
        document.getElementById('color-button').value = 'white';
        isRubberOn = true;
    } else {
        document.getElementById('color-button').value = rubberPreviousColor;
        isRubberOn = false;
    }
}

//Change current color
function changeColor() {
    color = document.getElementById('color-button').value;
}

//Change brush width
function changeWidth() {
    brushWidth = document.getElementById('width-slider').value;
    document.getElementById('width-value').value = brushWidth;
}

//Clear canvas
function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}


//Adds to the DOM help div to enter the url of the image. 
function showImageInput() {
    var parent = document.getElementById('canvas-container');
    var div = document.createElement('div');
    var btn = document.getElementById('image-input');

    //Check if a help div is added not to add another one
    if (!isHelpDivOn) {
        div.id = 'temp-div';
        div.innerHTML = '<label for="img-url-input" style="font-size:19px; color:white;">Enter URL of the image here: </label>\
        <input type="text" id="img-url-input" style="width:300px; height:25px"/>\
        <button class="btn" id="img-url" onclick="inputPicture()">Input</button>';

        parent.parentNode.insertBefore(div, parent.nextSibling);
    }

    isHelpDivOn = true;
    changeButtonToPressed(btn, isHelpDivOn);
}

//Input picture P.S. Tryed to input images from the local computer but there is a bug on the chrome
//and it doesn't allow it
function inputPicture() {
    var picPath = document.getElementById('img-url-input').value;
    var image = new Image();
    image.src = picPath;

    //Check and configure if needed the imported image size
    image.onload = function () {
        if (image.width > canvas.width || image.height > canvas.height) {
            var width = image.width,
                height = image.height;

            if (image.width > canvas.width) {
                width = canvas.width;
            }
            if (image.height > canvas.height) {
                height = canvas.height;
            }
            context.drawImage(image, 0, 0, width, height);
        } else {
            context.drawImage(image, 0, 0);
        }


    };

    //Remove the helper div
    var divToRemove = document.getElementById('temp-div');
    divToRemove.outerHTML = "";

    //Change color of the button to untoggled
    var btn = document.getElementById('image-input');
    isHelpDivOn = false;
    changeButtonToPressed(btn, isHelpDivOn);
}

function changeButtonToPressed(btn, condition) {
    btn.style.color = (condition) ? "white" : "yellowgreen";
    btn.style.background = (condition) ? "yellowgreen" : "white";
}

//Save canvas to the local hard disk without type(must be entered manualy)
function saveCanvas() {
    var data = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    window.location.href = data;
}
