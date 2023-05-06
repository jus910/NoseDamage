var c = document.getElementById("map");
var ctx = c.getContext("2d");
var prevY = 0;
var pageY = 0;
ctx.fillStyle = "#00FFFF";
console.log("loaded map.js");

mapButton = document.getElementById("mapit");
mapButton.addEventListener("click", draw);

var draw = () => {
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.beginPath();
  ctx.arc(c.width / 2, c.height / 2, radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
}

