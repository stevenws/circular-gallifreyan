var Drawer = {
    getCanvas: function()
    {
        return document.getElementById("output");
    },
    draw: function(cs)
    {
        var canvas  = Drawer.getCanvas();
        var context = canvas.getContext('2d');

        context.clearRect(0, 0, canvas.width, canvas.height);

        context.beginPath();
        context.arc(200, 200, 100, 0, 2*Math.PI, true);
        context.stroke();

        for (var i = 0; i < cs.length; i++)
        {
            cs[i].draw(context, {x:200,y:200}, 100);
        }
    }
};
