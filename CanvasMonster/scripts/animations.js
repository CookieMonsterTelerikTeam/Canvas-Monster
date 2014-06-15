(function () {
    window.onload = function () {
        var textStartX = 150,
            fontSize = 50,
            letterDistance = fontSize + 30,
            canvasWidth = 150,
            canvasHeight = 700;

        createLogoAnimation('animation-left', canvasWidth, canvasHeight, textStartX, fontSize);
        createLogoAnimation('animation-rigth', canvasWidth, canvasHeight, textStartX, fontSize);

        function createLogoAnimation(container, canvasWidth, canvasHeight, textStartX, fontSize) {
            var stage,
                layer;

            initializeCanvas(container, canvasWidth, canvasHeight);

            telerikLogo(layer);

            telericText(layer, textStartX, fontSize);

            animation(stage, layer);                      

            function initializeCanvas(container, canvasWidth, canvasHeight) {
                stage = new Kinetic.Stage({
                    container: container,
                    width: canvasWidth,
                    height: canvasHeight
                });

                layer = new Kinetic.Layer();
            }

            function telerikLogo(layer) {
                var logoLine = new Kinetic.Line({
                    points: [33, 35, 50, 20, 92, 60, 72, 80, 53, 60, 90, 20, 110, 35],
                    stroke: 'green',
                    strokeWidth: 2,
                    lineJoin: 'round'
                });

                layer.add(logoLine);
            }

            function telericText(layer, textStartX, fontSize) {
                var letterT = text('T', point(0), fontSize),
                letterE = text('e', point(1), fontSize),
                letterL = text('l', point(2), fontSize),
                letterE2 = text('e', point(3), fontSize),
                letterR = text('r', point(4), fontSize),
                letterI = text('i', point(5), fontSize),
                letterK = text('k', point(6), fontSize);

                
                layer.add(letterT);
                layer.add(letterE);
                layer.add(letterL);
                layer.add(letterE2);
                layer.add(letterR);
                layer.add(letterI);
                layer.add(letterK);

                function text(text, point, fontSize) {
                    var text = new Kinetic.Text({
                        x: point.x,
                        y: point.y,
                        text: text,
                        fontSize: fontSize,
                        fontFamily: 'Calibri',
                        fill: 'black'
                    });

                    return text;
                }

                function point(pointIndex) {
                    var point = {
                        x: canvasWidth / 2,
                        y: textStartX + pointIndex * letterDistance
                    }

                    return point;
                }
            }
          
            function animation(stage, layer) {
                var period = 2000;

                var anim = new Kinetic.Animation(function (frame) {
                    var scale = Math.sin(frame.time * 2 * Math.PI / period) + 0.001;
                    var shapes = stage.find('Text');
                    shapes.scale({ x: scale, y: scale });
                }, layer);

                anim.start();

                stage.add(layer);
            }
        }
    };

}).call(this);