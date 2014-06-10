var canvasView, contextView, canvas, context, tool;
var color = 'black';
var brushWidth = document.getElementById('width-slider').value;
var isBrushOn = false;
var isLineOn = false;
var isRubberOn = false;
var isRectangleOn = false;
var rubberPreviousColor;
var rx,
    ry,
    rh,
    rw;

canvasView = document.getElementById('canvasView');
contextView = canvasView.getContext('2d');

var container = canvasView.parentNode;
canvas = document.createElement('canvas');

canvas.id = 'canvasTemp';
canvas.width = canvasView.width;
canvas.height = canvasView.height;
container.appendChild(canvas);

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
    if (isBrushOn === true) {
        context.beginPath();
        context.moveTo(ev._x, ev._y);
        tool.started = true;
    }

    if (isLineOn === true) {
        tool.started = true;
        tool.x0 = ev._x;
        tool.y0 = ev._y;
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
        if (isBrushOn === true) {
            context.lineTo(ev._x, ev._y);
            context.lineWidth = brushWidth;
            context.strokeStyle = color;
            context.lineCap = 'round';
            context.stroke();
            context.restore();
        }

        if (isLineOn === true) {
            context.clearRect(0, 0, canvas.width, canvas.height);

            context.beginPath();
            context.moveTo(tool.x0, tool.y0);
            context.lineWidth = brushWidth;
            context.strokeStyle = color;
            context.lineCap = 'round';
            context.lineTo(ev._x, ev._y);
            context.stroke();
            context.closePath();
        }

        //If Rectangle Mode is ON
        if (isRectangleOn === true) {

            rx = Math.min(ev._x, tool.x0),
            ry = Math.min(ev._y, tool.y0),
            rw = Math.abs(ev._x - tool.x0),
            rh = Math.abs(ev._y - tool.y0);

            context.clearRect(0, 0, canvas.width, canvas.height);

            if (!rw || !rh) {
                return;
            }

            context.lineWidth = brushWidth;
            context.strokeStyle = color;
            context.strokeRect(rx, ry, rw, rh);
        }
    }
};

this.mouseup = function (ev) {
    if (tool.started) {
        if (isBrushOn === true) {
            tool.mousemove(ev);
            tool.started = false;
            img_update();
        }

        if (isLineOn === true) {
            tool.mousemove(ev);
            tool.started = false;
            img_update();
        }

        //If Rectangle Mode is ON
        if (isRectangleOn === true) {
            tool.mousemove(ev);
            tool.started = false;
            img_update();
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
    if (ev.offsetX || ev.offsetX == 0) { // Opera
        ev._x = ev.offsetX;
        ev._y = ev.offsetY;
    }
    else if (ev.layerX || ev.layerX == 0) { // Firefox
        ev._x = ev.layerX;
        ev._y = ev.layerY;
    }
    
    // Call the event handler of the tool.
    var func = tool[ev.type];
    if (func) {
        func(ev);
    }
}

function changeDrawingTool(obj) {
    var currentButton = document.getElementById(obj.id);

    switch (obj.id) {
        case 'brush-btn':
            isBrushOn = isToolSelected(isBrushOn);
            changeAppearanceOfButton(currentButton, isBrushOn);
            break;
        case 'line-btn':
            isLineOn = isToolSelected(isLineOn);
            changeAppearanceOfButton(currentButton, isLineOn);
            break;
        case 'rubber-btn':
            isRubberOn = isToolSelected(isRubberOn);
            changeAppearanceOfButton(currentButton, isRubberOn);
            break;
        case 'rect-btn':
            isRectangleOn = isToolSelected(isRectangleOn);
            changeAppearanceOfButton(currentButton, isRectangleOn);
            break;
    }

    function isToolSelected(tool) {
        if (tool === true) {
            tool = false;
        }
        else {
            deselectAllTools();
            deselectAllButtons();

            tool = true;
        }
        return tool;
    }

    function changeAppearanceOfButton(btn, condition) {
        btn.style.color = (condition) ? "white" : "yellowgreen";
        btn.style.background = (condition) ? "yellowgreen" : "white";
        document.body.style.cursor = (condition) ? 'crosshair' : 'default';
    }

    function deselectAllTools() {
        isBrushOn = false;
        isLineOn = false;
        isRubberOn = false;
        isRectangleOn = false;
    }

    function deselectAllButtons() {
        var allButtons = document.querySelectorAll('#nav-buttons .tool');

        for (var i = 0; i < allButtons.length; i++) {
            changeAppearanceOfButton(allButtons[i], false);
        }
    }
}

//Change current color
function changeColor() {
    color = document.getElementById('color-btn').value;
}

//Change brush width
function changeWidth() {
    brushWidth = document.getElementById('width-slider').value;
    document.getElementById('width-value').value = brushWidth;
}

//Clear canvas
function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    contextView.clearRect(0, 0, canvas.width, canvas.height);
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
        }
        else {
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

//Save canvas to the local hard disk without type(must be entered manualy)
function saveCanvas() {
    var data = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    window.location.href = data;
}

function img_update() {
    contextView.drawImage(canvas, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
}