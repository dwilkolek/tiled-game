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

  this.tileX;
  this.tileY;

  _self = this;

  var _hpBar = null

  // var drawHp = function () {
  // }

  this._tween;



  this.move = function () {
    // console.log('movement mob')
    // console.log(ctx.monstersGroup)
    // var collistionWithMonster = ctx.game.physics.arcade.collide(ctx.monstersGroup);
    // if (collistionWithMonster) {
    //   console.log(true)
    // }


    // var t2 = new Date().getMilliseconds();
    // _sprite.angle += 1;
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
    var posX = this.sprite.x + (moveObject.x ? parseInt(moveObject.x) : 0);
    var posY = this.sprite.y + (moveObject.y ? parseInt(moveObject.y) : 0);

    var tileY = posY / 32 + 0.5;
    var tileX = posX / 32 + 0.5;
    return ctx.checkEmptySpotOnMap(tileX, tileY);
  }
  this.moveMonster = function (moveParams) {
    // _allowInput = false;
    // _sprite.input.enabled = false;
    // _lastPosition = { x: parseInt(self.sprite.x), y: parseInt(_sprite.y) };

    this._tween = ctx.game.add.tween(this.sprite).to(moveParams, 600, Phaser.Easing.Linear.None, false);
    this._tween.onComplete.add(() => {
      // console.log(this.sprite.x/32 - 0.5)
      this.tileX = this.sprite.x/32 - 0.5;
      this.tileY = this.sprite.y/32 - 0.5;

    })
    this._tween.start();
    // _allowInputTimeout = setTimeout(function () {

    //   // _sprite.input.enabled = true;
    // }, 700);
  }

  this.update = function () {

    _hpBar && _hpBar.destroy();
    _hpBar = ctx.drawHp(this);

    var collistionWithMonster = ctx.game.physics.arcade.collide(this.sprite, ctx.monstersGroup);
    var collisionWithPlayer = ctx.game.physics.arcade.collide(this.sprite, ctx.player.getSprite());
    // console.log('collistionWithMonster', collistionWithMonster)
    if (collistionWithMonster || collisionWithPlayer) {
      if (this._tween) {
        this._tween.reverse = true;
      }
      return;
    }
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

    // var px = (ctx.player.getSprite().x+16)/32;
    // var py = (ctx.player.getSprite().y+16)/32;

    while (x < 0 || y < 0 || !checkEmptySpotOnMap(x, y)) { //|| (px == x && py == y)
      // console.log('try',tryx)
      tries++
      x = random(monsterDefinition.area.x1, monsterDefinition.area.x2);
      y = random(monsterDefinition.area.y1, monsterDefinition.area.y2);
      if (tries > 100) {
        console.log('over 100 tries on spawn');
        return null;
      }
    }

    this.tileX = x;
    this.tileY = y;

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

  setInterval(() => {
    this.move();
  }, this.movementSpeed)

  return this.spawn();
}