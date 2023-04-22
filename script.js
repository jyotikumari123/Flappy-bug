let board;
let boardwidth=360;
let boardheight=640;
let context;

//bird
let birdwidth=34;
let birdheight=24;
let birdX = boardwidth/8;
let birdY = boardheight/2;
let birdImage;

let bird = {
    x : birdX,
    y : birdY,
    width : birdwidth,
    height : birdheight
}
//pipe
let pipeArray =[];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardwidth;
let pipeY = 0;

let toppipeImage;
let bottompipeImage;

//physics
let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score= 0;


window.onload = function(){
    board = document.getElementById("board");
    board.height =boardheight;
    board.width = boardwidth;
    context = board.getContext("2d");

    //context.fillStyle = "blue";
    context.fillRect(bird.x,bird.y,bird.width,bird.height);


    birdImage = new Image();
    birdImage.src ="./bug1.png";
    birdImage.onload = function(){
    context.drawImage(birdImage,bird.x,bird.y,bird.width,bird.height);
    }

    toppipeImage = new Image();
    toppipeImage.src = "./toppipe.png";

    bottompipeImage = new Image();
    bottompipeImage.src= "./bottompipe.png";


    requestAnimationFrame(update);

    setInterval(placePipe, 1500);
    document.addEventListener("keydown", moveBird);
}

function update(){

    requestAnimationFrame(update);
    if(gameOver){
        return;
    }
    context.clearRect(0, 0, board.width,board.height );

    velocityY += gravity;
    //bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImage,bird.x,bird.y,bird.width,bird.height);

    if(bird.y > board.height){
        gameOver = true;
    }

    for(let i=0;i<pipeArray.length;i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);

        if(!pipe.passed && bird.x > pipe.x +pipe.width){
            score += 0.5;
            pipe.passed = true;
        }

        if(detectCollision(bird, pipe)){
            gameOver = true;
        }
    }

    while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth){
        pipeArray.shift();
    }

//score
    context.fillStyle = " white";
    context.font ="45px sans-serif";
    context.fillText(score, 5, 45);

    if(gameOver){
        context.fillText("GAME OVER", 5, 90);
    }
}
function placePipe(){
    if(gameOver){
        return;
    }
let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
let openingSpace = board.height/4;

    let toppipe = {
        img : toppipeImage,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(toppipe);

    let bottomPipe={
        img : bottompipeImage,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace ,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe)
}

function moveBird(e) {
    if(e.code == "Space" || e.code == "ArrowUp" || e.code== "keyX"){
        velocityY = -6;

        if(gameOver){
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function detectCollision(a, b){
    return a.x < b.x +b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
}