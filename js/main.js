

var game = new Phaser.Game(512, 512, Phaser.AUTO, 'test', );
var largeur = game.width;
var hauteur = game.height;
var urlPlayer = 'assets/player.png';
var urlWall = 'assets/wall.jpg';
var urlMechant_2 = 'assets/mechant_2.png';
var urlCible = 'assets/cible.png';
var urlCaisse = 'assets/caisse.jpg';
var urlVide = 'assets/vide.jpg';
var urlPas = 'assets/pas.mp3';
var urlGoal = 'assets/goal.mp3';
var mechants;
var offset = 32;
var play;
var up, down;
var bg = "#000000";
var appelCreatePlatform = 0;
var isKeyPressed = false;

//-------------------
var x;
var y;
var nextPositionX;
var nextPositionY;
var caisseX;
var caisseY;
var cibleX;
var cibleY;
var nbPas = 0;
var fxpPas;
var fxGoal;
//var l;
//var c;
var totalCaisse = 0;
//-------------------

// 1:Mur, 2:mechant_2, 3:Player, 4:Caisse, 9:cible
var level_1 = new Array();
level_1 = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
[1, 3, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
[1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1],
[1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1],
[1, 1, 0, 0, 0, 1, 0, 4, 0, 0, 0, 0, 9, 0, 0, 1],
[1, 9, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
[1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
[1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 9, 1],
[1, 0, 0, 0, 4, 0, 0, 0, 0, 0, 4, 0, 0, 1, 1, 1],
[1, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 4, 1, 1, 0, 0, 0, 1, 1, 1],
[1, 0, 0, 0, 0, 0, 9, 0, 1, 1, 0, 0, 0, 9, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1],
[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];



function createPlayer() {
    game.stage.backgroundColor = bg;
    player = game.add.sprite((game.width / 2) - 16, (game.height - 32), 'player');

    this.upKey = game.input.keyboard.addKey(Phaser.keyboard.UP);
}
var stages = {
    stage_1: function () {
        game.state.add('jeux', gameMoi);
        game.state.start('jeux');
    }
};

function createPlatform() {

    var col = 0;
    var ligne = 0;
    var res;
    for (var l = 0; l < level_1.length; l++) {
        for (var c = 0; c < level_1[1].length; c++) {
            res = level_1[l][c];
            if (res == 0) {
                game.add.sprite(col, ligne, 'vide');
                col += 32;
            }
            else if (res == 1) {
                game.add.sprite(col, ligne, 'wall');
                col += 32;
            }
            else if (res == 2) {
                game.add.sprite(col, ligne, 'mechant_2');
                col += offset;
            }
            else if (res == 3) {
                game.add.sprite(col, ligne, 'player');
                x = l;
                y = c;
                col += 32;
            }
            else if (res == 4) {
                game.add.sprite(col, ligne, 'caisse');
                col += 32;
            }
            else if (res == 9) {
                game.add.sprite(col, ligne, 'cible');
                col += 32;
            }
        }
        ligne += offset;
        col = 0;
    }
}

function nombreDeCaisse() {

    var res;
    for (var l = 0; l < level_1.length; l++) {
        for (var c = 0; c < level_1[1].length; c++) {
            res = level_1[l][c];
            if (res == 4) {
                totalCaisse++;
            }
        }
    }
}

// Quadrillage du tableau
function scene() {

    var horizontale = game.add.graphics(0, 0);
    var verticale = game.add.graphics(0, 0);

    horizontale.lineStyle(1, 0xffffff, 0.2);
    verticale.lineStyle(1, 0xffffff, 0.2);

    horizontale.moveTo(0, 0);
    horizontale.lineTo(game.width, 0);

    verticale.moveTo(0, 0);
    verticale.lineTo(game.width, 0);

    verticale.moveTo(0, 0);
    verticale.lineTo(0, game.height);

    for (h = 0; h <= game.height; h++) {
        horizontale.moveTo(0, (offset * h));
        horizontale.lineTo(game.width, (offset * h));

    }
    for (v = 0; v < game.width; v++) {
        verticale.moveTo((offset * v), 0);
        verticale.lineTo((offset * v), game.height);
    }

}
var gameMoi = {
    preload: function () {
        this.game.load.image('wall', urlWall);
        this.game.load.image('mechant_2', urlMechant_2);
        this.game.load.image('player', urlPlayer);
        this.game.load.image('vide', urlVide);
        this.game.load.image('caisse', urlCaisse);
        this.game.load.image('cible', urlCible);
        this.game.load.audio('pas', urlPas);
        this.game.load.audio('goal', urlGoal);


    },
    create: function () {
        fxPas = game.add.audio('pas');
        fxGoal = game.add.audio('goal');
        createPlatform();
        up = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        down = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        scene();
        nombreDeCaisse();

    },
    update: function () {
        if (up.isUp && down.isUp && right.isUp && left.isUp) {
            isKeyPressed = false;
        }

        if (!isKeyPressed) {
            if (up.isDown) {
                movePlayerUp();
                createPlatform();
                scene();
            }

            if (down.isDown) {
                movePlayerDown();
                createPlatform();
                scene();
            }


            if (right.isDown) {
                movePlayerRight();
                createPlatform();
                scene();
            }

            if (left.isDown) {
                movePlayerLeft();
                createPlatform();
                scene();
            }
        }
    },
    render: function () {
    }
};
/* Appel des fonctions */
stages.stage_1();

function impact(nextPositionX, nextPositionY, dir) {
    var playerX = nextPositionX;
    var playerY = nextPositionY;

    switch (level_1[playerX][playerY]) {
        case 1:
            break;
        case 2:
            console.log("Mechant_2");
            break;
        case 4:
            if (dir == 'up' && level_1[nextPositionX - 1][nextPositionY] == 0) {
                level_1[nextPositionX][nextPositionY] = 3;
                level_1[nextPositionX - 1][nextPositionY] = 4;
                level_1[nextPositionX + 1][nextPositionY] = 0;

            } if (level_1[nextPositionX - 1][nextPositionY] == 9) {
                level_1[nextPositionX][nextPositionY] = 3;
                level_1[nextPositionX - 1][nextPositionY] = 0;
                level_1[nextPositionX + 1][nextPositionY] = 0;
                goal();
            }

            if (dir == 'down' && level_1[nextPositionX + 1][nextPositionY] == 0) {
                level_1[nextPositionX][nextPositionY] = 3;
                level_1[nextPositionX + 1][nextPositionY] = 4;
                level_1[nextPositionX - 1][nextPositionY] = 0;
            }
            if (level_1[nextPositionX + 1][nextPositionY] == 9) {
                level_1[nextPositionX][nextPositionY] = 3;
                level_1[nextPositionX + 1][nextPositionY] = 0;
                level_1[nextPositionX - 1][nextPositionY] = 0;
                goal();
            }
            if (dir == 'right' && level_1[nextPositionX][nextPositionY + 1] == 0) {
                level_1[nextPositionX][nextPositionY] = 3;
                level_1[nextPositionX][nextPositionY + 1] = 4;
                level_1[nextPositionX][nextPositionY - 1] = 0;
            }
            if (level_1[nextPositionX][nextPositionY + 1] == 9) {
                level_1[nextPositionX][nextPositionY] = 3;
                level_1[nextPositionX][nextPositionY + 1] = 0;
                level_1[nextPositionX][nextPositionY - 1] = 0;
                goal();
            }
            if (dir == 'left' && level_1[nextPositionX][nextPositionY - 1] == 0) {
                level_1[nextPositionX][nextPositionY] = 3;
                level_1[nextPositionX][nextPositionY - 1] = 4;
                level_1[nextPositionX][nextPositionY + 1] = 0;
            }
            if (level_1[nextPositionX][nextPositionY - 1] == 9) {
                level_1[nextPositionX][nextPositionY] = 3;
                level_1[nextPositionX][nextPositionY + 1] = 0;
                level_1[nextPositionX][nextPositionY - 1] = 0;
                goal();
            }
            break;
    }
}

//** GOAL */

function goal() {
    playFx(fxGoal);
    totalCaisse--;
    console.log(totalCaisse);
    if (totalCaisse <= 0) {
        alert("Nombres de deplacement : " + nbPas + " Appuyer sur F5 pour recommencer !!");
    }

}

function playFx(fx) {
    fx.play();
}
/** --------------------------- 
 *          MOVE PLAYER 
 * -------------------------- */
function movePlayerUp() {
    playFx(fxPas);
    nbPas ++;
    nextPositionX = x;
    nextPositionY = y;
    // Touche haut
    nextPositionX -= 1;
    if (level_1[nextPositionX][y] != 0) {
        impact(nextPositionX, nextPositionY, 'up');
    }
    if (level_1[nextPositionX][y] == 0) {
        level_1[nextPositionX][nextPositionY] = level_1[x][y];
        level_1[x][y] = 0;
    }
    isKeyPressed = true;
}

function movePlayerDown() {
    playFx(fxPas);
    nextPositionX = x;
    nextPositionY = y;

    // Touche Bas
    nextPositionX += 1;
    if (level_1[nextPositionX][nextPositionY] != 0) {
        impact(nextPositionX, nextPositionY, 'down');
    } else {
        level_1[nextPositionX][nextPositionY] = 3;
        level_1[x][y] = 0;
    } isKeyPressed = true;
}
function movePlayerRight() {
    playFx(fxPas);
    nextPositionX = x;
    nextPositionY = y;
    // Touche Droite
    nextPositionY += 1;
    if (level_1[nextPositionX][nextPositionY] != 0) {
        impact(nextPositionX, nextPositionY, 'right');
    } else {
        level_1[nextPositionX][nextPositionY] = 3;
        level_1[x][y] = 0;
    } isKeyPressed = true;
}

function movePlayerLeft() {
    playFx(fxPas);
    nextPositionX = x;
    nextPositionY = y;
    // Touche Gauche
    nextPositionY -= 1;
    if (level_1[nextPositionX][nextPositionY] != 0) {
        impact(nextPositionX, nextPositionY, 'left');
    } else {
        level_1[nextPositionX][nextPositionY] = 3;
        level_1[x][y] = 0;
    } isKeyPressed = true;
}