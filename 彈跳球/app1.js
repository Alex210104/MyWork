const c = document.getElementById("myCanvas");
const canvasHeight = c.height;
const canvasWidth = c.width;
const ctx = c.getContext("2d");
let circle_x = 160;
let circle_y = 60;
let radius = 20;
let xspeed = 20;
let yspeed = 20;
//彈跳板座標
let ground_x = 100;
let ground_y = 500;
//彈跳板高度
let ground_height = 5;
let brickArray = [];
let count = 0;
let test;

function checkOverlap(new_x, new_y) {
  for (let i = 0; i < brickArray.length; i++) {
    if (new_x === brickArray[i].x && new_y === brickArray[i].y) {
      console.log("overlapping...");
      return true;
    }
  }
  return false;
}

// 重新生成新座標的磚塊
function generateNewBrick() {
  let new_x, new_y;
  const step = 10; // 增加的精確度

  new_x = Math.floor((Math.random() * (950 - 50)) / step) * step + 50;
  new_y = Math.floor((Math.random() * (550 - 50)) / step) * step + 50;

  if (checkOverlap(new_x, new_y)) {
    return generateNewBrick(); // 重新生成新的座標
  }

  new Brick(new_x, new_y);
}

function getRandomArbitrary(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

//製作磚塊
class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    brickArray.push(this);
    this.visible = true;
  }

  drawBrick() {
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  touchingBall(ballX, ballY) {
    return (
      ballX >= this.x - radius &&
      ballX <= this.x + this.width + radius &&
      ballY <= this.y + this.height + radius &&
      ballY >= this.y - radius
    );
  }
}

//製作所有的磚塊

for (let i = 0; i < 10; i++) {
  new Brick(getRandomArbitrary(0, 950), getRandomArbitrary(0, 550));
}

//移動彈跳板
c.addEventListener("mousemove", (e) => {
  ground_x = e.clientX;
});

function drawCircle() {
  //確認球打到磚塊
  brickArray.forEach((brick) => {
    if (brick.visible && brick.touchingBall(circle_x, circle_y)) {
      count++;
      console.log(count);
      brick.visible = false;
      //改變x,y方向速度，並將brick從brickArray中移除
      //不管從上下方撞擊磚塊都是yspeed*=-1
      if (circle_y >= brick.y + brick.height || circle_y <= brick.y) {
        yspeed *= -1;
      } else if (circle_x >= brick.x + brick.width || circle_x <= brick.x) {
        xspeed *= -1;
      }
      // brickArray.splice(index, 1);
      if (count == 10) {
        alert("遊戲結束");
        clearInterval(game);
      }
    }
  });

  //確認球打到彈跳板
  if (
    circle_x >= ground_x - radius &&
    circle_x <= ground_x + 200 + radius &&
    circle_y >= ground_y - radius &&
    circle_y <= ground_y + radius
  ) {
    if (yspeed > 0) {
      circle_y -= 40;
    } else {
      circle_y += 40;
    }
    yspeed *= -1;
  }

  //確認球有無打到邊界
  if (circle_x >= canvasWidth - radius) {
    xspeed *= -1;
  }
  if (circle_x <= radius) {
    xspeed *= -1;
  }
  if (circle_y >= canvasHeight - radius) {
    yspeed *= -1;
  }
  if (circle_y <= radius) {
    yspeed *= -1;
  }
  circle_x += xspeed;
  circle_y += yspeed;
  //畫出黑色背景
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  //畫出所有的磚塊
  brickArray.forEach((brick) => {
    if (brick.visible) {
      brick.drawBrick();
    }
  });

  //畫出彈跳板
  ctx.fillStyle = "red";
  ctx.fillRect(ground_x, ground_y, 200, ground_height);

  //畫出球
  ctx.beginPath();
  ctx.arc(circle_x, circle_y, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "yellow";
  ctx.fill();
}

let game = setInterval(drawCircle, 25);
