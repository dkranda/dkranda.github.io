// JavaScript source code
var wt, ht, zippy;
var zippyX, zippyY;
var treatCount = 0;
var collisionDist;
var treats = [];

function preload()
{
	zippy = loadImage('https://static-cdn.jtvnw.net/emoticons/v1/300595711/1.0');
}

function setup()
{
	wt = Math.min(windowWidth, windowHeight);
	ht = wt;
	zippyX = 0.29 * wt;
	zippyY = 0.58 * wt;
	collisionDist = wt / 30;
	createCanvas(wt, ht);
}

function draw()
{
	drawBackground();
	updateTreats();
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

	drawZippy();
	drawScore();
}

function drawZippy()
{
	var zippyXconst = wt / 2.75;
	var zippyYconst = 5 * wt / 8;
	
	//legs
	fill(255, 255, 255);
	rect(zippyXconst - wt / 12, zippyYconst + wt / 40, wt / 100, wt / 100 + wt / 30);
	rect(zippyXconst - wt / 20, zippyYconst + wt / 40, wt / 100, wt / 100 + wt / 30);
	rect(zippyXconst + wt / 25, zippyYconst + wt / 40, wt / 100, wt / 100 + wt / 30);
	rect(zippyXconst + wt / 15, zippyYconst + wt / 40, wt / 100, wt / 100 + wt / 30);
	
	//tail
	fill(255, 255, 255);
	quad(zippyXconst + 0.08 * wt, zippyYconst,
	zippyXconst + 0.1 * wt, zippyYconst + 0.001 * wt, 
	zippyXconst + 0.12 * wt, zippyYconst - 0.04 * ht, 
	zippyXconst + 0.1 * wt, zippyYconst - 0.05 * ht);
	
	// body
	fill(255, 255, 255);
	ellipse(zippyXconst, zippyYconst, wt / 5, wt / 12);
	fill(color(210, 180, 140));
	ellipse(zippyXconst, zippyYconst - wt / 40, wt / 15, wt / 30);
	
	//head
	imageMode(CENTER);
	image(zippy, zippyX, zippyY, wt / 10, ht / 10);
	zippyY = zippyY + Math.sin(frameCount / 20) * (ht / 1000);
}

function drawScore()
{
	textSize(wt / 30);
	fill(color(255, 255, 255));
	strokeWeight(wt / 250);
	stroke(color(0, 0, 0));
	text('Score: 0', wt / 15, 14 * ht / 15);
	strokeWeight(1);
	
	textSize(wt / 4);
	fill(color(255, 255, 255));
	strokeWeight(wt / 250);
	stroke(color(0, 0, 0));
	text('DOG', 0.4 * wt, 0.25 * ht);
	strokeWeight(1);
}

function updateTreats()
{
	for (var i = 0; i < treats.length; i++)
	{
		treats[i].updateTreat();
		treats[i].drawTreat();
	}
}

function mouseClicked()
{
	treats.push(new Treat(mouseX, mouseY));
}

class Treat
{
	constructor(initialX, initialY)
	{
		this.x = initialX;
		this.y = initialY;
		this.yVelocity = -1 * (wt * 0.05);
		this.isLanded = false;
		this.xDirToZippy = Math.sign(this.x - zippyX);
		this.xDistToZippy = Math.abs(this.x - zippyX);
		this.treatNum = treatCount++;
	}
	
	drawTreat()
	{
		fill(color(150, 75, 0));
		circle(this.x, this.y, wt / 30);
	}

	updateTreat()
	{
		if (this.isLanded)
		{
			return;
		}
		else if ((this.distance(this.x, this.y, zippyX, zippyY) < (collisionDist * collisionDist)) || this.isCloseToAnotherTreat())
		{
			this.isLanded = true;
			return;
		}
		else if (Math.abs(this.x - zippyX) > (2 * wt) || Math.abs(this.y - zippyY) > (2 * ht))
		{
			this.isLanded = true;
			return;
		}
		else
		{
			this.x = this.x - (this.xDirToZippy * (this.xDistToZippy / 25 + wt / 250));
			this.yVelocity = this.yVelocity + (wt * 0.005);
			this.y = this.y + this.yVelocity;
		}
	}

	isCloseToAnotherTreat()
	{
		for (var i = 0; i < treats.length; i++)
		{
			if (treats[i].treatNum == this.treatNum)
			{
				continue;
			}
			if (this.distance(this.x,this.y, treats[i].x, treats[i].y) < (collisionDist * collisionDist))
			{
				return true;
			}
		}
		return false;
	}
	
	distance(x1,y1,x2,y2)
	{
		return Math.abs((x1 - x2)*(x1 - x2) + (y1 - y2) * (y1 - y2));
	}
}
