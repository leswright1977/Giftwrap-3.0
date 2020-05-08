//set up the world real quick!...
gravity(0,9.8);
setBackground('assets/grid.png');

var density = 100;
var friction = 10;
var restitution = 0.4;

console.log('Type respawn = true; in the console!');

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
		null);		//asset
			
staticBox('wall',
	    'ceiling',
		250,
		0,
		500,
		1,
		0,
		density,friction,restitution,
		false, //is sensor
		null);	
		
staticBox('wall',
		'leftwall',
		1,
		250,
		1,
		500,
		0,
		density,friction,restitution,
		false, //is sensor
		null);

staticBox('wall',
		'rightwall',
		500,
		250,
		1,
		500,
		0,
		density,friction,restitution,
		false, //is sensor
		null);


staticBox(
	'ramp', //class
	'ramp1', //id
	230,	//x poisition
	260,	//y position
	650,	//width
	5,		//height
	45,		//angle
	density,friction,restitution,
	false, //is sensor
	null);



	
staticBox('sensor',
		'end',
		495,
		478,
		5,	
		45,
		0,
		density,friction,restitution,
		true, //is sensor
		null);


var respawn = false;

function ballfunction(){
	if(respawn){
		respawn = false;
		dynamicCircle('ball',
					'player',
					50,
					20,
					15,
					0,
					false,
					0.2,friction,restitution,
					null);
	};
};



clock(100,0,'ballfunction');

function spawnFunction(){
	respawn = true;
};


superCollider(
	'group',
	'ball',
	'sensor',
	'ball',
	'spawnFunction'
);




























