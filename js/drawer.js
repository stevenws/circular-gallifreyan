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

        for (var i = 0; i < cs.length; i++)
        {
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
                            blanks[i-1][1],
                            blanks[i][0],
                            true);
                context.stroke();
            }
            context.beginPath();
            context.arc(centre.x,
                        centre.y,
                        radius,
                        blanks[blanks.length-1][1],
                        blanks[0][0],
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
