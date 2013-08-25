function BorderSymbol(consonant,
                      vowel,
                      cType,
                      dType,
                      bType,
                      vcType,
                      vbType,
                      pos)
{
    this.__consonant__ = consonant;
    this.__vowel__     = vowel;
    this.__cType__     = cType;
    this.__dType__     = dType;
    this.__bType__     = bType;
    this.__vcType__    = vcType;
    this.__vbType__    = vbType;
    this.pos           = pos;
}

BorderSymbol.prototype.radius      = 30;
BorderSymbol.prototype.vowelRadius = 0.17;
BorderSymbol.prototype.dotRadius   = 0.1;
BorderSymbol.prototype.vowelGap    = 0.27;
BorderSymbol.prototype.barAngles   = [];
BorderSymbol.prototype.barLengths  = [];
BorderSymbol.prototype.dotAngles   = [];
BorderSymbol.prototype.barEdgeCons = [];

BorderSymbol.prototype.getVowelRadius = function()
{
    return this.radius*this.vowelRadius;
}

BorderSymbol.prototype.getDotRadius = function()
{
    return this.radius*this.dotRadius;
}

BorderSymbol.prototype.getVowelGap = function()
{
    return this.radius*this.vowelGap;
}

BorderSymbol.create = function(consonant, vowel, pos)
{
    var c  = null;
    var d  = null;
    var b  = null;
    var vc = null;
    var vb = null;

    if (consonant)
    {
        if (!(consonant in BorderSymbol.__consonantLookup__))
        {
            throw "BorderSymbol.create: Unknown consonant '" +
                  consonant +
                  "'";
        }

        var con = BorderSymbol.__consonantLookup__[consonant];
        c = con.getCType();
        d = con.getDType();
        b = con.getBType();
    }
    if (vowel)
    {
        if (!(vowel in BorderSymbol.__vowelLookup__))
        {
            throw "BorderSymbol.create: Unknown vowel '" +
                  vowel +
                  "'";
        }

        var vow = BorderSymbol.__vowelLookup__[vowel];
        vc = vow.getVCType();
        vb = vow.getVBType();
    }
        
    return new BorderSymbol(consonant,
                            vowel,
                            c,
                            d,
                            b,
                            vc,
                            vb,
                            pos);
};

BorderSymbol.prototype.getCentre = function(majorCentre,
                                            majorRadius)
{
    var cx, cy;
    var d;
    var o = this.pos;
    switch (this.getCType())
    {
        case BorderSymbol.CType.EDGE:
            var a  = BorderSymbol.EdgeAngle / 2;
            var g  = Math.PI - a;
            d  = this.radius * Math.cos(g) +
                 Math.sqrt(majorRadius*majorRadius -
                           Math.pow(this.radius*Math.sin(g),2));
            cx = d * Math.cos(o) +
                 majorCentre.x;
            cy = d * Math.sin(o) +
                 majorCentre.y;
            break;
        case BorderSymbol.CType.INNER:
            d = majorRadius -
                this.radius -
                this.getInnerGap();
            cx = d * Math.cos(this.pos) +
                     majorCentre.x;
            cy = d * Math.sin(this.pos) +
                     majorCentre.y;
            break;
        case BorderSymbol.CType.HALF:
            var a  = Math.PI / 2;
            var g  = Math.PI - a;
            d  = this.radius * Math.cos(g) +
                 Math.sqrt(majorRadius*majorRadius -
                           Math.pow(this.radius*Math.sin(g),2));
            cx = d * Math.cos(o) +
                     majorCentre.x;
            cy = d * Math.sin(o) +
                     majorCentre.y;
            break;
        case BorderSymbol.CType.ON:
        default:
            d = majorRadius;
            cx = d * Math.cos(this.pos) +
                     majorCentre.x;
            cy = d * Math.sin(this.pos) +
                     majorCentre.y;
            break;
    }

    return {x: cx, y: cy};
};

BorderSymbol.prototype.draw = function(context,
                                       majorCentre,
                                       majorRadius)
{
    var c  = this.getCentre(majorCentre,
                            majorRadius);
    var cx = c.x;
    var cy = c.y;

    context.beginPath();
    switch (this.getCType())
    {
        case BorderSymbol.CType.EDGE:
            var a  = BorderSymbol.EdgeAngle / 2;
            context.arc(cx,
                        cy,
                        this.radius,
                        this.pos + a,
                        this.pos - a,
                        false);
            break;
        case BorderSymbol.CType.HALF:
            var a = Math.PI / 2;
            context.arc(cx,
                        cy,
                        this.radius,
                        this.pos + a,
                        this.pos - a,
                        false);
            break;
        case BorderSymbol.CType.INNER:
        case BorderSymbol.CType.ON:
            context.arc(cx, cy, this.radius, 0, 2*Math.PI, true);
            break;
    }
    context.stroke();

    for (var i = 0; i < this.barAngles.length; i++)
    {
        var a = this.barAngles[i];
        var l = this.barLengths[i];

        var sx = cx + this.radius * Math.cos(a);
        var sy = cy + this.radius * Math.sin(a);

        var ex = sx + l * Math.cos(a);
        var ey = sy + l * Math.sin(a);

        context.beginPath();
        context.moveTo(sx, sy);
        context.lineTo(ex, ey);
        context.stroke();
    }

    var vc = this.getVCType();
    var vcPos = false;
    var vx, vy;
    if (vc)
    {
        switch (vc)
        {
            case BorderSymbol.VCType.IN:
                var D = majorRadius + this.getVowelGap();
                vx = D * Math.cos(this.pos) +
                         majorCentre.x;
                vy = D * Math.sin(this.pos) +
                         majorCentre.y;
                vcPos = this.pos;
                break;
            case BorderSymbol.VCType.CENTRE:
                vx = cx;
                vy = cy;
                break;
            case BorderSymbol.VCType.ON:
                /* This could be any position on the circle but this is
                 * simpler for now.
                 */
                if (this.getCType() === null)
                {
                    var drawRad = majorRadius -
                                  this.getInnerGap() -
                                  this.getVowelRadius();
                    vx = drawRad * Math.cos(this.pos) + majorCentre.x;
                    vy = drawRad * Math.sin(this.pos) + majorCentre.y;
                }
                else if (Math.abs(cx - majorCentre.x) >
                         Math.abs(cy - majorCentre.y))
                {
                    if (cx > majorCentre.x)
                    {
                        vx = cx - this.radius;
                        vy = cy;
                        vcPos = 0;
                    }
                    else
                    {
                        vx = cx + this.radius;
                        vy = cy;
                        vcPos = Math.PI;
                    }
                }
                else
                {
                    if (cy > majorCentre.y)
                    {
                        vy = cy - this.radius;
                        vx = cx;
                        vcPos = 1.5*Math.PI;
                    }
                    else
                    {
                        vy = cy + this.radius;
                        vx = cx;
                        vcPos = 0.5*Math.PI;
                    }
                }
                break;
        }
        context.beginPath();
        context.arc(vx, vy, this.getVowelRadius(), 0, 2*Math.PI, true);
        context.stroke();
    }

    var dType = this.getDType();
    this.dotAngles = [];
    var middlePos;
    if (vcPos !== false)
    {
        middlePos = vcPos + 0.3*Math.PI;
    }

    else if (this.getVBType() == BorderSymbol.VBType.IN)
    {
        middlePos = this.pos + 0.75*Math.PI;
    }
    else
    {
        middlePos = this.pos + Math.PI;
    }

    if (dType > 0)
    {
        this.dotAngles.push(middlePos);
    }
    if (dType > 1)
    {
        this.dotAngles.push(middlePos - 0.4);
    }
    if (dType > 2)
    {
        this.dotAngles.push(middlePos + 0.4);
    }

    for (var i = 0; i < this.dotAngles.length; i++)
    {
        var a = this.dotAngles[i];

        var r = this.radius - this.getInnerGap() - this.getDotRadius();
        var x = cx + r * Math.cos(a);
        var y = cy + r * Math.sin(a);

        context.beginPath();
        context.arc(x, y, this.getDotRadius(), 0, 2*Math.PI, true);
        context.fill();
    }

    var vb = this.getVBType();
    switch (vb)
    {
        case BorderSymbol.VBType.IN:
            var a;
            if (this.barAngles.length > 0)
            {
                a = this.barAngles[0];
            }
            else
            {
                a = this.pos + Math.PI;
            }

            var sx = cx + this.getVowelRadius() * Math.cos(a);
            var sy = cy + this.getVowelRadius() * Math.sin(a);

            var ex = cx + this.radius * Math.cos(a);
            var ey = cy + this.radius * Math.sin(a);

            context.beginPath();
            context.moveTo(sx, sy);
            context.lineTo(ex, ey);
            context.stroke();
            break;
        case BorderSymbol.VBType.OUT:
            a = this.pos;

            var sx = cx + this.getVowelRadius() * Math.cos(a);
            var sy = cy + this.getVowelRadius() * Math.sin(a);

            var ex = cx +
                     (this.radius + this.getVowelRadius()) *
                     Math.cos(a);
            var ey = cy +
                     (this.radius + this.getVowelRadius()*2) *
                     Math.sin(a);

            context.beginPath();
            context.moveTo(sx, sy);
            context.lineTo(ex, ey);
            context.stroke();
            break;
    }
};

BorderSymbol.prototype.getBlankArc = function(majorRadius)
{
    switch(this.getCType())
    {
        case BorderSymbol.CType.EDGE:
            var a = BorderSymbol.EdgeAngle / 2;
            var g = Math.asin(this.radius*Math.sin(a)/majorRadius);
            return [this.pos - g,
                    this.pos + g];
            break;
        case BorderSymbol.CType.HALF:
            var a = Math.PI / 2;
            var g = Math.asin(this.radius*Math.sin(a)/majorRadius);
            return [this.pos - g,
                    this.pos + g];
    }
    return null;
};

BorderSymbol.prototype.getCType = function()
{
    return this.__cType__;
};

BorderSymbol.prototype.getDType = function()
{
    return this.__dType__;
};

BorderSymbol.prototype.getBType = function()
{
    return this.__bType__;
};

BorderSymbol.prototype.getVCType = function()
{
    return this.__vcType__;
};

BorderSymbol.prototype.getVBType = function()
{
    return this.__vbType__;
};

BorderSymbol.EdgeAngle = 0.5*Math.PI;
BorderSymbol.InnerGap  = 0.1;

BorderSymbol.prototype.getInnerGap = function()
{
    return this.radius*BorderSymbol.InnerGap;
}

BorderSymbol.CType = {
    EDGE:  1,
    INNER: 2,
    HALF:  3,
    ON:    4
};
BorderSymbol.DType = {
    DOUBLE: 2,
    TRIPLE: 3
};
BorderSymbol.BType = {
    /* Note these values are require to reflect the name is SINGLE
     * must be 1.
     */
    SINGLE: 1,
    DOUBLE: 2,
    TRIPLE: 3
};
BorderSymbol.VCType = {
    IN:     1,
    CENTRE: 2,
    ON:     3,
    OUTER:  4
};
BorderSymbol.VBType = {
    IN:  1,
    OUT: 2
};


BorderSymbol.__consonantLookup__ = {
    "b": new BorderSymbol("",
        "b",
        BorderSymbol.CType.EDGE,
        BorderSymbol.DType.NONE,
        null,
        null,
        null,
        0),
    "ch": new BorderSymbol("",
            "ch",
            BorderSymbol.CType.EDGE,
            BorderSymbol.DType.DOUBLE,
            null,
            null,
            null,
            0),
    "d": new BorderSymbol("",
            "d",
            BorderSymbol.CType.EDGE,
            BorderSymbol.DType.TRIPLE,
            null,
            null,
            null,
            0),
    "f": new BorderSymbol("",
            "f",
            BorderSymbol.CType.EDGE,
            null,
            BorderSymbol.BType.TRIPLE,
            null,
            null,
            0),
    "g": new BorderSymbol("",
            "g",
            BorderSymbol.CType.EDGE,
            null,
            BorderSymbol.BType.SINGLE,
            null,
            null,
            0),
    "h": new BorderSymbol("",
            "h",
            BorderSymbol.CType.EDGE,
            null,
            BorderSymbol.BType.DOUBLE,
            null,
            null,
            0),
    "j": new BorderSymbol("",
            "j",
            BorderSymbol.CType.INNER,
            BorderSymbol.DType.NONE,
            null,
            null,
            null,
            0),
    "k": new BorderSymbol("",
            "k",
            BorderSymbol.CType.INNER,
            BorderSymbol.DType.DOUBLE,
            null,
            null,
            null,
            0),
    "l": new BorderSymbol("",
            "l",
            BorderSymbol.CType.INNER,
            BorderSymbol.DType.TRIPLE,
            null,
            null,
            null,
            0),
    "m": new BorderSymbol("",
            "m",
            BorderSymbol.CType.INNER,
            null,
            BorderSymbol.BType.TRIPLE,
            null,
            null,
            0),
    "n": new BorderSymbol("",
            "n",
            BorderSymbol.CType.INNER,
            null,
            BorderSymbol.BType.SINGLE,
            null,
            null,
            0),
    "p": new BorderSymbol("",
            "p",
            BorderSymbol.CType.INNER,
            null,
            BorderSymbol.BType.DOUBLE,
            null,
            null,
            0),
    "t": new BorderSymbol("",
            "t",
            BorderSymbol.CType.HALF,
            BorderSymbol.DType.NONE,
            null,
            null,
            null,
            0),
    "sh": new BorderSymbol("",
            "sh",
            BorderSymbol.CType.HALF,
            BorderSymbol.DType.DOUBLE,
            null,
            null,
            null,
            0),
    "r": new BorderSymbol("",
            "r",
            BorderSymbol.CType.HALF,
            BorderSymbol.DType.TRIPLE,
            null,
            null,
            null,
            0),
    "s": new BorderSymbol("",
            "s",
            BorderSymbol.CType.HALF,
            null,
            BorderSymbol.BType.TRIPLE,
            null,
            null,
            0),
    "v": new BorderSymbol("",
            "v",
            BorderSymbol.CType.HALF,
            null,
            BorderSymbol.BType.SINGLE,
            null,
            null,
            0),
    "w": new BorderSymbol("",
            "w",
            BorderSymbol.CType.HALF,
            null,
            BorderSymbol.BType.DOUBLE,
            null,
            null,
            0),
    "th": new BorderSymbol("",
            "th",
            BorderSymbol.CType.ON,
            BorderSymbol.DType.NONE,
            null,
            null,
            null,
            0),
    "y": new BorderSymbol("",
            "y",
            BorderSymbol.CType.ON,
            BorderSymbol.DType.DOUBLE,
            null,
            null,
            null,
            0),
    "z": new BorderSymbol("",
            "z",
            BorderSymbol.CType.ON,
            BorderSymbol.DType.TRIPLE,
            null,
            null,
            null,
            0),
    "ng": new BorderSymbol("",
            "ng",
            BorderSymbol.CType.ON,
            null,
            BorderSymbol.BType.TRIPLE,
            null,
            null,
            0),
    "qu": new BorderSymbol("",
            "qu",
            BorderSymbol.CType.ON,
            null,
            BorderSymbol.BType.SINGLE,
            null,
            null,
            0),
    "x": new BorderSymbol("",
            "x",
            BorderSymbol.CType.ON,
            null,
            BorderSymbol.BType.DOUBLE,
            null,
            null,
            0)
};

BorderSymbol.__vowelLookup__ = {
    "a": new BorderSymbol("",
                          "a",
                          null,
                          null,
                          null,
                          BorderSymbol.VCType.IN,
                          null,
                          0),
    "e": new BorderSymbol("",
                          "e",
                          null,
                          null,
                          null,
                          BorderSymbol.VCType.CENTRE,
                          null,
                          0),
    "i": new BorderSymbol("",
                          "i",
                          null,
                          null,
                          null,
                          BorderSymbol.VCType.CENTRE,
                          BorderSymbol.VBType.IN,
                          0),
    "o": new BorderSymbol("",
                          "o",
                          null,
                          null,
                          null,
                          BorderSymbol.VCType.ON,
                          null,
                          0),
    "u": new BorderSymbol("",
                          "u",
                          null,
                          null,
                          null,
                          BorderSymbol.VCType.CENTRE,
                          BorderSymbol.VBType.OUT,
                          0)
};
