var curMouseX, curMouseY, prevMouseX, prevMouseY;
var wt,ht;
var chicken;
var img;
var score = 0;

function preload()
{
	img = loadImage('../assets/chicken.png');
}

function setup()
{
	wt = Math.min(windowWidth, windowHeight);
	ht = wt;
	createCanvas(wt, ht);
	chicken = new Chicken(0.75 * wt, 0.5 * wt, 0, 0);
}


function draw()
{
	clear();
	drawBackground();
	updateChicken();
}

function drawBackground()
{
	// left wall
	fill(color(119, 104, 84));
	rect(0, 0, wt / 4, ht);

	// green screen
	fill(color(0, 179, 0));
	rect(wt / 4, 0, 3 * wt / 4, 3 * ht / 5);

	// floor
	fill(color(233, 204, 164));
	quad(0, ht, wt / 4, 3 * ht / 5, wt, 3 * ht / 5, wt, ht);

	// dog bed
	fill(color(153, 153, 153));
	ellipse(wt / 3, 5 * ht / 8, wt / 4, wt / 6);

	drawScore();
	drawRetry();
}

function drawScore()
{
	textSize(0.05 * wt);
	fill(color(255, 255, 255));
	stroke(color(0, 0, 0));
	text('Score: ' + chicken.score, 0.05 * wt, 0.95 * ht);
}

function drawRetry()
{
	if (chicken.isHit && chicken.isDone)
	{
		textSize(0.05 * wt);
		fill(color(255, 255, 255));
		stroke(color(0, 0, 0));
		text('Click to try again', 0.3 * wt, 0.4 * ht);
	}
}

function updateChicken()
{
	chicken.update();
	chicken.draw();
}

function mouseMoved()
{
	if (!chicken) { return; }
	
	prevMouseX = curMouseX;
	prevMouseY = curMouseY;
	
	curMouseX = mouseX;
	curMouseY = mouseY;
	
	if (distance(mouseX, mouseY, chicken.x, chicken.y) < 0.1 * wt)
	{
		chicken.hit(curMouseX - prevMouseX, curMouseY - prevMouseY);
	}
}

function mousePressed()
{
	if (chicken.isHit && chicken.isDone)
	{
		chicken = new Chicken(0.75 * wt, 0.5 * wt, 0, 0);
	}
}

function distance(x1, y1, x2, y2)
{
	return Math.sqrt(Math.pow((x1 - x2),2) + Math.pow((y1 - y2),2));
}

class Chicken
{
	constructor(initX, initY, xDir, yDir)
	{
		this.x = initX;
		this.y = initY;
		this.xDir = xDir;
		this.yDir = yDir;
		this.score = 0;
		this.isDone = false;
		this.isHit = false;
	}
	
	hit(xDir, yDir)
	{
		
		if (!this.isDone && !this.isHit)
		{
			this.isHit = true;
			this.xDir = this.xDir + xDir;
			this.yDir = this.yDir + yDir;
		}
	}
	
	update()
	{
		if (this.x < 0 || this.x > wt)
		{
			this.xDir = -this.xDir;
		}
		
		if (this.y < 0 || this.y > ht)
		{
			this.yDir = -this.yDir;
		}
		
		
		this.xDir = this.xDir - 0.1 * Math.sign(this.xDir);
		if (Math.abs(this.xDir) < 0.03) { this.xDir = 0; }
		this.yDir = this.yDir - 0.1 * Math.sign(this.yDir);
		if (Math.abs(this.yDir) < 0.03) { this.yDir = 0; }

		this.x = this.x + this.xDir;
		this.y = this.y + this.yDir;
		
		this.isDone = (this.xDir == 0 && this.yDir == 0 && this.isHit);
		if (!this.isDone && this.isHit) { this.score++; }
	}
	
	draw()
	{
		image(img, this.x, this.y, 0.1 * wt, 0.1 * wt);
	}	
}
