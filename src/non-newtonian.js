//set up the world real quick!...
gravity(0,0);
setBackground('assets/grid.png');

var density = 100;
var friction = 10;
var restitution = 0.4;

// ************* setup walls and floors etc
staticBox('wall',   //object group
	'floor', 		//object id
	250,			//X
	500,			//Y
	500,			//width
	1,				//height
	0,				//angle
	density,friction,restitution,
	false,      	//is sensor
	null);			//asset
			
staticBox('wall',	//object group
	'ceiling',		//id
	250,			//x position
	0,				//y position
	500,			//width
	1,				//height
	0,				//angle
	density,friction,restitution,
	false, 			//is sensor
	null);			//asset	
		
staticBox('wall',	//object group
	'leftwall',		//id
	1,				//x position
	250,			//y position
	1,				//width
	500,			//height
	0,				//angle
	density,friction,restitution,
	false, 			//is sensor
	null);			//asset

staticBox('wall',	//object group
	'rightwall',	//id
	500,			//x position
	250,			//y position
	1,				//width
	500,			//height
	0,				//angle
	density,friction,restitution,
	false, 			//is sensor
	null);			//asset

// ************* END walls and floors etc

/*

//begin simple test stub...
dynamicCircle('ball',//object group
	'ball0',		//id
	100,				//x position
	300,				//y position
	30,				//width
	0,				//height
	false,			//fixed rotation?
	0.2,friction,restitution,
	null);			//asset
	

dynamicCircle('ball',//object group
	'ball1',		//id
	400,				//x position
	100,				//y position
	20,				//width
	0,				//height
	false,			//fixed rotation?
	0.2,friction,restitution,
	null);			//asset


dynamicCircle('ball',//object group
	'ball2',		//id
	200,				//x position
	100,				//y position
	20,				//width
	0,				//height
	false,			//fixed rotation?
	0.2,friction,restitution,
	null);			//asset
/

/*
//get pos the first object
a = getPosition('ball0');

ax = a[0];
ay = a[1];

//get pos the second
b = getPosition('ball1');

bx = b[0];
by = b[1];

//Calc vectors
v1 = (bx-ax)/1000;
v2 = (by-ay)/1000;

pushObject('ball0',v1,v2)


//get pos the first object
a = getPosition('ball1');

ax = a[0];
ay = a[1];

//get pos the second
b = getPosition('ball0');

bx = b[0];
by = b[1];

//Calc vectors
v1 = (bx-ax)/1000;
v2 = (by-ay)/1000;

pushObject('ball1',v1,v2)

//reversed from https://stackoverflow.com/questions/6758060/simulate-newtons-law-of-universal-gravitation-using-box2d
//and a litte help from: http://www.rasmus.is/uk/t/F/Su58k03.htm
//end simple test stub
*/



for(var i=0;i<10;i++){
	dynamicCircle('ball',//object group
		'ball'+i,		//id
		randomNumber(100,400),				//x position
		randomNumber(100,400),				//y position
		10,				//width
		0,				//height
		false,			//fixed rotation?
		1,friction,restitution,
		null);			//asset
}

/*
dynamicCircle('ball',//object group
	'ball0',		//id
	250,			//x position
	250,			//y position
	20,				//width
	0,				//height
	false,			//fixed rotation?
	100,0,0,
	null);			//asset

	//pushObject('ball0',0,0)

dynamicCircle('ball',//object group
	'ball1',		//id
	150,			//x position
	250,			//y position
	10,				//width
	0,				//rotation
	false,			//fixed rotation?
	1,0,0,
	null);			//asset

	pushObject('ball1',0,2);


dynamicCircle('ball',//object group
	'ball2',		//id
	450,			//x position
	250,			//y position
	12,				//width
	0,				//rotation
	false,			//fixed rotation?
	1,0,0,
	null);			//asset

	pushObject('ball2',0,-3)
*/


function newtonian(){
	/*
	simmple vector driven 'gravity'
	we need a getmass function in giftwrap, see above...???
	but I am not sure it is entirely necessary..
	if we apply force between two bodies and one is massive, the smaller body
	will move more than the larger. I think for our purposes it is close enough...
	at least for now...
    I will do something with mass later.....

	force = G * massA * massB / (distance*distance); where G = 6.67×10 ^−11 

	lets imlpement it!
	*/

	for(var i=0; i<10; i++){
		a = getPosition('ball'+i);
		ax = a[0];
		ay = a[1];

		for(var j=0;j<10;j++){
			b = getPosition('ball'+j);
			bx = b[0];
			by = b[1];

			v1 = (bx-ax)/1000;
			v2 = (by-ay)/1000;

			pushObject('ball'+i,v1,v2);//move the object we are looking it in outer loop
			//towards object we are looking in inner loop

		};
	};

};

newtonian();


function grav(clock_counter){
	if(clock_counter < 10000000){
		newtonian();
	};
};


clock(100,0,'grav');

















