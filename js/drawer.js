var Drawer = {
    getCanvas: function()
    {
        return document.getElementById("output");
    },
    draw: function(words)
    {
        var canvas  = Drawer.getCanvas();
        var context = canvas.getContext('2d');

        context.clearRect(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < words.length; i++)
        {
            words[i].draw(context);
        }
    }
};
