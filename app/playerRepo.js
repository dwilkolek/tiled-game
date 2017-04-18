this.PlayerRepo = function (ctx) {
  ctx.playersGroup = ctx.game.add.group();

  this.players = [];

  this.add = function (player) {

    if (player && player.sprite) {
      this.players.push(player);
    }
  }

  this.isEmpty = function (tileX, tileY, player) {

    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i] !== player) {
        if (tileX == this.players[i].location.x && tileY == this.players[i].location.y) {
          return false;
        }
        if (this.players[i].nextLocation) {
          if (tileX == this.players[i].nextLocation.x && tileY == this.players[i].nextLocation.y) {
            return false;
          }
        }
      }
    }
    return true;
  }

  return this;
}