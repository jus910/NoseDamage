var c = document.getElementById("map");
var ctx = c.getContext("2d");
ctx.fillStyle = "#00FFFF";


mapButton = document.getElementById("mapit");
mapButton.addEventListener("click", draw);

var draw = () => {
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.beginPath();
  ctx.arc(c.width / 2, c.height / 2, radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
}

