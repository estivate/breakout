import "./style.css";

let canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
if (canvas == null) {
  throw new Error("No Canvas element in DOM to attache to.");
}

let ctx = canvas.getContext("2d")!;

let x = canvas.width / 2;
let y = canvas.height - 30;
let ballSpeed = 6;
let dx = ballSpeed;
let dy = -ballSpeed;
let ballRadius = 10;
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;

let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

var score = 0;
var lives = 3;

var bricks: any[][] = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = {
      x: 0,
      y: 0,
      status: 1,
    };
  }
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        let brick_x = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brick_y = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brick_x;
        bricks[c][r].y = brick_y;
        ctx.beginPath();
        ctx.rect(brick_x, brick_y, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.strokeStyle = "rgba(0,0,255,0.5)";
  ctx.stroke();
  ctx.closePath();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLifeCounter();
  checkPaddleCollide();
  checkBrickCollide();

  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e: { clientX: number; }) {
  let relativeX = e.clientX - canvas.offsetLeft;
  if(relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth/2;
  }
}

function keyDownHandler(e: { key: string }) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e: { key: string }) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

draw();

function checkPaddleCollide() {
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    // paddle hit!
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      lives --;
      if (!lives) {
        alert("Game Over");
        document.location.reload();
      } else {
        x = canvas.width/2;
        y = canvas.height-30;
        dx = ballSpeed;
        dy = -ballSpeed;
        paddleX = (canvas.width-paddleWidth)/2;
      }

    }
  }

  if (rightPressed) {
    paddleX += 7;
    if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
  } else if (leftPressed) {
    paddleX -= 7;
    if (paddleX < 0) {
      paddleX = 0;
    }
  }
}

function checkBrickCollide() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      if (b.status == 1){
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          score++;
          if(score == brickRowCount*brickColumnCount) {
            alert("YOU WIN! CONGRATULATIONS!");
            document.location.reload();
          }
        }
      }

    }
  }
}

function drawScore() {
  ctx.font="16px Ariel";
  ctx.fillStyle="#0095DD";
  ctx.fillText("Score: " + score, 8, 20);
}

function drawLifeCounter() {
  ctx.font="16px Ariel";
  ctx.fillStyle="#0095DD";
  ctx.fillText("Lives: " + lives, canvas.width-65, 20);
}