﻿var canvas, context, tool;
var color = 'black';
var brushWidth = 7;
var isHelpDivOn = false;
var isRubberOn = false;
var isDrawOn = false;
var isRectangleOn = false;
var rubberPreviousColor;
var rx,
    ry,
    rh,
    rw;

var canvas = document.getElementById('the-canvas');
var context = canvas.getContext('2d');


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
    if (isDrawOn === true) {
        context.beginPath();
        context.moveTo(ev._x, ev._y);
        tool.started = true;
    }

    //If Rectangle Mode is ON
    if (isRectangleOn === true) {
        tool.started = true;
        tool.x0 = ev._x;
        tool.y0 = ev._y;
    }
};

this.mousemove = function (ev) {
    if (tool.started) {
        if (isDrawOn === true) {
            context.save();
            context.lineTo(ev._x, ev._y);
            context.lineWidth = brushWidth;
            context.strokeStyle = color;
            context.lineCap = 'round';
            context.stroke();
            context.restore();
        }
    }
    

    //If Rectangle Mode is ON
    if (isRectangleOn === true) {
        if (!tool.started) {
                return;
        }

          rx = Math.min(ev._x, tool.x0),
          ry = Math.min(ev._y, tool.y0),
          rw = Math.abs(ev._x - tool.x0),
          rh = Math.abs(ev._y - tool.y0);

        if (!rw || !rh) {
            return;
        }

        context.rect(rx, ry, rw, rh);
        context.fillStyle = color;
        context.fill();
    }

};

this.mouseup = function (ev) {
    if (tool.started) {
        if (isDrawOn === true) {
            tool.mousemove(ev);
            tool.started = false;
        }

        //If Rectangle Mode is ON
        if (isRectangleOn === true) {
            context.beginPath();
            context.rect(rx, ry, rw, rh);
            context.fillStyle = color;
            context.fill();
            //context.strokeStyle = 'black';
            //context.stroke();
            //context.strokeRect(rx, ry, rw, rh);
            //tool.mousemove(ev);
            tool.started = false;
        }
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
    var btn = document.getElementById('brush-btn');
   

    isDrawOn = !isDrawOn;
    changeButtonToPressed(btn, isDrawOn);
    document.body.style.cursor = (isDrawOn) ? 'crosshair' : 'default';
}

function toggleRectangle() {
    var btn = document.getElementById('rect-btn');
    isRectangleOn = !isRectangleOn;
    changeButtonToPressed(btn, isRectangleOn);
    document.body.style.cursor = (isRectangleOn) ? 'crosshair' : 'default';
}

//TODO - Rubber Mode (when on 1) gets the old color 2) sets the main color to white;  when off puts the old color back)
function toggleRubber() {
    var btn = document.getElementById('rubber');

    if (isRubberOn === false) {
        rubberPreviousColor = document.getElementById('color-button').value;
        color = 'white';
        isRubberOn = true;
        changeButtonToPressed(btn, isRubberOn);
    } else {
        color = rubberPreviousColor;
        isRubberOn = false;
        changeButtonToPressed(btn, isRubberOn);
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

// This function draws the #imageTemp canvas on top of #imageView, after which 
// #imageTemp is cleared. This function is called each time when the user 
// completes a drawing operation.
function img_update() {
    //context.drawImage(canvas, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
}
