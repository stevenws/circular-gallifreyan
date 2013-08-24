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

            s.barAngles   = [];
            s.barLengths  = [];
            s.barEdgeCons = [];
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
            barLoop:for (var j = s.barAngles.length;
                         j < s.getBType();
                         j++)
            {
                var c0 = s.getCentre(centre, radius);
                var iPrev = i - 1;
                if (iPrev < 0)
                    iPrev += cs.length;

                for (var k = 0; k < cs.length - 1; k++)
                {
                    if (k == i || k == iPrev || k in s.barEdgeCons)
                    {
                        continue;
                    }
                    var s1 = cs[k];
                    var s2 = cs[k+1];
                    var c1 = s1.getCentre(centre, radius);
                    var c2 = s2.getCentre(centre, radius);

                    var mx = (c1.x + c2.x)/2;
                    var my = (c1.y + c2.y)/2;

                    var d1 = Math.sqrt(Math.pow(c1.x - c0.x, 2) +
                                       Math.pow(c1.y - c0.y, 2));
                    var d2 = Math.sqrt(Math.pow(c2.x - c0.x, 2) +
                                       Math.pow(c2.y - c0.y, 2));
                    var d3 = Math.sqrt(Math.pow(mx - c0.x, 2) +
                                       Math.pow(my - c0.y, 2));
                    var d  = Math.sqrt(Math.pow(c1.x - c2.x, 2) +
                                       Math.pow(c1.y - c2.y, 2));

                    var cosg = -(d*d/4 - d3*d3 - d2*d2)/(2*d3*d2);
                    
                    if (d2*Math.sin(Math.acos(cosg)) > s1.radius)
                    {
console.log([mx, my, i, k, cosg, d2*Math.sin(Math.acos(cosg))]);
context.beginPath();
context.arc(mx, my, 3, 0, 2*Math.PI, true);
context.fill();

                        var dx = centre.x - c0.x;
                        var dy = centre.y - c0.y;

                        var d = Math.sqrt(dx*dx + dy*dy);
                        var g = Math.atan((my - c0.y)/(mx - c0.x));
                        var o = g + Math.PI + s.pos;
                        var l = d * Math.cos(g) +
                            Math.sqrt(radius*radius -
                                    Math.pow(d * Math.sin(g), 2)) - 
                            s.radius;
                        s.barAngles.push(o);
                        s.barLengths.push(l);

                        s.barEdgeCons[k] = true;
                        continue barLoop;
                    }
                }

                var nx, ny;
                if (!(i in s.barEdgeCons))
                {
                    s.barEdgeCons[i] = true;
                    var ep = this.pos - da/2;
                    nx = centre.x + radius * Math.cos(ep);
                    ny = centre.y + radius * Math.sin(ep);
                }
                else if (!(iPrev in s.barEdgeCons))
                {
                    s.barEdgeCons[iPrev] = true;
                    var ep = this.pos + da/2;
                    nx = centre.x + radius * Math.cos(ep);
                    ny = centre.y + radius * Math.sin(ep);
                }
                else
                {
                    break barLoop;
                }

                var dx = centre.x - c0.x;
                var dy = centre.y - c0.y;

                var d = Math.sqrt(dx*dx + dy*dy);
                var g = Math.atan((ny - c0.y)/(nx - c0.x));
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
