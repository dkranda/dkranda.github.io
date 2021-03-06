var curMouseX, curMouseY, prevMouseX, prevMouseY;
var wt,ht;
var chicken;
var img;

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

	var xDir = curMouseX - prevMouseX;
	var yDir = curMouseY - prevMouseY;

	var coordinatesToCheck = getCoordinatesToCheck(curMouseX, curMouseY, prevMouseX, prevMouseY);
	
	for (var i = 0; i < coordinatesToCheck.length; i++)
	{
		if (distance(coordinatesToCheck[i].x, coordinatesToCheck[i].y, chicken.x, chicken.y) < 0.1 * wt)
		{
			chicken.hit(xDir, yDir);
			return;
		}
	}
}

function getCoordinatesToCheck(x1, y1, x2, y2)
{
	var coords = [];
	if (x1 == x2)
	{
		if (y1 < y2)
		{
			for (var i = y1; i <= y2; i++)
			{
				coords.push({x: x1, y:i});
			}
		}
		else
		{
			for (var i = y2; i <= y1; i++)
			{
				coords.push({x: x1, y:i});
			}
		}
	}
	else if (y1 == y2)
	{
		if (x1 < x2)
		{
			for (var i = x1; i <= x2; i++)
			{
				coords.push({x: i, y:y1});
			}
		}
		else
		{
			for (var i = x2; i <= x1; i++)
			{
				coords.push({x: i, y:y1});
			}
		}
	}
	else
	{
		var slope = (y2 - y1)/(x2 - x1);
		var b = (y1 - slope * x1);
		if (x1 < x2)
		{
			for (var i = x1; i <= x2; i++)
			{
				coords.push({x: i, y: (slope * i + b)});
			}
		}
		else
		{
			for (var i = x2; i <= x1; i++)
			{
				coords.push({x: i, y: (slope * i + b)});
			}
		}
	}
	return coords;
}

function mousePressed()
{
	chicken = new Chicken(0.75 * wt, 0.5 * wt, 0, 0);
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
		if (this.x < 0)
		{
			this.x = 0;
			this.xDir = -this.xDir;
		}
		if (this.x > wt)
		{
			this.x = wt;
			this.xDir = -this.xDir;
		}
		
		if (this.y < 0)
		{
			this.y = 0;
			this.yDir = -this.yDir;
		}
		
		if (this.y > ht)
		{
			this.y = ht;
			this.yDir = -this.yDir;
		}
				
		this.xDir = 0.99 * this.xDir;
		this.yDir = 0.99 * this.yDir;
		
		if (Math.abs(this.xDir) < 0.1 && Math.abs(this.yDir) < 0.1) 
		{
			this.xDir = 0;
			this.yDir = 0;
		}

		this.x = this.x + this.xDir;
		this.y = this.y + this.yDir;
		
		this.isDone = (this.xDir == 0 && this.yDir == 0 && this.isHit);
		if (!this.isDone && this.isHit) 
		{ 
			var scoreIncrease = Math.sqrt(Math.pow(this.xDir, 2) + Math.pow(this.yDir, 2));
			this.score = this.score + Math.ceil( scoreIncrease / 10 ); 
		}
	}
	
	draw()
	{
		imageMode(CENTER);
		image(img, this.x, this.y, 0.12 * wt, 0.12 * wt);
	}	
}
