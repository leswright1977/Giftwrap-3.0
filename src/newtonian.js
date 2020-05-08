//set up the world real quick!...
gravity(0,0);
//setBackground('assets/grid.png');

var density = 0;
var friction = 0;
var restitution = 0;

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



dynamicCircle('ball',//object group
	'ball0',		//id
	250,			//x position
	250,			//y position
	20,				//width
	0,				//height
	false,			//fixed rotation?
	100,0,0,
	null);			//asset


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

dynamicCircle('ball',//object group
	'ball3',		//id
	250,			//x position
	220,			//y position
	6,				//width
	0,				//rotation
	false,			//fixed rotation?
	1,0,0,
	null);			//asset

	pushObject('ball3',-1,0)


function getMass(objectID){
	var x = window[objectID].GetMass();
	return [x];
};


function addDiv (id,X,Y,S,col){
	$('#canvas').append('<div id="'+id+'" style="position: absolute;\
	left:'+(X-(S))+'px;\
	top:'+(Y-(S))+'px;\
	transform: rotate(0deg);\
	background: '+col+';\
	width:'+S*2+'px;\
	height:'+S*2+'px;\
	border-radius:'+S+'px;\
	z-index:-1;"></div>');
};


var divCount = 0;

function newtonian(){
	divCount++;
	/*
	force = G * massA * massB / (distance*distance); where G = 6.67×10 ^−11 
	*/

	for(var i=0; i<4; i++){
		a = getPosition('ball'+i);
		ax = a[0];
		ay = a[1];
		am = getMass('ball'+i)

		//draw a trace to vis the orbits (VERY resource heavy!)
		//we are literally adding THOUSANDS of divs!

		trace = 'yellow';
		if(i==1){ trace = 'cyan'};
		if(i==2){ trace = 'fuchsia'};
		addDiv(divCount,ax,ay,0.5,trace);
		remDiv = divCount-400;
		remDiv = '#'+remDiv;
		$(remDiv).remove();
	

		for(var j=0;j<4;j++){
			b = getPosition('ball'+j);
			bx = b[0];
			by = b[1];
			bm = getMass('ball'+j)

			//work out the direction vector
			v1 = (bx-ax)/1000;
			v2 = (by-ay)/1000;
			
			//work out the distance
			d = Math.hypot(v1,v2);

			//work out the force where 6.67E-11 is the gravitational constant.
			force = 6.67E-11 * am * bm / (d*d);
			
			//console.log('v1 '+v1);
			//console.log('v2 '+v2);

			v1 = (v1 * force)*1E8;
			v2 = (v2 * force)*1E8;

			//console.log('nv1 '+v1);
			//console.log('nv2 '+v2);

			
			if( (!isNaN(v1)) && (!isNaN(v1))){
				pushObject('ball'+i,v1,v2);//move the object we are looking it in outer loop
			//towards object we are looking in inner loop
			};

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


















