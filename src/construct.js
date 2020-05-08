//set up the world real quick!...
gravity(0,9.82);
setBackground('assets/misc/grid.png');

var density = 100;
var friction = 10;
var restitution = 0.4;

//setup walls and floors etc
staticBox('wall',    //object name
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
	'box', //class
	'middlebox', //id
	250,	//x poisition
	250,	//y position
	60,		//width
	10,		//height
	0,		//angle
	density,friction,restitution,
	false, //is sensor
	null);

	
staticBox(
	'box', //class
	'test', //id
	150,	//x poisition
	300,	//y position
	250,		//width
	10,		//height
	0,		//angle
	density,friction,restitution,
	true, //is sensor
	null);


dynamicCircle('ball',
	'player1',
	50,
	20,
	20,
	0,
	false,
	0.2,friction,restitution,
	null);
	
/*
player1.GetFixtureList().IsSensor();
player1.GetFixtureList().SetSensor(true);
*/



























