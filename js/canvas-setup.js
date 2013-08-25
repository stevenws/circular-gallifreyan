CanvasSetup = {
    setupCanvas: function()
    {
        var canvas    = document.getElementById("output");
        canvas.width  = document.body.clientWidth;
        canvas.height = document.body.clientHeight;
    }
}

window.onload = window.onresize = function()
{
    CanvasSetup.setupCanvas();
    Input.changeHandler();
}
