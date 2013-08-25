function WordSymbol(word, radius, centre)
{
    this.__word__   = word;
    this.__radius__ = radius;
    this.__centre__ = centre;
    this.__borderSymbols__ = [];

    var minorRadius = radius*30/100;

    for (var i = 0; i < word.length; i++)
    {
        var l = word.charAt(i);
        if (Input.isVowel(l))
        {
            this.__borderSymbols__.push(BorderSymbol.create(null, l, 0, minorRadius));
            continue;
        }

        var n = word.charAt(i+1);
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
        if (Input.isVowel(word.charAt(i+1)))
        {
            i++;
            v = word.charAt(i);
        }

        this.__borderSymbols__.push(BorderSymbol.create(l, v, 0, minorRadius));
    }

    this.setup();
};

WordSymbol.prototype.getRadius = function()
{
    return this.__radius__;
};

WordSymbol.prototype.setRadius = function(radius)
{
    for (var i = 0; i < this.__borderSymbols__.length; i++)
    {
        this.__borderSymbols__[i].radius = radius*30/100;
    }

    if (this.__radius__ != radius)
    {
        this.__radius__ = radius;
        this.setup();
    }
    else
    {
        this.__radius__;
    }
};

WordSymbol.prototype.getCentre = function()
{
    return this.__centre__;
};

WordSymbol.prototype.setCentre = function(centre)
{
    this.__centre__ = centre;
};

WordSymbol.prototype.addBarInGap = function(i, isVowel)
{
    var cs     = this.__borderSymbols__;
    var s      = cs[i];
    var centre = {x: 0, y: 0};
    var radius = this.getRadius();

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
            s.barEdgeCons[i] = 0;
            s.barEdgeCons[iPrev] = 0;
        }

        if (s.barEdgeCons[i] <= s.barEdgeCons[iPrev])
        {
            s.barEdgeCons[i]++;
            var ep = s.pos - da/2/s.barEdgeCons[i];
            nx = centre.x + radius * Math.cos(ep);
            ny = centre.y + radius * Math.sin(ep);
        }
        else
        {
            s.barEdgeCons[iPrev]++;
            var ep = s.pos + da/2/s.barEdgeCons[iPrev];
            nx = centre.x + radius * Math.cos(ep);
            ny = centre.y + radius * Math.sin(ep);
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
}

WordSymbol.prototype.setup = function()
{
    var centre = {x: 0, y: 0};
    var radius = this.getRadius();
    var cs     = this.__borderSymbols__;

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

        /* Allow "i" to have a normal bar if on its own */
        if (s.getCType() === null &&
            s.getVBType() === BorderSymbol.VBType.IN)
        {
            for (var k = 0; k < cs.length; k++)
            {
                if (i === k)
                    continue;

                if (cs[k].getBType() > cs[k].barAngles.length)
                {
                    var c1 = s.getCentre(centre, radius);
                    var c2 = cs[k].getCentre(centre, radius);
                    var dx = c2.x - c1.x;
                    var dy = c2.y - c1.y;
                    var a  = Math.atan(dy/dx) +
                             (dx < 0) * Math.PI;

                    var l  = Math.sqrt(dx*dx + dy*dy) -
                             s.vowelRadius -
                             cs[k].radius;

                    s.barAngles.push(a);
                    s.barLengths.push(0);
                    cs[k].barAngles.push(Math.PI + a);
                    cs[k].barLengths.push(l);
                    break;
                }
            }
            if (k == cs.length)
            {
                this.addBarInGap(i);
            }
        }

        var prevBar = i;
        var bType = s.getBType();
        for (var j = s.barAngles.length; j < s.getBType(); j++)
        {
            for (var k = prevBar + 1; k < cs.length; k++)
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

                    prevBar = k;

                    s.barAngles.push(a);
                    s.barLengths.push(l);
                    cs[k].barAngles.push(Math.PI + a);
                    cs[k].barLengths.push(0);
                    break;
                }
            }
            if (k == cs.length)
            {
                this.addBarInGap(i);
                break;
            }
        }
    }
};

WordSymbol.prototype.draw = function(context)
{
    var radius = this.getRadius();
    var centre = this.getCentre();
    var cs     = this.__borderSymbols__;

    var canvas  = Drawer.getCanvas();
    var context = canvas.getContext('2d');
    var blanks  = [];

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
};
