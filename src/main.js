//Trish Nguyen
//Rocket Patrol, Enhanced Edition But Not Really!
//Implemented that hitting a ship will add time to clock(5)
//Display the time remaining (in seconds) on the screen (3) (But also it doesn't accurate tell the time)
//Implement the speed increase that happens after 30 seconds in the original game (1)
//Create a new title screen (e.g., new artwork, typography, layout) (3)
//Create a new enemy Spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (5)

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [Menu, Play]
}
let game = new Phaser.Game(config);
//set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT;