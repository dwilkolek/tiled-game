Player = function (ctx, px, py) {

  this.attack = 18;
  this.defence = 13;
  this.agility = 10;
  this.fullHp = 300;
  this.hp = 200;
  this.attackRange = ctx.RANGE.SEMI_RANGED;

  this.lvl = 2;
  this.exp = 0;
  this.requiredExp = (this.lvl + 1) * 300;

  this.nextLocation;
  this.sprite;

  var _allowInput = true;
  var _allowAttack = true;
  var _allowInputTimeout = null;
  var _allowIAttackTimeout = null;

  var _tween = null;
  var x = px;
  var y = py;
  var range = 1;

  var foundSpot = ctx.checkEmptySpotOnMap(x, y);

  while (!foundSpot) {

    for (var i = x - range; i <= x + range; i++) {
      if (ctx.checkEmptySpotOnMap(i, y - range)) {
        foundSpot = true;
        x = i;
        y = y - range;
        break;
      }
      if (ctx.checkEmptySpotOnMap(i, y + range)) {
        foundSpot = true;
        x = i;
        y = y - range;
        break;
      }
    }

    if (foundSpot) {
      break;
    }


    for (var i = y - range; i <= y + range; i++) {
      if (ctx.checkEmptySpotOnMap(x - range, i)) {
        foundSpot = true;
        x = x - range;
        y = i;
        break;
      }

      if (ctx.checkEmptySpotOnMap(x + range, i)) {
        foundSpot = true;
        x = x + range;
        y = i;
        break;
      }
    }

    range++;
    if (range > 20) {
      throw new DOMException('SOMETHING WENT HORRIBLY WRONG');
    }
  }


  this.location = { x: x, y: y }
  this.sprite = ctx.game.add.sprite(ctx.tileToPixel(x), ctx.tileToPixel(y), 'player');
  this.sprite.inputEnabled = true;
  this.target = null;

  this.sprite.anchor.setTo(-0.5, -0.5);
  ctx.game.camera.follow(this.sprite, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

  ctx.game.physics.arcade.enable(this.sprite);
  this.sprite.enableBody = true;
  this.sprite.body.collideWorldBounds = true;
  this.sprite.body.immovable = true;

  this._cursors = ctx.game.input.keyboard.createCursorKeys();

  this.getSprite = function () {
    return this.sprite;
  }

  this.move = function () {
    if (_allowInput) {

      var moveObject = null;
      if (this._cursors.left.isDown) {
        moveObject = { x: '-32' };
      } else if (this._cursors.right.isDown) {
        moveObject = { x: '+32' };        // player.x += 32;
      } else if (this._cursors.up.isDown) {
        moveObject = { y: '-32' };        // player.x += 32;
      } else if (this._cursors.down.isDown) {
        moveObject = { y: '+32' };      // player.x += 32;
      }
      if (moveObject) {
        if (this.checkIfMovePossible(moveObject)) {
          this.movePlayer(moveObject);
        }
      }
    }
  }


  this.makeAttack = function () {
    if (this.target && _allowAttack) {
      _allowAttack = false;
      var dist = game.physics.arcade.distanceBetween(this.sprite, this.target.sprite);
      if (dist <= _self.attackRange) {
        ctx.dmgSolver(_self, this.target);
        _allowIAttackTimeout = setTimeout(function () {
          _allowAttack = true;
        }, 1000)
      } else {
        _allowAttack = true;
      }
    }
  }

  this.expUp = function (exp) {
    console.log(this.lvl + 'lvl: ' + exp + 'exp', 'missing' + (this.requiredExp - this.exp))
    this.exp += exp;
    while (this.exp > this.requiredExp) {
      this.exp -= this.requiredExp;
      this.lvl += 1;
      this.requiredExp = (this.lvl + 1) * 300;
      console.log('lvl up');
    }
  }

  this.markTarget = function (target) {
    this.target = target;
  }
  this.unmark = function () {
    this.target = null;
  }

  var rollbackMove = function () {
    _tween.reverse = true;
  }

  this.checkIfMovePossible = function (moveObject) {
    var tileX = pixelToTile(this.sprite.x + (moveObject.x ? parseInt(moveObject.x) : 0));
    var tileY = pixelToTile(this.sprite.y + (moveObject.y ? parseInt(moveObject.y) : 0));
    return ctx.checkEmptySpotOnMap(tileX, tileY, this, null);
  }
  this.movePlayer = function (moveObject) {
    _allowInput = false;
    var tileX = pixelToTile(this.sprite.x + (moveObject.x ? parseInt(moveObject.x) : 0));
    var tileY = pixelToTile(this.sprite.y + (moveObject.y ? parseInt(moveObject.y) : 0));

    this.nextLocation = { x: tileX, y: tileY }

    _tween = ctx.game.add.tween(this.sprite).to(moveObject, 600, Phaser.Easing.Linear.None, false);
    _tween.onComplete.add(() => {
      this.location = this.nextLocation;
      this.nextLocation = null;
      _allowInput = true;
    })

    _tween.start();
  }

  _highlightTargetArea = null
  this.highlightTarget = function () {
    _highlightTargetArea && _highlightTargetArea.destroy();
    if (this.target) {
      _highlightTargetArea = game.add.graphics(32, 32);
      var color = 0xFFFFFF;
      var dist = ctx.game.physics.arcade.distanceBetween(this.sprite, this.target.sprite);
      // console.log(dist)
      if (dist < ctx.RANGE.RANGED) {
        color = 0xCCCC00;
      }
      if (dist < ctx.RANGE.SEMI_RANGED) {
        color = 0xDD8800;
      }
      if (dist < ctx.RANGE.CLOSE) {
        color = 0xFF0000;
      }

      _highlightTargetArea.lineStyle(2, color, 1);
      _highlightTargetArea.drawRect(this.target.sprite.x - 16, this.target.sprite.y - 16, 32, 32);
    }
  }


  this.takeDamage = function (dmg) {
    console.log('player takes dmg:' + dmg)
  }
  this.avoidDamage = function () {
    console.log('player avoids');
  }
  this.takeDamage = function () {
    console.log('player blocks');
  }


  this.update = function () {
    // return;
    this.move();
    this.highlightTarget();
    this.makeAttack();
  }

  ctx.playerRepo.add(this);

  return this;

}