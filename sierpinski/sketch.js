// JavaScript source code
var wt, ht;
var numberOfPoints = 3;
var vertices = [];
var middlePoints = [];
var leftTop, leftBottom, rightTop, rightBottom;

function setup()
{
  wt = 400, ht = 400;
  createCanvas(wt, ht);
  background(200);
  translate(wt / 2, ht / 2);
  fill(50);
  setupVerticesInput();
}

function setupVerticesInput()
{
  const verticesInput = document.getElementById('vertices');

  verticesInput.addEventListener('change', (event) =>
  {
    background(200);
    vertices = [];
    middlePoints = [];
    if (event.target.value >= 3)
    {
      numberOfPoints = event.target.value;
    }
    else
    {
      numberOfPoints = 3;
    }
  });
}

function draw()
{
  if (!allVerticesPlaced())
  {
    return;
  }
  for (var i = 0; i < 50; i++)
  {
    drawNewestMiddlePoint();
    addNextMiddlePoint();
  }
}

function drawNewestMiddlePoint()
{
  var lastMiddlePoint = middlePoints[middlePoints.length - 1];
  circle((numberOfPoints - 2) * lastMiddlePoint.x, (numberOfPoints - 2) * lastMiddlePoint.y, 0.1);
}

function addNextMiddlePoint()
{
  var lastMiddlePoint = middlePoints[middlePoints.length - 1];
  var targetVertex = vertices[Math.floor(Math.random() * vertices.length)];
  middlePoints.push(
  {
    x: (lastMiddlePoint.x + targetVertex.x) / (numberOfPoints - 1),
    y: (lastMiddlePoint.y + targetVertex.y) / (numberOfPoints - 1)
  })
}

function allVerticesPlaced()
{
  for (var i = 0; i < vertices.length; i++)
  {
    circle(vertices[i].x, vertices[i].y, 10);
  }

  return (vertices.length == numberOfPoints) && (middlePoints.length > 0);
}

function mouseClicked()
{
  if (mouseX < 0 || mouseX > wt || mouseY < 0 || mouseY > ht)
  {
    return;
  }

  if (vertices.length < numberOfPoints)
  {
    vertices.push(
    {
      x: mouseX,
      y: mouseY
    });
  }
  else if (middlePoints.length == 0)
  {
    middlePoints.push(
    {
      x: mouseX,
      y: mouseY
    })
  }
}
