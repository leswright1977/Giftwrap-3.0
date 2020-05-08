//set up the world real quick!...
gravity(0,0);

var density = 1;
var friction = 0.0;
var restitution = 1;

//setup walls and floors etc
staticBox('wall',    //object name
	'floor', //object id
	250,		//X
	500,		//Y
	500,		//width
	1,		//height
	0,		//angle
	density,friction,restitution,
	false, //is sensor
	'assets/breakout/wall.png');		//asset
			
staticBox('wall','ceiling',250,0,500,1,0,density,friction,restitution,false,'assets/breakout/wall.png');			
staticBox('wall','leftwall',1,250,1,500,0,density,friction,restitution,false,'assets/breakout/wall.png');
staticBox('wall','rightwall',500,250,1,500,0,density,friction,restitution,false,'assets/breakout/wall.png');




setBackground('assets/breakout/bg.png');
//scrollBackground(0,-1,70);

var a = 0;
for (j=100;j < 150;j++){
	if (j % 20 == 0){
		for (i=35;i< 470;i++){
			if (i % 42 == 0){
				var b = Math.floor(randomNumber(0,9))
				//staticBox('brick','brick'+a,i,j,40,20,0,100,1,0,false,'assets/breakout/brick'+b+'.png');	
				staticBox('brick','brick'+a,i,j,40,20,0,100,1,0,false,'assets/breakout/brick'+b+'.png');
				a++;
			};
		};
	};
};

var spikeball = false;
var score = 0;
function hitBrick(){
	if(spikeball){
		shoveObject('ball',0.1,0);
	};
	score++;
	$('#score').html('Score: '+score);
	if(score%10 == 0){
		changeImage('ball','assets/breakout/ball10.png');
		spikeball = true;
	};
	if(score == 33){
		$('#canvas').append('<div id="win" style="position: absolute; left:150px; top:200px; width:200px; height:50px; background:transparent; color:yellow; text-align:center; font-size:40px; z-index:1; ">You Won!</div>');
	};
};

function hitWall(){
	console.log('wall hit');
};

function hitPaddle(){
	console.log('paddle hit');
};

function hitFloor(){
	console.log('floor hit');	
};

function hitTest(){
	//console.log(ball.GetUserData().impulse);
	//console.log(test.GetUserData().impulse);
};

function left(){
	console.log('id collision test: hit left');
};


//playSound('assets/breakout/galaforce.mp3',true);


function randomNumber(min, max) {
    return Math.random()*(max-min+1)+min;
};

//console.log(Math.floor(random(1,10)));

dynamicBox('paddle','player',250,475,120,20,0,true,1,0.5,0,'assets/breakout/paddle2.png');

dynamicCircle('ball','ball',250,470,30,0,false,0.2,friction,restitution,'assets/breakout/ball3.png');

superCollider(
	'group', //collide by
	'ball', //objectA
	'brick',//objectB
	'brick',//obect to destroy
	'hitBrick',//function to run

	'group',
	'ball',
	'wall',
	null,
	'hitWall',

	'group',
	'ball',
	'player',
	null,
	'hitPaddle',

	'group',
	'ball',
	'test',
	null,
	'hitTest',

	'id', //test on id's for coliision
	'player', //play id is player
	'leftwall',//left wall id is leftwall
	null,
	'left',

	'id',
	'ball',
	'floor',
	'ball',
	'hitFloor'
);

function respawn(){
	spikeball = false;
	dynamicCircle('ball','ball',250,470,30,0,false,0.2,friction,restitution,'assets/breakout/ball3,png');
	positionObject('player',250,490);
};



///set up controls
$(window).keydown(function(e){
	//console.log(e);
	if (e.keyCode == 37){
		//console.log('left');
		shoveObject('player',-10,0);
	}
	if (e.keyCode == 39){
		//console.log('right')
		shoveObject('player',10,0);
	}
	if (e.keyCode == 32){
		//console.log('space');
		var number = randomNumber(-0.01,0.01); //get random number
		//console.log(number);
		shoveObject('ball',number,0.7); //fire ball vertically with random x bias
	}
	if (e.keyCode == 82){
		//console.log('respawn');
		respawn();
	}
});

$(window).keyup(function(e){
	//console.log(e);
	if (e.keyCode == 37){
		//console.log('left');
		deadStop('player');
	}
	if (e.keyCode == 39){
		//console.log('right')
		deadStop('player');
	};
});


getPosition('ball');

$('#canvas').css('cursor','none');
//$('#canvas').css('cursor','crosshair');

$("#canvas").mousemove(function(event) {
	var offset = $(this).offset();
	x = event.pageX- offset.left;
	y = event.pageY- offset.top;
	if(x <= 60){
		positionObject('player',60,490);
	}else if(x >= 440){
		positionObject('player',440,490);
	}else{
		positionObject('player',x,490);
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


