var bottomPage = document.getElementById("bottom");
var darkness = document.getElementById("darkness");
var grayPage = document.getElementById("gray");
var background = document.getElementById("bg");
var brand = document.getElementById("taxist");
var c = document.getElementById("canvas");
c.width = window.innerWidth;
c.height = window.innerHeight;
var ctx = c.getContext("2d");

var scrollStateUp = false;
var scrollStateDown = false;
var darkenState = false;
var mapState = false;

var requestID;
var percent = 0;
var position = "down";
var currentY = 0;
var accumulateY = 0; // 
var gradientX = 100;
var transGradientX = 100;
var color = "#343a40";

ctx.fillStyle= color;

const squaresOriginal = [
    {
        positionX : -100,
        positionY : window.innerHeight - 150,
        variance: 20,
        size: 60
    },
    {
        positionX : -100,
        positionY : 100,
        variance: 50,
        size: 50,
    },
    {
        positionX : -100,
        positionY : window.innerHeight - 200,
        variance: 110,
        size: 20,
    },
    {
        positionX : -100,
        positionY : window.innerHeight - 340,
        variance: 200,
        size: 15,
    },
    {
        positionX : -100,
        positionY : window.innerHeight - 450,
        variance: 150,
        size: 25,
    }
]
for (var i = 0; i < 30; i++) {
    squaresOriginal.push({
        positionX : -100,
        positionY : Math.random() * window.innerHeight,
        variance: Math.random() * 25 + 5,
        size: Math.random() * 50 + 1 ,
    })
};

for (var i = 0; i < 20; i++) {
    squaresOriginal.push({
        positionX : -100,
        positionY : Math.random() * window.innerHeight,
        variance: Math.random() * 250 + 25,
        size: Math.random() * 20 + 1 ,
    })
};
console.log(squaresOriginal[0]);
squares = JSON.parse(JSON.stringify(squaresOriginal));

const upLimit = 100; 
const downLimit = 300;
const darkenFPS = 3000;
const proportion = 1.1;

//****Public code snippet taken from https://github.com/PimpTrizkit/PJs/wiki/12.-Shade,-Blend-and-Convert-a-Web-Color-(pSBC.js) 
//****to darken rgb values*****//
const pSBC=(p,c0,c1,l)=>{
    let r,g,b,P,f,t,h,i=parseInt,m=Math.round,a=typeof(c1)=="string";
    if(typeof(p)!="number"||p<-1||p>1||typeof(c0)!="string"||(c0[0]!='r'&&c0[0]!='#')||(c1&&!a))return null;
    if(!this.pSBCr)this.pSBCr=(d)=>{
        let n=d.length,x={};
        if(n>9){
            [r,g,b,a]=d=d.split(","),n=d.length;
            if(n<3||n>4)return null;
            x.r=i(r[3]=="a"?r.slice(5):r.slice(4)),x.g=i(g),x.b=i(b),x.a=a?parseFloat(a):-1
        }else{
            if(n==8||n==6||n<4)return null;
            if(n<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(n>4?d[4]+d[4]:"");
            d=i(d.slice(1),16);
            if(n==9||n==5)x.r=d>>24&255,x.g=d>>16&255,x.b=d>>8&255,x.a=m((d&255)/0.255)/1000;
            else x.r=d>>16,x.g=d>>8&255,x.b=d&255,x.a=-1
        }return x};
    h=c0.length>9,h=a?c1.length>9?true:c1=="c"?!h:false:h,f=this.pSBCr(c0),P=p<0,t=c1&&c1!="c"?this.pSBCr(c1):P?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},p=P?p*-1:p,P=1-p;
    if(!f||!t)return null;
    if(l)r=m(P*f.r+p*t.r),g=m(P*f.g+p*t.g),b=m(P*f.b+p*t.b);
    else r=m((P*f.r**2+p*t.r**2)**0.5),g=m((P*f.g**2+p*t.g**2)**0.5),b=m((P*f.b**2+p*t.b**2)**0.5);
    a=f.a,t=t.a,f=a>=0||t>=0,a=f?a<0?t:t<0?a:a*P+t*p:0;
    if(h)return"rgb"+(f?"a(":"(")+r+","+g+","+b+(f?","+m(a*1000)/1000:"")+")";
    else return"#"+(4294967296+r*16777216+g*65536+b*256+(f?m(a*255):0)).toString(16).slice(1,f?undefined:-2)
}
//***********************************************************************************************//

var detox = () => {
    gradientX = 100;
    transGradientX = 100;
    color = "#343a40";
    grayPage.style.background = "background:linear-gradient(to right, #343a40 100%, #343a4000 100%)";
    squares = JSON.parse(JSON.stringify(squaresOriginal));
    // squares = squaresOriginal;
    // console.log(squaresOriginal);
}

var animateSquare = () => {
    ctx.fillStyle= color;
    ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);
    for (var square in squares){
        let middle = (c.clientWidth * 0.57) - 20 + squares[square].variance; // make sure to add variation
        let distance = squares[square].positionX;
        distance = middle - distance
        let movementRatio = (distance / 7) * proportion;
        squares[square].positionX += movementRatio;
        if (distance < middle){
            ctx.fillRect(middle + distance, squares[square].positionY, squares[square].size, squares[square].size);
        }
        console.log(middle + " " + distance);
    }
}

var animateSquareUp = () => {
    ctx.fillStyle= color;
    for (var square in squares){
        ctx.fillRect(squares[square].positionX, squares[square].positionY, squares[square].size, squares[square].size);
    }
    ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);

}


var setScrollStateUp = () => {
    scrollStateUp = !scrollStateUp;
}

var setScrollStateDown = () => {
    scrollStateDown = !scrollStateDown;
}

var setDarkenState = () => {
    darkenState = !darkenState;
}

var setMapState = () => {
    mapState = !mapState;
}

var darken = () => { //depreciated function, but leaving it in just in case
    console.log("darknenin: " + percent);
    darkness.style.opacity = percent;
    percent += 0.025;
    if (percent >= 1.0){
        window.cancelAnimationFrame(requestID);
        setDarkenState();
    } else {
        setTimeout(() => {
            requestID = window.requestAnimationFrame(darken)
        }, 1);
    }
}

var brandScale = 1.01;
var animateGradient = () => {
    if (gradientX < 57){
        console.log("FINISHED");
        setMapState();
        window.cancelAnimationFrame(requestID)
        //setDarkenState();
        //darken(); //chains darken animation 
    } else {
        let middle = 56.9 
        let distance = gradientX - middle;
        let movementRatio = (distance / 10.0) * proportion;
        let movementRatio2 = (distance / 13.0) * proportion;
        let transGradient = transGradientX - 8;
        color = pSBC(-0.05, color);
        grayPage.style.background = "linear-gradient(to right, " + color + " " + gradientX + "%, #343a4000 " + transGradient + "%)"
        animateSquare();
        gradientX -= movementRatio;
        transGradientX -= movementRatio2;
        requestID = window.requestAnimationFrame(animateGradient);
    }
}

var animateGradientRight = () => {
    if (gradientX > 101){
        console.log("FINISHED");
        setMapState();
        window.cancelAnimationFrame(requestID)
        ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);
        setScrollStateDown();
        animateDown();
        //setDarkenState();
        //darken(); //chains darken animation 
    } else {
        animateSquareUp();
        let middle = 102;
        let distance = middle - gradientX;
        let movementRatio = (distance / 4) * proportion;
        let movementRatio2 = (distance / 3) * proportion;
        let transGradient = transGradientX - 8;
        color = pSBC(0.05, color, "#343a40");
        grayPage.style.background = "linear-gradient(to right, " + color + " " + gradientX + "%, #343a4000 " + transGradient + "%)";
        console.log("linear-gradient(to right, " + color + " " + gradientX + "%, #343a4000 " + transGradient + "%)");        gradientX += movementRatio;
        transGradientX += movementRatio2;
        requestID = window.requestAnimationFrame(animateGradientRight);
    }
}

var scale = 1;
var animateUp = () => {
    console.log("animating up")
    bottomPage.style.marginTop = "-" + currentY + "vh";
    currentY += currentY + 0.001;
    background.style.transform = "scale(" + scale + ")";
    scale -= 0.001;
    if (currentY > upLimit && position === "down"){
        window.cancelAnimationFrame(requestID);
        currentY = upLimit;
        bottomPage.style.marginTop = "-" + currentY + "vh";
        setScrollStateUp();
        position = "up";
        console.log("DONE");
        setMapState();
        animateGradient(); 
    } else {
        requestID = window.requestAnimationFrame(animateUp);
    }
}

var animateDown = () => {
    console.log("animating down: " + currentY)
    bottomPage.style.marginTop = "-" + currentY + "vh";
    background.style.transform = "scale(" + scale + ")";
    scale += 0.001;
    currentY -= (100 - currentY) - 0.001;
    if (currentY > downLimit){
        window.cancelAnimationFrame(requestID);
        currentY = 0;
        setScrollStateDown();
        position = "down";
        detox();
    } else {
        requestID = window.requestAnimationFrame(animateDown);
    }
}

var scrolling = (event) => {
    event.preventDefault();
    let y = event.deltaY;
    console.log("Scroll triggered: " + y);
    if (Math.abs(accumulateY) > 500){
        accumulateY = 0;
        if (!scrollStateDown && !scrollStateUp && !darkenState && !mapState){
            if (y > 0 && position === "down"){ //i.e. if scrolling down 
                console.log("Scroll Up animation triggered, activating animation up + ");
                setScrollStateUp();
                animateUp();
            } else if (y < 0 && position === "up"){
                setMapState();
                animateGradientRight();
            }
        } else {
            console.log("still animating!");
        }
    }
    if (!scrollStateDown && !scrollStateUp && !darkenState && !mapState){
        accumulateY += y; 
    }
  }
  
  window.addEventListener('wheel', scrolling, { passive: false });