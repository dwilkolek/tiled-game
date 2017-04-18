this.Monster = function (ctx, monsterDefinition) {
  this.uid = ctx.generateUid();
  this.spawnId = monsterDefinition.spawnId;
  this.sprite = null;
  this.fullHp = monsterDefinition.spec.hp;
  this.hp = monsterDefinition.spec.hp;
  this.attack = monsterDefinition.spec.attack;
  this.defence = monsterDefinition.spec.defence;
  this.attackRange = ctx.RANGE[monsterDefinition.spec.attackRange];
  this.attackSpeed = ctx.ATTACK_SPEED[monsterDefinition.spec.attackSpeed];
  this.movementSpeed = ctx.MOVEMENT_SPEED[monsterDefinition.spec.movementSpeed];
  this.agility = monsterDefinition.spec.agility;
  this.exp = monsterDefinition.spec.exp;

  this.nextLocation;

  _self = this;

  var _hpBar = null

  this._tween;



  this.move = function () {
    var randomI = Math.round(Math.random() * 4);
    var moveObject = null;
    switch (randomI) {
      case 0: moveObject = {}; break;
      case 1: moveObject = { x: '-32' }; break;
      case 2: moveObject = { x: '+32' }; break;
      case 3: moveObject = { y: '-32' }; break;
      case 4: moveObject = { y: '+32' }; break;
    }

    if (moveObject) {
      if (this.checkIfMovePossible(moveObject)) {
        this.moveMonster(moveObject);
      }
    }
  }
  this.checkIfMovePossible = function (moveObject) {
    var tileX = ctx.pixelToTile(this.sprite.x + (moveObject.x ? parseInt(moveObject.x) : 0));
    var tileY = ctx.pixelToTile(this.sprite.y + (moveObject.y ? parseInt(moveObject.y) : 0));
    return ctx.checkEmptySpotOnMap(tileX, tileY, null, this);
  }
  this.moveMonster = function (moveObject) {
    var tileX = ctx.pixelToTile(this.sprite.x + (moveObject.x ? parseInt(moveObject.x) : 0));
    var tileY = ctx.pixelToTile(this.sprite.y + (moveObject.y ? parseInt(moveObject.y) : 0));

    this.nextLocation = { x: tileX, y: tileY };

    this._tween = ctx.game.add.tween(this.sprite).to(moveObject, 600, Phaser.Easing.Linear.None, false);
    this._tween.onComplete.add(() => {
      this.location = this.nextLocation;
      this.nextLocation = null;
    })
    this._tween.start();
  }

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
      ctx.player.expUp(this.exp)
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
  }

  this.blockDamage = function () {
    ctx.fightAnimate(ctx.FIGHT_STATE.SHIELDED, this.sprite);
  }





  this.spawn = function () {
    var random = function (n1, n2) {
      return Math.round((Math.random() * (n2 - n1)) + n1);
    }

    var x = -1;
    var y = -1;
    var tries = 0;

    while (x < 0 || y < 0 || !checkEmptySpotOnMap(x, y)) {
      tries++
      x = random(monsterDefinition.area.x1, monsterDefinition.area.x2);
      y = random(monsterDefinition.area.y1, monsterDefinition.area.y2);
      if (tries > 100) {
        console.log('over 100 tries on spawn');
        return null;
      }
    }

    this.location = { x: x, y: y };



    this.sprite = ctx.monstersGroup.create(ctx.tileToPixel(x), ctx.tileToPixel(y), monsterDefinition.sprite);
    this.sprite.anchor.setTo(-0.5, -0.5);
    ctx.game.physics.arcade.enable(this.sprite);
    this.sprite.enableBody = true;

    this.sprite.inputEnabled = true;
    this.sprite.events.onInputDown.add(function (e) {
      ctx.player.markTarget(this)
    }, this)

    this.moveMonster({});

    setInterval(() => {
      this.move();
    }, this.movementSpeed)

    return this;
  }

  return this.spawn();
}