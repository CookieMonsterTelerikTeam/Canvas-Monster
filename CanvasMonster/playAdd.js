(function() {
  window.onload = function() {

    var firstPoint = 130,
        lettersFontSize = 50, 
        letterDistance =  lettersFontSize + 30 ;

    var stage = new Kinetic.Stage({
      container: 'animation-add',
      width: 150,
      height: 700
      });

    layer = new Kinetic.Layer();

    var logoLine = new Kinetic.Line({
      points: [8, 35, 25, 20, 67, 60, 47, 80, 28, 60, 65, 20, 85, 35],
      stroke: 'green',
      strokeWidth: 2,
      lineJoin: 'round'
      });

    var letterT = new Kinetic.Text({
        x: stage.getWidth() / 2,
        y: firstPoint,
        text: 'T',
        fontSize: lettersFontSize,
        fontFamily: 'Calibri',
        fill: 'black'
      });

    var letterE = new Kinetic.Text({
        x: stage.getWidth() / 2,
        y: firstPoint + letterDistance ,
        text: 'e',
        fontSize: lettersFontSize,
        fontFamily: 'Calibri',
        fill: 'black'
      });

    var letterL = new Kinetic.Text({
        x: stage.getWidth() / 2,
        y: firstPoint + letterDistance*2 ,
        text: 'l',
        fontSize: lettersFontSize,
        fontFamily: 'Calibri',
        fill: 'black'
      });

    var letterE2 = new Kinetic.Text({
        x: stage.getWidth() / 2,
        y: firstPoint + letterDistance * 3,
        text: 'e',
        fontSize: lettersFontSize,
        fontFamily: 'Calibri',
        fill: 'black'
      });

    var letterR = new Kinetic.Text({
        x: stage.getWidth() / 2,
        y: firstPoint + letterDistance * 4,
        text: 'r',
        fontSize: lettersFontSize,
        fontFamily: 'Calibri',
        fill: 'black'
      });

    var letterI = new Kinetic.Text({
        x: stage.getWidth() / 2,
        y: firstPoint + letterDistance * 5,
        text: 'i',
        fontSize: lettersFontSize,
        fontFamily: 'Calibri',
        fill: 'black'
      });

    var letterK = new Kinetic.Text({
        x: stage.getWidth() / 2,
        y: firstPoint + letterDistance * 6,
        text: 'k',
        fontSize: lettersFontSize,
        fontFamily: 'Calibri',
        fill: 'black'
      });

      layer.add(logoLine);
      layer.add(letterT);
      layer.add(letterE);
      layer.add(letterL);
      layer.add(letterE2);
      layer.add(letterR);
      layer.add(letterI);
      layer.add(letterK);

      var period = 2000;

      var anim = new Kinetic.Animation(function(frame) {
        var scale = Math.sin(frame.time * 2 * Math.PI / period) + 0.001 ;
        var shapes = stage.find('Text');
        shapes.scale({x:scale,y:scale});
        }, layer);

      anim.start();

    return stage.add(layer);
  };

  }).call(this);