this.RANGE = {
  CLOSE: 47,
  SEMI_RANGED: 76,
  RANGED: 116
}

this.ATTACK_SPEED = {
  SLOW: 4000,
  MEDIUM: 2000,
  FAST: 1000
}

this.MOVEMENT_SPEED = {
  SLOW: 4000,
  MEDIUM: 2000,
  FAST: 1000
}

this.FIGHT_STATE = {
  SHIELDED: 'shielded',
  DAMAGED: 'damaged',
  MISSED: 'missed',
}

this.generateUid = function () {
    var delim = "-";
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + delim + S4() + delim + S4() + delim + S4() + delim + S4() + S4() + S4());
};