// JavaScript source code
var wt, ht;
var boxes = [];
var messages = 
[
	"ENEMY SPAM",
	"SOUND EFFECTS SPAM",
	"1-1 REMAKE",
	"BRING YOSHI TO GOAL",
	"TECH LEVEL",
	"PICK A DOOR/PIPE",
	"COLLECT ALL COINS",
	"MUSIC LEVEL",
	"SOFTLOCK",
	"INFINITE \n FIREFLOWER \n BOWSER",
	"NO CHECKPOINTS + \n NO CLEARCONDITION",
	"ENEMY SPAM WITH STAR",
	"GOOD LEVEL",
	"BUILDER/SUPERBALL \n LEVEL",
	"THEMED AFTER \n ANOTHER GAME",
	"KAIZO BLOCKS",
	"CHEESE",
	"AUTO",
	"\"FIRST LEVEL\" \n IN TITLE",
	"MEOWSER OR BOOM BOOM",
	"TITLE SCREEN LEVEL",
	"TERRIBLY NAMED LEVEL",
	"KILLS MARIO \n AT THE START",
	"ON/OFF BLOCKS",
	"#DGR LEVEL",
	"TROLL LEVEL",
];

function setup()
{
	wt = Math.max(Math.min(windowWidth-50, windowHeight-50), 150);
	ht = wt;
	createCanvas(wt, wt);
	for (var i = 0; i < 5; i++)
	{
		for	(var j = 0; j < 5; j++)
		{
			boxes.push(new Box(i * wt / 5, j * wt / 5, getRandomMessage(i == 2 && j == 2), i == 2 && j == 2));
		}
	}
}

function getRandomMessage(isFreeSpace)
{
	if (isFreeSpace)
	{
		return "Free Space";
	}
	else
	{
		var len = messages.length;
		var index = Math.floor(random(0,len));
		var returnVal = messages[index];
		messages.splice(index, 1);
		return returnVal;
	}
}

function draw()
{
	drawGrid();
	if (checkBingo())
	{
		textAlign(CENTER, CENTER);
		textSize(100);
		text("BINGO", wt/2, wt/2);
		noLoop();
	}
}

function checkBingo()
{
	for	(var i = 0; i < 5; i++)
	{
		if (boxes[i].isChecked && boxes[i+5].isChecked && boxes[i+10].isChecked && boxes[i+15].isChecked && boxes[i+20].isChecked)
		{
			return true;
		}
		if (boxes[5*i].isChecked && boxes[(5*i)+1].isChecked && boxes[(5*i)+2].isChecked && boxes[(5*i)+3].isChecked && boxes[(5*i)+4].isChecked)
		{
			return true;
		}
	}
	
	if (boxes[0].isChecked && boxes[6].isChecked && boxes[12].isChecked && boxes[18].isChecked && boxes[24].isChecked)
	{
		return true;
	}
	
	if (boxes[4].isChecked && boxes[8].isChecked && boxes[12].isChecked && boxes[16].isChecked && boxes[20].isChecked)
	{
		return true;
	}
	
	return false;
}

function drawGrid()
{
	for (var i = 0; i < boxes.length; i++)
	{
		boxes[i].drawBox();
	}
}

function mousePressed()
{
	for (var i = 0; i < boxes.length; i++)
	{
		if (boxes[i].isHovered())
		{
			boxes[i].click();
			break;
		}
	}
}

class Box
{
	constructor(posX, posY, message, isChecked)
	{
		this.x = posX;
		this.y = posY;
		this.message = message;
		this.isChecked = isChecked;
	}
	
	drawBox()
	{
		if (this.isChecked)
		{
			fill(color(255, 140, 0));
		}
		else if (this.isHovered())
		{
			fill(color(255, 165, 0));
		}
		else
		{
			fill(color(255, 215, 0));
		}
		
		stroke(color(0,0,0));
		square(this.x, this.y, wt / 5);
		
		fill(color(0,0,0));
		textAlign(CENTER);
		text(this.message, this.x + wt / 10, this.y + wt / 10)
	}

	isHovered()
	{
		if (mouseX < this.x)
		{
			return false;
		}
		
		if (mouseX > this.x + wt / 5)
		{
			return false;
		}
				
		if (mouseY < this.y)
		{
			return false;
		}
		
		if (mouseY > this.y + wt / 5)
		{
			return false;
		}
		
		return true;
	}

	click()
	{
		this.isChecked = !this.isChecked;
	}
}
