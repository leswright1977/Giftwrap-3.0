//set up the world real quick!...
gravity(0,0);
setBackground('assets/misc/pong.png');
var density = 1;
var friction = 0.0;
var restitution = 1;

//setup walls and floors etc
staticBox(	'wall',    //object name
			'floor', //object id
			250,		//X
			500,		//Y
			500,		//width
			1,			//height
			0,			//angle
			density,friction,restitution,
			false, //is sensor
			'assets/misc/wall.png');		//asset
			
staticBox('wall','ceiling',250,0,500,1,0,density,friction,restitution,false,'assets/misc/wall.png')		
staticBox('wall','leftwall',1,250,1,500,0,density,friction,restitution,false,'assets/misc/wall.png');
staticBox('wall','rightwall',500,250,1,500,0,density,friction,restitution,false,'assets/misc/wall.png');


//staticBox('test','test',250,250,100,20,0,density,friction,restitution,false,null);




function randomNumber(min, max) {
    return Math.random()*(max-min+1)+min;
};

//console.log(Math.floor(random(1,10)));

dynamicBox('player1','player1',10,250,20,120,0,true,1,0.5,0,'assets/misc/paddle2.png');

dynamicBox('player2','player2',490,250,20,120,0,true,1,0.5,0,'assets/misc/paddle2.png');

dynamicCircle('ball','ball',40,250,30,0,false,0.2,friction,restitution,'assets/misc/ball8.png');


function hitWall(){
	console.log('wall');
	playSound('assets/misc/beep1.mp3');
};

function hitPaddle(){
	playSound('assets/misc/beep2.mp3');
};


superCollider(
	'group', //collide by
	'ball', //objectA
	'wall',//objectB
	 null,//obect to destroy
	'hitWall',//function to run


	'id', //collide by
	'ball', //objectA
	'player1',//objectB
	 null,//obect to destroy
	'hitPaddle',//function to run

	'id', //collide by
	'ball', //objectA
	'player2',//objectB
	 null,//obect to destroy
	'hitPaddle'//function to run

);


/*
function respawn(){
	dynamicCircle('ball','ball',250,470,30,0,false,0.2,friction,restitution,'assets/misc/lightning.gif');
	positionObject(player,250,490);
};
*/

///set up controls
$(window).keydown(function(e){
	console.log(e.keyCode);
	if (e.keyCode == 90){
		shoveObject('player1',0,-10);
	}
	if (e.keyCode == 88){
		shoveObject('player1',0,10);
	}


	if (e.keyCode == 188){
		shoveObject('player2',0,-10);
	}
	if (e.keyCode == 190){
		shoveObject('player2',0,10);
	}

	if (e.keyCode == 32){
		//console.log('space');
		var number = randomNumber(-0.01,0.01); //get random number
		//console.log(number);
		shoveObject('ball',number,0.5); //fire ball vertically with random x bias
	}
	if (e.keyCode == 82){
		//console.log('respawn');
		respawn();
	}
});

$(window).keyup(function(e){
	//console.log(e);
	if (e.keyCode == 90){
		//console.log('left');
		deadStop('player1');
	}
	if (e.keyCode == 88){
		//console.log('right')
		deadStop('player1');
	};
	if (e.keyCode == 188){
		//console.log('left');
		deadStop('player2');
	}
	if (e.keyCode == 190){

		//console.log('right')
		deadStop('player2');
	};
});



/*
//timer....
var start = new Date().getTime();
var time = 0;
var timeout = 5000;
function instance() {
    time += 1;
    console.log(time);
    var diff = (new Date().getTime() - start) - time;
    window.setTimeout(instance, (100 - diff));
}
window.setTimeout(instance, 100);
*/


