﻿var canvasView, contextView, canvas, context, tool;
var color = 'black',
    brushWidth = document.getElementById('width-slider').value,
    isBrushOn = false,
    isRubberOn = false,
    isLineOn = false,
    isRubberOn = false,
    isRectangleOn = false,
    isCircleOn = false,
    rubberPreviousColor,
    rx,
    ry,
    rh,
    rw,
    cx,
    cy,
    radii,
    circumference,
    scaleX,
    scaleY;

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

    if ((isBrushOn === true) || (isRubberOn === true)) {
        context.beginPath();
        context.moveTo(ev._x, ev._y);
        tool.started = true;
    }

    if ((isLineOn === true) || (isRectangleOn === true) || (isCircleOn === true)) {
        tool.started = true;
        tool.x0 = ev._x;
        tool.y0 = ev._y;
    }
};

this.mousemove = function (ev) {
    if (tool.started) {

        context.lineWidth = brushWidth;
        context.strokeStyle = color;

        if (isRubberOn === true) {
            context.lineTo(ev._x, ev._y);
            context.strokeStyle = '#FFF';
            context.lineCap = 'round';
            context.stroke();
            context.restore();
        }

        if (isBrushOn === true) {
            context.lineTo(ev._x, ev._y);
            context.lineCap = 'round';
            context.stroke();
            context.restore();
        }

        if (isLineOn === true) {
            context.clearRect(0, 0, canvas.width, canvas.height);

            context.beginPath();
            context.moveTo(tool.x0, tool.y0);
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

            context.strokeRect(rx, ry, rw, rh);
        }

        //If Circle Mode is ON
        if (isCircleOn === true) {

            rx = Math.min(ev._x, tool.x0);
            ry = Math.min(ev._y, tool.y0);
            rw = Math.abs(ev._x - tool.x0);
            rh = Math.abs(ev._y - tool.y0);

            context.clearRect(0, 0, canvas.width, canvas.height);

            if (!rw || !rh) {
                return;
            }

            cx = rx + parseInt(rw / 2);
            cy = ry + parseInt(rh / 2);
            circumference = Math.min(rw, rh);
            radii = parseInt(circumference / 2);
            scaleX = rw / circumference;
            scaleY = rh / circumference;

            context.save();
            context.moveTo(cx, cy);
            context.beginPath();
            //context.scale(scaleX, scaleY);
            context.arc(cx, cy, radii, 0, 2 * Math.PI);
            context.stroke();
            context.restore();
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
        if (isRubberOn === true) {
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

        //If Circle Mode is ON
        if (isCircleOn === true) {
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
        case 'circle-btn':
            isCircleOn = isToolSelected(isCircleOn);
            changeAppearanceOfButton(currentButton, isCircleOn);
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
        isCircleOn = false;
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

function img_update() {
    contextView.drawImage(canvas, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
}