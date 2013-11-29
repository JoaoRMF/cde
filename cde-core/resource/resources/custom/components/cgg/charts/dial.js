lib("protovis-bundle.js");

cgg.init && cgg.init();

cgg.utils.initDocument("dial.svg");

var scale  = params.get("scale"),
    colors = params.get("colors"),
    scale  = (scale != null && scale.length > 0 ? scale : [0,25,50,100]),
    colors = (colors != null && colors.length > 0 ? colors : ["red", "yellow", "green"]),
    min    = parseFloat(scale[0]),
    max    = parseFloat(scale[scale.length - 1]),
    value  = parseFloat(params.get("value"));

/*
 * reset max to biggest of the original maximum or the actual value
 * so we handle values bigger than the declared maximum
 */

//print(typeof value);
//print(typeof max);
min = (value < min ? value : min);
max = (value > max ? value : max);
scale[scale.length - 1] = max;
scale[0] = min;


/*
 * Construct the arc list
 */

var arcs = [];

for (var i = 0; i < colors.length; i++) {
  arcs.push({min: scale[i], max: scale[i+1], color: colors[i]});
}
/* Sizing and scales. */

var w = 600,
    h = 300,
    r = .75 * h,
    a = pv.Scale.linear(min, max).range(0, Math.PI),
    ticks = a.ticks();
    start = -Math.PI;
/* The root panel. */
var vis = new pv.Panel()
    .canvas(document.getElementById("escala_cor"))
    .width(w)
    .height(h);

/* The wedge, with centered label. */
vis.add(pv.Wedge)
    .data(arcs)
    .bottom(25)
    .left(w / 2)
    .innerRadius(r - 15)
    .outerRadius(r)
    .startAngle(function(d){return - Math.PI + a(d.min);})
    .fillStyle(function(d){return d.color;})
    .angle(function(d){return a(d.max) - a(d.min);});

vis.add(pv.Wedge)
    .data(ticks)
    .bottom(25)
    .left(w / 2)
    .innerRadius(r + 10.5)
    .outerRadius(r + 25)
    .startAngle(function(d){ return - Math.PI + a(d) - 0.0025})
    .fillStyle("#66CCFF")
    .angle(0.005)
.add(pv.Wedge)
    .innerRadius(r+39)
    .outerRadius(r+40)
    .angle(0)
.anchor("outer").add(pv.Label)
    .textAngle(0)
    .font("12.4 sans-serif")
    .textStyle("#626a6e")
    .textAlign("center")
    .textBaseline("middle")
    .text(function(d) {return d;});

vis.render();

var rotation = (value - min )/(max - min) * 180;
document.getElementById("ponteiro").setAttribute("transform","rotate("+ rotation + ",300,275)")
