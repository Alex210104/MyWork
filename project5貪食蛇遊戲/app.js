const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
// getContext() method會回傳一個canvas的drawing context
// drawing context可以用來在canvas內畫圖
const unit = 20;
const row = canvas.height / unit;
const column = canvas.width / unit;

let snake = []; //array中的每個元素都是一個物件
//物件的工作為，儲存身體的x,y座標

function createSnake() {
  snake[0] = {
    x: 80,
    y: 0,
  };

  snake[1] = {
    x: 60,
    y: 0,
  };

  snake[2] = {
    x: 40,
    y: 0,
  };

  snake[3] = {
    x: 20,
    y: 0,
  };
}

class Fruit {
  //果實製作
  //果實邏輯:隨機取數 無條件捨去 乘 行列的總數 再去乘上 unit
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }

  //畫出果實
  drawFruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  pickLocation() {
    let overlapping = false;
    let new_x;
    let new_y;

    function checkOverlap(new_x, new_y) {
      for (let i = 0; i < snake.length; i++) {
        if (new_x == snake[i].x && new_y == snake[i].y) {
          console.log("overlapping...");
          overlapping = true;
          return;
        } else {
          overlapping = false;
        }
      }
    }

    do {
      new_x = Math.floor(Math.random() * column) * unit;
      new_y = Math.floor(Math.random() * row) * unit;
      checkOverlap(new_x, new_y);
    } while (overlapping);

    this.x = new_x;
    this.y = new_y;
  }
}

//初始設定
createSnake();
let myFruit = new Fruit();

window.addEventListener("keydown", changeDirection);
let d = "Right";
function changeDirection(event) {
  //console.log(event);檢視
  if (event.key == "ArrowRight" && d != "Left") {
    d = "Right";
  } else if (event.key == "ArrowDown" && d != "Up") {
    d = "Down";
  } else if (event.key == "ArrowLeft" && d != "Right") {
    d = "Left";
  } else if (event.key == "ArrowUp" && d != "Down") {
    d = "Up";
  }

  //每次按下鍵之後，在下一幀被畫出來之前
  //不接受任何keydone事件
  //這樣可以防止連續按鍵導致蛇在邏輯上自殺
  window.removeEventListener("keydown", changeDirection);
}

let highestScore;
loadHigherScore();
let score = 0;

document.getElementById("myScore").innerHTML = "遊戲分數:" + score;
document.getElementById("myScore2").innerHTML = "最高分數:" + highestScore;
function draw() {
  //每次畫圖之前確認蛇沒有咬到自己
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(myGame);
      alert("遊戲結束");
    }
  }

  //每次畫之前都將背景設為黑色
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //執行畫出果實
  myFruit.drawFruit();

  //畫出蛇
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "red";
      //畫圖區域中索引值為0的色塊顏色
    } else {
      ctx.fillStyle = "lightblue";
    }
    ctx.strokeStyle = "orange";
    //色塊的邊框樣式

    // !!! 更正超出邊框時的座標 !!!
    // 所以要在畫出座標前加入此程式
    if (snake[i].x >= canvas.width) {
      snake[i].x = 0;
    }
    if (snake[i].x < 0) {
      snake[i].x = canvas.width - unit;
    }
    if (snake[i].y >= canvas.height) {
      snake[i].y = 0;
    }
    if (snake[i].y < 0) {
      snake[i].y = canvas.height - unit;
    }

    //x,y,width,height
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    //最後畫出圖形
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
    //畫出有框的樣式
  }

  //以目前的d變數，來決定設的下一幀位置在哪個座標
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;
  if (d == "Left") {
    snakeX -= unit;
  } else if (d == "Up") {
    snakeY -= unit;
  } else if (d == "Down") {
    snakeY += unit;
  } else if (d == "Right") {
    snakeX += unit;
  }

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  //確認蛇是否有吃到果實
  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    //重新選定 果實的新位置
    myFruit.pickLocation();

    //更新分數
    score++;
    setHighestScore(score);
    document.getElementById("myScore").innerHTML = "遊戲分數:" + score;
    document.getElementById("myScore2").innerHTML = "最高分數:" + highestScore;
  } else {
    snake.pop();
  }
  snake.unshift(newHead);
  window.addEventListener("keydown", changeDirection);
}

let myGame = setInterval(draw, 100);
//最高分設定
function loadHigherScore() {
  if (console.log(localStorage.getItem("highestScore") == null)) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}

function setHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("higherScore", score);
    highestScore = score;
  }
}
