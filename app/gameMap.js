var GameMap = function (ctx) {
  var map = ctx.game.add.tilemap('MyTilemap');
  map.addTilesetImage('forest_tiles', 'forest_tiles');


  layerGround = map.createLayer('Ground');
  layerObstacles = map.createLayer('Obstacles');
  var once = false;
  for (var i = 0; i < layerObstacles.layer.data.length; i++) {
    for (var j = 0; j < layerObstacles.layer.data[i].length; j++) {
      layerObstacles.layer.data[i][j].collideUp = true;
      layerObstacles.layer.data[i][j].collideDown = true;
      layerObstacles.layer.data[i][j].collideLeft = true;
      layerObstacles.layer.data[i][j].collideRight = true;
      // if (!once) {
      //   console.log(layerObstacles.layer.data[i][j])
      //   once = true;
      // }

    }
  }

  // game.physics.arcade.enable(layerObstacles)
  // map.setCollisionByExclusion([0], true, layerObstacles)
  return this;
}

this.checkEmptySpotOnMap = function (tileX, tileY, includePlayer) {
  var anyMonster = this.monsterRepo && this.monsterRepo.isEmpty(tileX,tileY);
  if (anyMonster === false) {
    return false;
  }
  var row = layerObstacles.layer.data[tileY];
  var tile = row ? row[tileX] : null;
  return tile ? tile.index < 1 : false;
}