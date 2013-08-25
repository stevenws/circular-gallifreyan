Input = {
    changeHandler: function()
    {
        var tb = document.forms.input.word;
        Drawer.draw(tb.value.toCGString());
    },
    isVowel: function(c)
    {
        return c == "a" ||
               c == "e" ||
               c == "i" ||
               c == "o" ||
               c == "u";
    },
    wordGap:  0.8
};

String.prototype.toCGString = function()
{
    var str      = this.toLowerCase();
    var words    = str.split(" ");
    var syms     = [];
    var newWords = {};

    var counts   = [];

    for (var i = 0; i < words.length; i++)
    {
        while (i < words.length && !words[i])
        {
            words.splice(i, 1);
        }
    }

    for (var i = 0, c = 0, cCount = 1, cycle = 0;
         i < words.length;
         i++, c++)
    {
        if (c >= cCount)
        {
            counts.push(cCount);
            cycle++;
            c = 0;
            cCount = Math.round(Math.PI / Math.asin(1/2/cycle));
            console.log(cCount);
        }
    }
    counts.push(c);

    var canvas     = Drawer.getCanvas();
    var wordRadius = Math.min(canvas.width, canvas.height) /
                     (2*counts.length-1) / (2 + Input.wordGap);
    var wordDist   = (2 + Input.wordGap) * wordRadius;

    for (var i = words.length - 1, c = 0, cycle = 0, r = 0;
         i >= 0;
         i--, c--)
    {
        if (c < 0)
        {
            cycle++;
            c = counts[cycle] - 1;
        }

        var wordPos    = 0.5 * Math.PI - 2 * Math.PI * c / counts[cycle];
        var wordCentre = {x: cycle * wordDist * Math.cos(wordPos) +
                             canvas.width/2,
                          y: cycle * wordDist * Math.sin(wordPos) +
                             canvas.height/2};

        var word = words[i];
        var sym = new WordSymbol(word, wordRadius, wordCentre);

        syms.push(sym);
    }

    Input.curWords = newWords;
    return syms
}
