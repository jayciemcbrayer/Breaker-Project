//Varibles
const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');
const canvas = document.getElementById('canvas');
const ctx /*(context)*/ = canvas.getContext('2d');
const brickRowCount = 9;
const brickColumnCount = 5;
let score = 0;

//Create ball props
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  //Animation-
  speed: 4,
  dx: 4, //speed of direction on x axis
  dy: -4, //speed of direction on y axis
}

//Create paddle props
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0
}

//Create brick props
const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true
}

//Create bricks
const bricks = []
for(let i = 0; i < brickRowCount; i++){
  bricks[i] = [];
  for (let j = 0; j < brickColumnCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

//Draw ball onto canvas
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = "#0095dd";
  ctx.fill();
  ctx.closePath();
}

//Draw paddle onto canvas
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = "#0095dd";
  ctx.fill();
  ctx.closePath();
}

//Draw score on canvas
function drawScore() {
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

//Draw bricks on canvas
function drawBricks() {
  bricks.forEach(column => {
    column.forEach(brick => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent';
      ctx.fill();
      ctx.closePath();
    })
  })
}

//Move paddle on canvas
function movePaddle() {
  paddle.x += paddle.dx;

  //Wall detection
  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }

  if (paddle.x < 0) {
    paddle.x = 0;
  }
}

//Move ball on canvas
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
  //Wall collision (x axis / right + left)
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1;
  }
  //Wall collision (y axis / top + bottom)
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }
  //Paddle collision
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    paddle.dy = -ball.speed;
  }
  //Brick collision
  bricks.forEach(column => {
    column.forEach(brick => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x && //checks left side of brick
          ball.x + ball.size < brick.x + brick.w && //checks right side of brick
          ball.y + ball.size > brick.y && //checks the top of the brick
          ball.y - ball.size < brick.y + brick.h //checks the bottom of the brick
        ) {
          ball.dy *= -1;
          brick.visible = false;
        //Increase score when brick dissapears
          increaseScore(); //function below in code, called in here
        }
      }
    });
  });

  //Hit bottom of game screen - player loses
  if (ball.y + ball.size > canvas.height) {
    showAllBricks();
    score = 0;
  }
}


//Increase score
function increaseScore() {
  score++;

  if (score % (brickRowCount * brickRowCount) === 0) {
    showAllBricks();
  }
}

//Make all bricks appear
function showAllBricks() {
  bricks.forEach(column => {
    column.forEach(brick => (brick.visible = true));
  });
}

//Draw everything on screen
function draw() {
  //Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
}
//Update canvas drawing and animations
function update() {
  movePaddle();
  moveBall();
  //Draw everything within another function (changes scope)
  draw();
  requestAnimationFrame(update);
}
update();

//Keydown event 
function keyDown(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    paddle.dx = paddle.speed;
  } else if (e.key === 'Left' || e.key === "ArrowLeft") {
    paddle.dx = -paddle.speed;
  }
}

//Keyup event
function keyUp(e) {
  if (
    e.key === 'Right' ||
    e.key === 'ArrowRight' ||
    e.key === 'Left' ||
    e.key === "ArrowLeft"
  ) {
    paddle.dx = 0;
  }
}

//Keyboard event listeners
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

//Show Rules and Close Rules Event Listeners
rulesBtn.addEventListener('click', () =>
  rules.classList.add('show'));
closeBtn.addEventListener('click', () =>
  rules.classList.remove('show'));