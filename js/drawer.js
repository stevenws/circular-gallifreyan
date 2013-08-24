var Drawer = {
    getCanvas: function()
    {
        return document.getElementById("output");
    },
    draw: function(cs)
    {
        var radius = 100;
        var centre = {x:200,y:200};
    

        var canvas  = Drawer.getCanvas();
        var context = canvas.getContext('2d');
        var blanks  = [];

        context.clearRect(0, 0, canvas.width, canvas.height);

        var da = 2*Math.PI / cs.length;
        for (var i = 0, t = 0.5*Math.PI;
             i < cs.length;
             i++, t -= da)
        {
            var s = cs[i];
            s.pos = t;

            s.barAngles  = [];
            s.barLengths = [];
        }

        for (var i = 0; i < cs.length; i++)
        {
            var s = cs[i];
            var initJ = s.barAngles.length;

            var bType = s.getBType();
            for (var j = initJ; j < s.getBType(); j++)
            {
                for (var k = i + j + 1 - initJ; k < cs.length; k++)
                {
                    if (cs[k].getBType() > cs[k].barAngles.length)
                    {
                        var c1 = s.getCentre(centre, radius);
                        var c2 = cs[k].getCentre(centre, radius);
                        var dx = c2.x - c1.x;
                        var dy = c2.y - c1.y;
                        var a  = Math.atan(dy/dx) +
                                 (dx < 0) * Math.PI;

                        var l  = Math.sqrt(dx*dx + dy*dy) -
                                 s.radius -
                                 cs[k].radius;

                        s.barAngles.push(a);
                        s.barLengths.push(l);
                        cs[k].barAngles.push(Math.PI + a);
                        cs[k].barLengths.push(0);
                        break;
                    }
                }
                if (k == cs.length)
                {
                    break;
                }
            }
            for (var j = s.barAngles.length; j < s.getBType(); j++)
            {
                var c = s.getCentre(centre, radius);
                var dx = centre.x - c.x;
                var dy = centre.y - c.y;

                var d = Math.sqrt(dx*dx + dy*dy);
                var g = [0, -1, 1][j];
                var o = g + Math.PI + s.pos;
                var l = d * Math.cos(g) +
                        Math.sqrt(radius*radius -
                                  Math.pow(d * Math.sin(g), 2)) - 
                        s.radius;
                s.barAngles.push(o);
                s.barLengths.push(l);
            }

            var dType = s.getDType();
            s.dotAngles = [];
            if (dType > 0)
            {
                s.dotAngles.push(s.pos + Math.PI);
            }
            if (dType > 1)
            {
                s.dotAngles.push(s.pos + Math.PI - 0.4);
            }
            if (dType > 2)
            {
                s.dotAngles.push(s.pos + Math.PI + 0.4);
            }

            cs[i].draw(context, centre, radius);
            var b = cs[i].getBlankArc(radius);
            if (b)
                blanks.push(b);
        }

        if (blanks.length)
        {
            for (var i = 1; i < blanks.length; i++)
            {
                context.beginPath();
                context.arc(centre.x,
                            centre.y,
                            radius,
                            blanks[i-1][0],
                            blanks[i][1],
                            true);
                context.stroke();
            }
            context.beginPath();
            context.arc(centre.x,
                        centre.y,
                        radius,
                        blanks[blanks.length-1][0],
                        blanks[0][1],
                        true);
            context.stroke();
        }
        else
        {
            context.beginPath();
            context.arc(centre.x,
                        centre.y,
                        radius,
                        0,
                        2*Math.PI,
                        true);
            context.stroke();
        }
    }
};
