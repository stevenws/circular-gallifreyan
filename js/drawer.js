var Drawer = {
    getCanvas: function()
    {
        return document.getElementById("output");
    },
    draw: function(pos)
    {
        var bs = BorderSymbol.create("b", "a", pos);
        context = Drawer.getCanvas().getContext('2d');
        bs.draw(context, {x:200,y:200}, 100);
    }
};
