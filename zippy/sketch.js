//----------------------------------------------------
// Copyright 2020 Epic Systems Corporation
//----------------------------------------------------

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
	zippyX = wt / 3;
	zippyY = 5 * ht / 8;
	collisionDist = wt / 20;
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
	imageMode(CENTER);
	image(zippy, zippyX, zippyY, wt / 10, ht / 10);
}

function drawScore()
{
	textSize(wt / 30);
	fill(color(255, 255, 255));
	strokeWeight(wt / 250);
	stroke(color(0, 0, 0));
	text('Score: 0', wt / 15, 14 * ht / 15);
	strokeWeight(1)
}

function updateTreats()
{
	for (var i = 0; i < treats.length; i++)
	{
		treats[i].updateTreat();
		drawTreat(treats[i]);
	}
}

function drawTreat(treat)
{
	fill(color(150, 75, 0));
	circle(treat.x, treat.y, wt / 30);
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
		this.yVelocity = -50;
		this.isLanded = false;
		this.xDirToZippy = Math.sign(this.x - zippyX);
		this.xDistToZippy = Math.abs(this.x - zippyX);
		this.treatNum = treatCount++;
	}

	updateTreat()
	{
		if (this.isLanded)
		{
			return;
		}
		else if (Math.abs(this.x - zippyX) < collisionDist && Math.abs(this.y - zippyY) < collisionDist || this.isCloseToAnotherTreat())
		{
			this.isLanded = true;
			return;
		}
		else
		{
			this.x = this.x - (this.xDirToZippy * (this.xDistToZippy / 25 + wt / 250));
			this.yVelocity = this.yVelocity + 5;
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
			if (Math.abs(this.x - treats[i].x) < collisionDist && Math.abs(this.y - treats[i].y) < collisionDist)
			{
				return true;
			}
		}
		return false;
	}
}