this.monsterMap = [
  {
    spawnId: 'ghostspawn1',
    sprite: 'ghost',
    area: {
      x1: 80,
      x2: 81,
      y1: 99,
      y2: 101
    },
    max: 50,
    current: 0,
    spec: {
      hp: 25,
      attack: 5,
      defence: 8,
      agility: 16,
      attackRange: 'CLOSE',
      attackSpeed: 'FAST',
      movementSpeed: 'SLOW',
      exp: 200
    }
  },
  {
    spawnId: 'skeletonpawn1',
    sprite: 'skeleton',
    area: {
      x1: 60,
      x2: 100,
      y1: 95,
      y2: 110,
    },
    max: 50,
    current: 0,
    spec: {
      hp: 30,
      attack: 5,
      defence: 15,
      agility: 5,
      attackRange: 'CLOSE',
      attackSpeed: 'FAST',
      movementSpeed: 'FAST',
      exp: 10
    }
  }
];
