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

                    var d0m = Math.sqrt(Math.pow(mx - c0.x, 2) +
                                        Math.pow(my - c0.y, 2));
                    var d02 = Math.sqrt(Math.pow(c2.x - c0.x, 2) +
                                        Math.pow(c2.y - c0.y, 2));
                    var dm2 = Math.sqrt(Math.pow(c2.x - mx, 2) +
                                        Math.pow(c2.y - my, 2));
                    var ds = (d0m+d02+dm2)/2;
                    var A  = Math.sqrt(ds*(ds-d0m)*(ds-d02)*(ds-dm2));
                    var h  = 2*A/d0m;

                    if (h > s1.radius)
                    {
                        s.barEdgeCons[k] = true;

                        var dx = mx - c0.x;
                        var dy = my - c0.y;
                        var a  = Math.atan(dy/dx) +
                                 (dx < 0) * Math.PI;

                        var g = a - Math.PI - s.pos;
                        var d = Math.sqrt(Math.pow(centre.x - c0.x, 2) +
                                          Math.pow(centre.y - c0.y, 2));
                        var l = d * Math.cos(g) - s.radius +
                                Math.sqrt(radius*radius -
                                          Math.pow(d*Math.sin(g), 2));
                        s.barAngles.push(a);
                        s.barLengths.push(l);

                        continue barLoop;
                    }
                }

                var nx, ny;
                if (!(i in s.barEdgeCons))
                {
                    s.barEdgeCons[i] = true;
                    var ep = s.pos - da/2;
                    nx = centre.x + radius * Math.cos(ep);
                    ny = centre.y + radius * Math.sin(ep);
                }
                else if (!(iPrev in s.barEdgeCons))
                {
                    s.barEdgeCons[iPrev] = true;
                    var ep = s.pos + da/2;
                    nx = centre.x + radius * Math.cos(ep);
                    ny = centre.y + radius * Math.sin(ep);
                }
                else
                {
                    break barLoop;
                }

                var dx = nx - c0.x;
                var dy = ny - c0.y;
                var a  = Math.atan(dy/dx) +
                         (dx < 0) * Math.PI;

                var g = a - Math.PI - s.pos;
                var d = Math.sqrt(Math.pow(centre.x - c0.x, 2) +
                                  Math.pow(centre.y - c0.y, 2));
                var l = d * Math.cos(g) - s.radius +
                        Math.sqrt(radius*radius -
                                  Math.pow(d*Math.sin(g), 2));
                s.barAngles.push(a);
                s.barLengths.push(l);
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
