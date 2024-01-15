const colorPicker = document.getElementById("color-picker");
document.body.style.backgroundColor = "#82c982";
colorPicker.addEventListener("input", function() {
    document.body.style.backgroundColor = colorPicker.value;
});

//vyuzivam data z mikrofonu
const mic = new Microphone();
//zadefinovany canvas
const canvas = document.getElementById("my_canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//zadefinovana gulicka
class Dot {
    constructor(x, y, r){
        this.x = x;
        this.y = y;
        this.r = r;
        this.jumpForce = 0;
        this.fallForce = 5;
        //spadnu zhora, zastavia sa v polke canvasu
        this.isFalling = true;
    }
    
    //funkcia vykreslenia
    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    //funkcie pohyby
    fall(){
        this.jumpForce = 1;
        this.y += this.fallForce;
        //padaju prirodzenejsie
        this.fallForce += 0.05;        
    } 

    jump(){
        this.fallForce = 1;
        this.y -= this.jumpForce;
        //stupaju prirodzenejsie
        this.jumpForce -=0.09;
    }
}

let dots = [];
let space = 15;
let radius = 7;

//vytvara na canvase gulicky podla sirky a radiusu
const generate_dots = () => {
    const free_space = (canvas.width/space) - 1.5;
    //for i loop pridava gulicku kym je na canvase miesto
    for (let i = 0; i < free_space; i++) {
        //y=50, x=12,24,36...
        dots.push(new Dot(space+(i*space),50,radius))  
    }
}
generate_dots();


function movement(){
    if (mic.initialized){
        //vycisti cely canvas v kazdom frame
        ctx.clearRect(0,0, canvas.width, canvas.height);
        //data z mikrofonu
        const data = mic.getSamples();
        //data v konzole html
        console.log(data);
        
        dots.forEach((dot, i) => {
            //CYKLUS PADANIA
            //padaju iba do polky canvasu
            if (dot.isFalling && dot.y < canvas.height/2){
                dot.fall();
            } else if(dot.y >= canvas.height/2){
                dot.isFalling = false;
                //musi byt v absolutnej kvoli zapornym hodnotam
                //musime zvacsit velmi male cislo
                dot.jumpForce = Math.abs(data[i])*7;
            }
            if (dot.isFalling == false){
                dot.jump();
                if (dot.jumpForce <= 0){
                    dot.isFalling =true;
                }
            }

            //vykresli gulicky
            dot.draw();
        })
    }
    requestAnimationFrame(movement);
}
movement();

window.addEventListener('resize', function(event){
    location.reload();
});

const enlargeBalls = document.getElementById("enlarge");
enlargeBalls.addEventListener("click", function(){
    radius += 1;
    space = 2*radius;
    dots = [];
    generate_dots();
});

const dislargeBalls = document.getElementById("dislarge"); 
dislargeBalls.addEventListener("click", function(){
    radius -= 1;
    space = 2*radius;
    dots = [];
    generate_dots();
});
