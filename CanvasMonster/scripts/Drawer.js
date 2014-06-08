//Това са само шаблонни форми за бъдещите обекти
//Няма да са такива в крайния си вид, скоро ще претърпът промяна


function Drawer() {
    this.line = function (x1, y1, x2, y2, strokeColor) {
        var line = new Kinetic.Line({
            points: [x1, y1, x2, y2],
            stroke: strokeColor,
            strokeWidth: 3,
            lineJoin: 'round',
            closed: false
        });

        return line;
    }

    this.rectangle = function (x, y, width, height, strokeColor, fillColor) {
        var rectangle = new Kinetic.Rect({
            x: x,
            y: y,
            width: width,
            height: height,
            stroke: strokeColor,
            fill: fillColor,
            lineJoin: 'round',
            strokeWidth: 3,
        });

        return rectangle;       
    }

    this.circle = function (x, y, radius, strokeColor, fillColor) {
        var circle = new Kinetic.Circle({
                x: x,
                y: y,
                radius: radius,
                fill: fillColor,
                stroke: strokeColor,
                strokeWidth: 3              //Може да няма дебелина  
            });

        return circle;
        
    }

    //Елипсата може би ще е по-труда за правене. (Като кръг, но с два радиуса)
    this.ellipse = function(x, y, radiusX, radiusY, strokeColor, fillColor) {
        var ellipse = new Kinetic.Ellipse({
            x: x,
            y: y,
            radius: {
                x: radiusX,
                y: radiusY
            },
            stroke: strokeColor,
            fill: fillColor,
            strokeWidth: 3
        });

        return ellipse;
    }
}