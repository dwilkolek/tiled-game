this.Monster = function (ctx, monsterDefinition) {
  this.uid = ctx.generateUid();
  this.spawnId = monsterDefinition.spawnId;
  this.sprite = null;
  this.fullHp = monsterDefinition.spec.hp;
  this.hp = monsterDefinition.spec.hp;
  this.attack = monsterDefinition.spec.attack;
  this.defence = monsterDefinition.spec.defence;
  this.attackRange = ctx.RANGE[monsterDefinition.spec.attackRange];
  this.attackSpeed = ctx.RANGE[monsterDefinition.spec.attackRange];
  this.movementSpeed = ctx.RANGE[monsterDefinition.spec.attackRange];
  this.agility = monsterDefinition.spec.agility;



  var _hpBar = null

  this.update = function () {
    _hpBar && _hpBar.destroy();
    _hpBar = ctx.drawHp(this);
  }

  this.kill = function () {
    setTimeout(() => {
      _hpBar && _hpBar.destroy();
      this.sprite.destroy();
      ctx.spawner.killed(this.spawnId);
      ctx.monsterRepo.kill(this.uid);
      ctx.player.unmark();
    });
  }

  this.takeDamage = function (dmg) {
    ctx.fightAnimate(ctx.FIGHT_STATE.DAMAGED, this.sprite);
    this.hp -= dmg;
    if (this.hp <= 0) {
      this.kill();
    }
  }

  this.avoidDamage = function () {

    ctx.fightAnimate(ctx.FIGHT_STATE.MISSED, this.sprite);
    console.log('avoided');
  }

  this.blockDamage = function () {

    ctx.fightAnimate(ctx.FIGHT_STATE.SHIELDED, this.sprite);
    console.log('block');
  }





  this.spawn = function () {
    var random = function (n1, n2) {
      return Math.round((Math.random() * (n2 - n1)) + n1);
    }

    var x = -1;
    var y = -1;
    var tries = 0;
    while (x < 0 || y < 0 || !checkEmptySpotOnMap(x, y)) {
      // console.log('try',tryx)
      tries++
      x = random(monsterDefinition.area.x1, monsterDefinition.area.x2);
      y = random(monsterDefinition.area.y1, monsterDefinition.area.y2);
      if (tries > 100) {
        console.log('over 100 tries on spawn');
        return null;
      }
    }

    this.sprite = ctx.monstersGroup.create(ctx.tileToPixel(x), ctx.tileToPixel(y), monsterDefinition.sprite);
    // this.sprite.scale.setTo(ctx.scale, ctx.scale);
    this.sprite.anchor.setTo(-0.5, -0.5);
    ctx.game.physics.arcade.enable(this.sprite);
    this.sprite.enableBody = true;

    this.sprite.inputEnabled = true;
    this.sprite.events.onInputDown.add(function (e) {
      ctx.player.markTarget(this)
    }, this)

    return this;
  }

  return this.spawn();
}