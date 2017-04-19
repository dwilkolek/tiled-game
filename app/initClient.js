this.initClient = function (ctx) {

  ctx.aaaaaaaaMYCTX = true;

  ctx._width = window.innerWidth;
  ctx._height = window.innerHeight;

  ctx.tileSize = ctx._width / 32;

  ctx.scale = ctx.tileSize / 32;
  // console.log(ctx.tileSize)

  ctx.player = null;
  ctx.cursors = null;
  ctx.layerObstacles = null;
  ctx.spawner = null;
  ctx.monstersGroup = null;
  ctx.playersGroup = null;
  ctx.effectsGroup = null;

  ctx.game = new Phaser.Game(16 * 32, 12 * 32, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });


  function preload() {
    ctx.game.load.tilemap('MyTilemap', '/assets/map/test1.json', null, Phaser.Tilemap.TILED_JSON);
    ctx.game.load.image('forest_tiles', '/assets/map/forest_tiles.png');

    ctx.game.load.image('player', '/assets/player.png');
    ctx.game.load.image('ghost', '/assets/ghost.png');
    ctx.game.load.image('skeleton', '/assets/skeleton.png');

    ctx.game.load.image(ctx.FIGHT_STATE.DAMAGED, '/assets/blood.png');
    ctx.game.load.image(ctx.FIGHT_STATE.MISSED, '/assets/missed.png');
    ctx.game.load.image(ctx.FIGHT_STATE.SHIELDED, '/assets/shielded.png');

    ctx.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    ctx.game.scale.pageAlignHorizontally = true;
    ctx.game.scale.pageAlignVertically = true;
  }


  function create() {
    try {
      ctx.game.time.advancedTiming = true;
      ctx.game.physics.startSystem(Phaser.Physics.ARCADE);
      ctx.game.world.setBounds(0, 0, 1000 * 32, 500 * 32);
      ctx.map = new GameMap(ctx);
      ctx.monsterRepo = new MonsterRepo(ctx);
      ctx.playerRepo = new PlayerRepo(ctx);
      ctx.spawner = new Spawner(ctx);
      ctx.player = new Player(ctx, 80,100);
    } catch (exception) {
      console.log('game killed', exception)
      game.destroy();
    }

  }



  function update() {
    try {
      ctx.player.update();
      ctx.monsterRepo.update();
    } catch (exception) {
      console.log('game killed', exception)
      game.destroy();
    }
  }

  function render() {
    // ctx.game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
    // game.debug.cameraInfo(game.camera, 32, 32);
    // game.debug.body(ctx.player.getSprite());

    // game.debug.body(layerObstacles);

  }
}