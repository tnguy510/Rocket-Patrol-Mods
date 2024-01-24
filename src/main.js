//Trish Nguyen
//Rocket Patrol, Enhanced Edition!
//Implemented that after hitting 3 ships, 5 seconds will be added to clock(5)
//Display the time remaining (in seconds) on the screen (3) 
//Implement the speed increase that happens after 30 seconds in the original game (1)
//Create a new title screen (e.g., new artwork, typography, layout) (3)
    //Brennon Mulligan Voice: "I struck down Helvetica"
    //Also I made that cover art with my trackpad, never again.
//Create a new enemy Spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (5)
    //Added Sonic the Hedgehog.
//Randomized explosion sounds between 4 different SFX (3)
    //All generate by jskr at https://sfxr.me/
//Approximate Implemention time: 7 hours
    //Fixing Time from previous code: 1 hour

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

//Displaying Clock
let clockConfig = {
    fontFamily: 'Courier',
    fontSize: '28px',
    backgroundColor: '#F3B141',
    color: '#843605',
    align: 'left',
    padding: {
        top: 5,
        bottom: 5,
    },
    fixedWidth: 100
}

let scoreConfig = {
    fontFamily: 'Courier',
    fontSize: '28px',
    backgroundColor: '#F3B141',
    color: '#843605',
    align: 'right',
    padding: {
    top: 5,
    bottom: 5,
    },
    fixedWidth: 100
}