var fs = require("fs"),
  PNG = require("pngjs").PNG;

var palette = ["#c4182e","#d5612e","#0d6a33","#d6bd2f","#0f9e8c","#1d71c7","#7e4687","#ce3355","#3f212b","#82442f","#5e413d","#ba8b5f","#181a2f","#2b313f","#817e79","#b7b8b2","#d7d4cf","#7a0c25","#b93a27","#af6826","#003f2a","#00554e","#013d83","#421b50","#860c47","#cc5456","#d18554","#d7c86d","#8fb057","#56cbbb","#17adce","#cc99d2","#d17eac"]
console.log(palette.length);

var cooch = [];
for(var i = 0; i<33;i++){
    cooch.push([]);
}

console.log(cooch);
   


function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

  // need this to sort into buckets, based on position


  var width;
  var height;



fs.createReadStream("kirbytestRR.png")
  .pipe(
    new PNG({
      filterType: 3}
  )
  .on("parsed", function () {
      // binds the PNG class to itself
      width = this.width
      height = this.height


    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        var idx = (this.width * y + x) << 2;// <-- THIS IS RUDE !!!!!
        // console.log("before shift "+(this.width * y + x));
        // console.log("after shift "+idx)


        // invert color
        var R  = this.data[idx] 
        var G = this.data[idx + 1] 
        var B = this.data[idx + 2]
        
        

        var hex = rgbToHex(R,G,B);
        
        var RRnum =  palette.indexOf(hex)

        cooch[RRnum].push({x:x,y:y});


        
      }
    }

    console.log(cooch);

    cooch.forEach((colour,indexCol) => {

      colour.forEach(cood => {
          // list of numbies.
          idx = (width * cood.y + cood.x) << 2;
        this.data[idx] = hexToRgb(palette[indexCol]).r
        this.data[idx + 1] = hexToRgb(palette[indexCol]).g
        this.data[idx + 2] = hexToRgb(palette[indexCol]).b

      })
    })
    
    this.pack().pipe(fs.createWriteStream("out.png"));

  }));