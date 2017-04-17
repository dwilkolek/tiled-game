this.initClient = function (ctx) {

  ctx.aaaaaaaaMYCTX= true;

  ctx._width = window.innerWidth;
  ctx._height = window.innerHeight;

  ctx.tileSize = ctx._width/32;

  ctx.scale = ctx.tileSize/32;
  // console.log(ctx.tileSize)

  ctx.player = null;
  ctx.cursors = null;
  ctx.layerObstacles = null;
  ctx.spawner = null;
  ctx.monstersGroup = null;
  ctx.effectsGroup = null;

  ctx.game = new Phaser.Game(16*32, 12*32, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });


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

    // var _cursors = ctx.game.input.keyboard.createCursorKeys();

  }


  function create() {
    ctx.game.time.advancedTiming = true;
    ctx.game.physics.startSystem(Phaser.Physics.ARCADE);
    ctx.game.world.setBounds(0, 0, 1000 * 32, 500 * 32);
    // game.stage.scaleMode =0;// Phaser.StageScaleMode.SHOW_ALL;
    // // game.stage.scale.setShowAll();
    // // game.stage.scale.refresh();

    ctx.map = GameMap(ctx);
    ctx.monsterRepo = MonsterRepo(ctx);

    ctx.spawner = new Spawner(ctx)
    ctx.player = new Player(ctx)
    // console.log('player', ctx.player)

  }



  function update() {
    // var t1 = new Date().getMilliseconds();
    ctx.player.update();
    // var t2 = new Date().getMilliseconds();
    ctx.monsterRepo.update();
    // var t3 = new Date().getMilliseconds();
    // console.log(t2-t1, t3-t2)
  }

  function render() {
    // ctx.game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
    // game.debug.cameraInfo(game.camera, 32, 32);
    // game.debug.body(ctx.player.getSprite());

    // game.debug.body(layerObstacles);

  }
}