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
    }
}

String.prototype.toCGString = function()
{
    var cs = [];
    var str = this.toLowerCase();

    for (var i = 0; i < str.length; i++)
    {
        var l = str.charAt(i);
        if (Input.isVowel(l))
        {
            cs.push(BorderSymbol.create(null, l, 0));
            continue;
        }

        var n = str.charAt(i+1);
        if      (l == "c" && n == "h")
        {
            i++;
            l = "ch";
        }
        else if (l == "s" && n == "h")
        {
            i++;
            l = "sh";
        }
        else if (l == "t" && n == "h")
        {
            i++;
            l = "th";
        }
        else if (l == "n" && n == "g")
        {
            i++;
            l = "ng";
        }
        else if (l == "q" && n == "u")
        {
            i++;
            l = "qu";
        }

        var v = null;
        if (Input.isVowel(str.charAt(i+1)))
        {
            i++;
            v = str.charAt(i);
        }

        cs.push(BorderSymbol.create(l, v, 0));
    }

    return cs;
}
