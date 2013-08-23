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

            var bType = s.getBType();
            s.barAngles = [];
            s.barLengths = [];
            if (bType > 0)
            {
                s.barAngles.push(s.pos + Math.PI);
                s.barLengths.push(10);
            }
            if (bType > 1)
            {
                s.barAngles.push(s.pos + Math.PI - 1);
                s.barLengths.push(10);
            }
            if (bType > 2)
            {
                s.barAngles.push(s.pos + Math.PI + 1);
                s.barLengths.push(10);
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
