this.MonsterRepo = function (ctx) {
  ctx.monstersGroup = ctx.game.add.group();

  var monsters = [];


  // // monster = {sprite: ,
  //   hp: 10,
  //     attack: 5,
  //     defence :13,
  //     attackRange: 'CLOSE',
  //     attackSpeed: 'FAST',
  //     movementSpeed: 'FAST'}

  this.kill = function (monsterUid) {
    monsters = monsters.filter(monster => {
      return monster.uid !== monsterUid;
    })
  }
  this.update = function () {
    monsters.forEach(monster => {
      monster.update();
    })
  }

  this.add = function (monster) {
    if (monster && monster.sprite) {
      monsters.push(monster);
    }
  }

  this.checkTile = function (tileX, tileY) {
    var posX = ctx.tileToPixel(tileX);
    var posY = ctx.tileToPixel(tileY);
    var empty = true;
    monsters.forEach(function (monster) {
      if (monster.sprite.x == posX && monster.sprite.y == posY) {
        empty = false;
      }
    })
    return empty;

  }

  return this;
}