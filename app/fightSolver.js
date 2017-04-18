this.dmgSolver = function (atacker, defencer) {
  var alvl = atacker.lvl || 1;
  var dlvl = defencer.lvl || 1;
  var amod = alvl - dlvl;

  var modValue = function (value, isatacker) {
    if ((amod > 0 && isatacker == true) || (amod < 0 && isatacker == false)) {
      return Math.round(value + value * Math.abs(amod) * 0.2);
    } else {
      return value;
    }
  }

  var att = modValue(atacker.attack, true);
  var def = modValue(defencer.defence, false);
  var aAgi = modValue(atacker.agility, true);
  var dAgi = modValue(defencer.agility, false);

  var critChance = 0;
  var avoidChance = 0;

  var agilityDifference = aAgi - dAgi;
  if (agilityDifference > 0) {
    critChance = aAgi / (aAgi + dAgi);
  } else if (agilityDifference < 0) {
    avoidChance = dAgi / (aAgi + dAgi);
  }

  var shieldChance = att / (att + def) * 0.2;

  var rngNumber = Math.random();
  if (critChance > 0 && rngNumber <= critChance) {
    att = Math.round(att * 1.4);
  }

  if (Math.random() < shieldChance || att < def) {
    defencer.blockDamage();
    return;
  } else {

    if (avoidChance > 0 && rngNumber <= avoidChance) {
      defencer.avoidDamage();
      return;
    }

    console.log()
    var mod = 1 + (Math.random() * 10 - 5) / 20;
    var finalDmg = Math.round((att-def) * mod);
    finalDmg = finalDmg < 0 ? 0 : finalDmg;
    console.log('defender takes : ' + finalDmg + ' based on ' + att + '/' + def + ' by mod ' + ' ~~ ' + mod);
    defencer.takeDamage(finalDmg);
  }

}


// this.FIGHT_STATE = {
//   SHIELDED: 'shielded',
//   DAMAGED: 'damaged',
//   MISSED: 'missed',
// }
this.fightAnimate = function (type, sprite) {
  var _sprite = this.game.add.sprite(sprite.x + 32, sprite.y + 32, type);
  _sprite.scale.setTo(0.5, 0.5);
  var tween = this.game.add.tween(_sprite).to({ alpha: 0 }, 500, Phaser.Easing.Quadratic.Out, true);
  tween.onComplete.add(function () {
    _sprite.destroy();
  }, this)
}

this.drawHp = function (target) {
  if (target.hp < 0) {
    return null;
  }
  var perc = target.hp / target.fullHp;
  var g = game.add.graphics(32, 32);
  var color = '0x00ff00';
  if (perc <= 0.7) {
    color = '0xffff00';
  }
  if (perc <= 0.3) {
    color = '0xff0000';
  }
  g.lineStyle(1, color, 1);
  g.drawRect(target.sprite.x - 10, target.sprite.y - 12, 20 * perc, 2);
  return g;
}