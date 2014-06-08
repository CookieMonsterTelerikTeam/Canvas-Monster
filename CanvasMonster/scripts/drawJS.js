var canvas, context, tool;
var onDraw = false;
var color = 'black';
var brushWidth = 10;

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
    btn.style.color = (onDraw) ? "white" : "yellowgreen";
    btn.style.background = (onDraw) ? "yellowgreen" : "white";
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