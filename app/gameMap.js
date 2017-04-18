GameMap = function (ctx) {
  var map = ctx.game.add.tilemap('MyTilemap');
  map.addTilesetImage('forest_tiles', 'forest_tiles');


  layerGround = map.createLayer('Ground');
  layerObstacles = map.createLayer('Obstacles');
  // var once = false;
  // for (var i = 0; i < layerObstacles.layer.data.length; i++) {
  //   for (var j = 0; j < layerObstacles.layer.data[i].length; j++) {
  //     // layerObstacles.layer.data[i][j].collideUp = true;
  //     // layerObstacles.layer.data[i][j].collideDown = true;
  //     // layerObstacles.layer.data[i][j].collideLeft = true;
  //     // layerObstacles.layer.data[i][j].collideRight = true;

  //     // // text = game.add.text(j * 32, i * 32, j + ',' + i);

  //     // // //	Center align
  //     // // // text.anchor.set(0.5);
  //     // // text.align = 'center';

  //     // // //	Font style
  //     // // text.font = 'Arial Black';
  //     // // text.fontSize = 6;
  //     // // // text.fontWeight = 'bold';

  //     // // //	Stroke color and thickness
  //     // // text.stroke = '#000000';
  //     // // text.strokeThickness = 2;
  //     // // text.fill = '#43d637';
  //   }
  // }

  return this;
}

this.checkEmptySpotOnMap = function (tileX, tileY, player, monster) {
  if (tileX < 0 || tileY < 0) {
    return false;
  }
  var isEmpty = this.monsterRepo && this.monsterRepo.isEmpty(tileX, tileY, monster);
  if (isEmpty === false) {
    return false;
  }
  var isEmptyP = this.playerRepo && this.playerRepo.isEmpty(tileX, tileY, player);
  if (isEmptyP === false) {
    return false;
  }
  var row = layerObstacles.layer.data[tileY];
  var tile = row ? row[tileX] : null;
  return tile ? tile.index < 1 : false;
}