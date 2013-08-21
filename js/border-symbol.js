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

BorderSymbol.prototype.radius = 30;
BorderSymbol.prototype.barAngles  = [];
BorderSymbol.prototype.barLengths = [];

BorderSymbol.create = function(consonant, vowel, pos)
{
    if (!(consonant in BorderSymbol.__consonantLookup__))
    {
        throw "BorderSymbol.create: Unknown consonant '" +
              consonant +
              "'";
    }

    if (!(vowel in BorderSymbol.__vowelLookup__))
    {
        throw "BorderSymbol.create: Unknown vowel '" +
              vowel +
              "'";
    }

    var con = BorderSymbol.__consonantLookup__[consonant];
    var vow = BorderSymbol.__vowelLookup__[vowel];
    return new BorderSymbol(consonant,
                            vowel,
                            con.getCType(),
                            con.getDType(),
                            con.getBType(),
                            vow.getVCType(),
                            vow.getVBType(),
                            pos);
};

BorderSymbol.prototype.draw = function(context,
                                       majorCentre,
                                       majorRadius)
{
    switch (this.getCType())
    {
        case BorderSymbol.CType.EDGE:
            var a  = BorderSymbol.EdgeAngle / 2;
            var o  = this.pos;
            var g  = Math.PI - a;
            var d  = this.radius * Math.cos(g) +
                     Math.sqrt(majorRadius*majorRadius -
                               Math.pow(this.radius*Math.sin(g),2));
            var cx = d * Math.sin(o) +
                     majorCentre.x;
            var cy = d * Math.cos(o) +
                     majorCentre.y;
            context.beginPath();
            context.arc(cx, cy, this.radius, 0.5*Math.PI - o + a, 0.5*Math.PI - o - a, false);
            context.stroke();
            break;
        case BorderSymbol.CType.INNER:
            var d = majorRadius -
                    this.radius -
                    BorderSymbol.InnerGap;
            var cx = d * Math.sin(this.pos) +
                     majorCentre.x;
            var cy = d * Math.cos(this.pos) +
                     majorCentre.y;

            context.beginPath();
            context.arc(cx, cy, this.radius, 0, 2*Math.PI, true);
            context.stroke();
            break;
        case BorderSymbol.CType.HALF:
            var a  = Math.PI / 2;
            var o  = this.pos;
            var g  = Math.PI - a;
            var d  = this.radius * Math.cos(g) +
                     Math.sqrt(majorRadius*majorRadius -
                               Math.pow(this.radius*Math.sin(g),2));
            var cx = d * Math.sin(o) +
                     majorCentre.x;
            var cy = d * Math.cos(o) +
                     majorCentre.y;
            context.beginPath();
            context.arc(cx, cy, this.radius, 0.5*Math.PI - o + a, 0.5*Math.PI - o - a, false);
            context.stroke();
            break;
        case BorderSymbol.CType.ON:
            var d = majorRadius;
            var cx = d * Math.sin(this.pos) +
                     majorCentre.x;
            var cy = d * Math.cos(this.pos) +
                     majorCentre.y;

            context.beginPath();
            context.arc(cx, cy, this.radius, 0, 2*Math.PI, true);
            context.stroke();
            break;
    }
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
BorderSymbol.InnerGap  = 3;

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
    SINGLE: 1,
    DOUBLE: 2,
    TRIPLE: 3
};
BorderSymbol.VCType = {
    IN:     1,
    CENTRE: 2,
    ON:     3
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
                          BorderSymbol.VCType.OUTER,
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
