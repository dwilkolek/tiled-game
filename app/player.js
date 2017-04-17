Player = function (ctx) {

  _self = this;
  this.attack = 10;
  this.defence = 10;
  this.agility = 10;
  this.fullHp = 300;
  this.hp = 200;
  this.attackRange = ctx.RANGE.SEMI_RANGED;

  this.lvl = 2;




  var _allowInput = true;
  var _allowAttack = true;
  var _allowInputTimeout = null;
  var _allowIAttackTimeout = null;

  var _tween = null;
  var _sprite = ctx.game.add.sprite(ctx.tileToPixel(80), ctx.tileToPixel(100), 'player');

  // _sprite.scale.setTo(ctx.scale, ctx.scale);
  var _target = null;

  _sprite.anchor.setTo(-0.5, -0.5);
  ctx.game.camera.follow(_sprite, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
  // console.log('_sprite', _sprite.body);

  ctx.game.physics.arcade.enable(_sprite);
  _sprite.enableBody = true;
  _sprite.body.collideWorldBounds = true;
  _sprite.body.immovable = true;

  var _cursors = ctx.game.input.keyboard.createCursorKeys();
  // _sprite.input.enabled = true;

  var _lastPosition = null;

  this.getSprite = function () {
    return _sprite;
  }

  move = function () {
    // var t1 = new Date().getMilliseconds();
    var collistionWithMonster = ctx.game.physics.arcade.collide(_sprite, ctx.monstersGroup);
    // console.log('collistionWithMonster', collistionWithMonster, !_allowInput, _lastPosition)
    if (collistionWithMonster) {
      if (!_allowInput) {
        if (_lastPosition) {
          rollbackMove(_lastPosition);
        }
      }
    }

    // var t2 = new Date().getMilliseconds();
    // _sprite.angle += 1;
    if (_allowInput) {

      var moveObject = null;
      if (_cursors.left.isDown) {
        moveObject = { x: '-32' };
      } else if (_cursors.right.isDown) {
        moveObject = { x: '+32' };        // player.x += 32;
      } else if (_cursors.up.isDown) {
        moveObject = { y: '-32' };        // player.x += 32;
      } else if (_cursors.down.isDown) {
        moveObject = { y: '+32' };      // player.x += 32;
      }

      // console.log('moveObject' ,moveObject)
      if (moveObject) {
        if (checkIfMovePossible(moveObject)) {
          movePlayer(moveObject);
        }
      }
    }
    // var t3 = new Date().getMilliseconds();
    // console.log(t2 - t1, t3 - t2)
  }


  var makeAttack = function () {
    if (_target && _allowAttack) {
      _allowAttack = false;
      var dist = game.physics.arcade.distanceBetween(_sprite, _target.sprite);
      if (dist <= _self.attackRange) {
        // console.log('attacking')
        ctx.dmgSolver(_self, _target);
        _allowIAttackTimeout = setTimeout(function () {
          _allowAttack = true;
        }, 1000)
      } else {
        _allowAttack = true;
      }
    }
  }

  this.markTarget = function (target) {
    _target = target;
  }
  this.unmark = function () {
    _target = null;
  }

  var rollbackMove = function (_lastPosition) {
    _tween.reverse = true;
  }

  var checkIfMovePossible = function (moveObject) {
    var posX = _sprite.x + (moveObject.x ? parseInt(moveObject.x) : 0);
    var posY = _sprite.y + (moveObject.y ? parseInt(moveObject.y) : 0);

    var tileY = posY / 32 + 0.5;
    var tileX = posX / 32 + 0.5;
    return ctx.checkEmptySpotOnMap(tileX, tileY);
  }
  var movePlayer = function (moveParams) {
    _allowInput = false;
    // _sprite.input.enabled = false;
    _lastPosition = { x: parseInt(_sprite.x), y: parseInt(_sprite.y) };
    _tween = ctx.game.add.tween(_sprite).to(moveParams, 600, Phaser.Easing.Linear.None, false);
    _tween.onComplete.add(() => {
      console.log('complete')
      _allowInput = true;
    })
    _tween.start();
    // _allowInputTimeout = setTimeout(function () {

    //   // _sprite.input.enabled = true;
    // }, 700);
  }

  _highlightTargetArea = null
  var highlightTarget = function () {
    _highlightTargetArea && _highlightTargetArea.destroy();
    if (_target) {
      _highlightTargetArea = game.add.graphics(32, 32);
      var color = 0xFFFFFF;
      var dist = ctx.game.physics.arcade.distanceBetween(_sprite, _target.sprite);
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
      _highlightTargetArea.drawRect(_target.sprite.x - 16, _target.sprite.y - 16, 32, 32);
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
    move();
    highlightTarget();
    makeAttack();
  }

}