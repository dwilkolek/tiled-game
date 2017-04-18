this.MonsterRepo = function (ctx) {
  ctx.monstersGroup = ctx.game.add.group();

  this.monsters = [];

  this.kill = function (monsterUid) {
    this.monsters = this.monsters.filter(monster => {
      return monster.uid !== monsterUid;
    })
  }
  this.update = function () {
    this.monsters.forEach(monster => {
      monster.update();
    })
  }

  this.add = function (monster) {
    if (monster && monster.sprite) {
      this.monsters.push(monster);
    }
  }

  this.isEmpty = function (tileX, tileY, monster) {
    for (var i = 0; i < this.monsters.length; i++) {
      if (monster !== this.monsters[i]) {
        if (this.monsters[i].location) {
          if (tileX == this.monsters[i].location.x && tileY == this.monsters[i].location.y) {
            return false;
          }
        }
        if (this.monsters[i].nextLocation) {
          if (tileX == this.monsters[i].nextLocation.x && tileY == this.monsters[i].nextLocation.y) {
            return false;
          }
        }
      }

    }

    return true;
  }

  return this;
}