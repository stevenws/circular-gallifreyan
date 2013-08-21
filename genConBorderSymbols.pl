#!/usr/bin/perl

my @letters = split " ", "b ch d f g h j k l m n p t sh r s v w th y z ng qu x";
my $str = "";

my @ctype = ("EDGE", "INNER", "HALF", "ON");
my @dtype = ("NONE", "DOUBLE", "TRIPLE", 0, 0, 0);
my @btype = (0, 0, 0, "TRIPLE", "SINGLE", "DOUBLE");

for my $i (0..3)
{
    for my $j (0..5)
    {
        my $letter = $letters[$i*6+$j];
        $str .= "\"$letter\": new BorderSymbol(\"\",\n"
             .  "\"$letter\",\n"
             .  "BorderSymbol.CType.$ctype[$i],\n"
             .  ($dtype[$j] ? "BorderSymbol.DType.$dtype[$j]" : "null") . ",\n"
             .  ($btype[$j] ? "BorderSymbol.BType.$btype[$j]" : "null") .",\n"
             .  "null,\n"
             .  "null,\n"
             .  "0),\n"
    }
}

print substr($str, 0, -2) . "\n";
