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

  this.isEmpty = function (tileX, tileY) {
    // var posX = ctx.tileToPixel(tileX);
    // var posY = ctx.tileToPixel(tileY);
    return monsters.filter(function (monster) {
      // console.log(monster.tileX, tileX, monster.tileY, tileY)
      return monster.tileX == tileX && monster.tileY == tileY;
    }).length == 0;

  }

  return this;
}