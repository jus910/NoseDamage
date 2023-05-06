var bottomPage = document.getElementById("bottom");
var darkness = document.getElementById("darkness");
var scrollStateUp = false;
var scrollStateDown = false;
var darkenState = false;
var mapState = false;
var requestID;
var position = "down";
var currentY = 0;
var accumulateY = 0; // 
const upLimit = 100; 
const downLimit = 300;
const darkenFPS = 3000;
//****Code snippet taken from https://gist.github.com/renancouto/4675192 to darken rgb values*****//
var LightenColor = function(color, percent) {
    var num = parseInt(color,16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) + amt,
      B = (num >> 8 & 0x00FF) + amt,
      G = (num & 0x0000FF) + amt;

      return (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
};
//***********************************************************************************************//

var setScrollStateUp = () => {
    scrollStateUp = !scrollStateUp;
}

var setScrollStateDown = () => {
    scrollStateDown = !scrollStateDown;
}

var setDarkenState = () => {
    darkenState = !darkenState;
}

var darken = (percent = 0.01) => {
    console.log("darknenin: " + percent);
    darkness.style.opacity = percent;
    if (percent >= 1.0){
        window.cancelAnimationFrame(requestID);
        setDarkenState();
    } else {
        setTimeout(() => {
            requestID = window.requestAnimationFrame(darken(percent + 0.01))
        }, 0.001);
    }
}

var animateUp = () => {
    console.log("animating up")
    bottomPage.style.marginTop = "-" + currentY + "vh";
    currentY += currentY + 0.001;
    if (currentY > upLimit && position === "down"){
        window.cancelAnimationFrame(requestID);
        currentY = upLimit;
        bottomPage.style.marginTop = "-" + currentY + "vh";
        setScrollStateUp();
        position = "up";
        console.log("DONE");
        setDarkenState();
        darken(); //chains darken animation 
    } else {
        requestID = window.requestAnimationFrame(animateUp);
    }
}

var animateDown = () => {
    console.log("animating down")
    bottomPage.style.marginTop = "-" + currentY + "vh";
    currentY -= (100 - currentY) - 0.001;
    if (currentY > downLimit){
        window.cancelAnimationFrame(requestID);
        currentY = 0;
        setScrollStateDown();
        position = "down";
    } else {
        requestID = window.requestAnimationFrame(animateDown);
    }
}

var scrolling = (event) => {
    event.preventDefault();
    let y = event.deltaY;
    console.log("Scroll triggered: " + y);
    if (Math.abs(accumulateY) > 1000){
        accumulateY = 0;
        if (!scrollStateDown && !scrollStateUp && !darkenState){
            if (y > 0 && position === "down"){ //i.e. if scrolling down 
                console.log("Scroll Up animation triggered, activating animation up + " + prevY);
                setScrollStateUp();
                animateUp();
            } else if (y < 0 && position === "up"){
                setScrollStateDown();
                animateDown();
            }
        } else {
            console.log("still animating!");
        }
    }
    accumulateY += y; 
  }
  
  window.addEventListener('wheel', scrolling, { passive: false });