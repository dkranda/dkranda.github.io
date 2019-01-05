class Tile {
  constructor(tileNumber) {
    this.tileNumber = tileNumber;
    this.isDown = false;
  }

  dropTile() {
    this.isDown = true;
  }
}

class Die {
  constructor(number, wt, ht, existingDice) {
    this.number = number;
    this.xpos = Math.floor(Math.random() * wt * 0.80 + (wt * 0.10));
    this.ypos = Math.floor((Math.random() * ht * 0.40) + (ht / 3) + (ht * 0.10))
    this.w = (wt * 0.08);
    this.r = (wt * 0.01);

    // avoid overlapping dice
    if (existingDice != null) {
      for (var i = 0; i < existingDice.length; i++) {
        var xdiff = (this.xpos - existingDice[i].xpos);
        var ydiff = (this.ypos - existingDice[i].ypos);

        if ((Math.abs(xdiff) < this.w) && (Math.abs(ydiff) < this.w))
        {
          if (Math.abs(xdiff) < this.w) {
            this.xpos += (Math.sign(xdiff) * this.w);
          }
          if (Math.abs(ydiff) < this.w) {
            this.ypos += (Math.sign(ydiff) * this.w);
          }
        }
      }
    }
  }
}
