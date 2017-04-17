Spawner = function (ctx) {

  var spawn = function () {
    console.log('spawning in proces...')
    ctx.monsterMap.forEach(e => {
      if (e.current < e.max) {
        createMonster(e, e.max - e.current)
        e.current = e.max;
      }
    })
    setTimeout(spawn, 10000);
  }

  var createMonster = function (monsterDefinition, monstersToCreate) {
    console.log('spawned ' + monstersToCreate + ' @ ' + monsterDefinition.spawnId)
    for (var i = 0; i < monstersToCreate; i++) {


      ctx.monsterRepo.add(new Monster(ctx, monsterDefinition))


    }
  }

  this.killed = function (spawnId) {
    ctx.monsterMap.forEach(e => {
      if (e.spawnId == spawnId) {
        e.current = e.current - 1;
      }
    })
  }

  spawn();
  return this;
}

this.tileToPixel = function (tile) {
  return tile * 32 - 16;
}

// this.pixelToTile = function(pixel) {
//   return pixel % 32 == 0 ? pixel / 32 : pixel
// }