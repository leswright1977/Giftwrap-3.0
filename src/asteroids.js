//set up the world real quick!...
gravity(0,0);


var density = 1;
var friction = 0.0;
var restitution = 1;

//setup walls and floors etc
staticBox('floor','floor',250,500,500,1,0,density,friction,restitution,false,'assets/asteroids/wall.png');		
staticBox('wall','ceiling',250,0,500,1,0,density,friction,restitution,false,'assets/asteroids/wall.png');			
staticBox('wall','leftwall',1,250,1,500,0,density,friction,restitution,false,'assets/asteroids/wall.png');
staticBox('wall','rightwall',500,250,1,500,0,density,friction,restitution,false,'assets/asteroids/wall.png');



dynamicCircle('asteroid','asteroid1',300,100,60,0,false,0.5,10,restitution,'assets/asteroids/asteroid1.png');

dynamicCircle('asteroid','asteroid2',100,270,60,0,false,0.5,10,restitution,'assets/asteroids/asteroid2.png');
//shoveObject(asteroid,0.3,-4);
//shoveObject(asteroid2,0.0,1); we have a problem! We need to be able to shove on name, not class!


setBackground('assets/asteroids/bg.png');


dynamicCircle('player','player1',
	250, //x
	300, //y
	60, //size
	-90, //angle
	true,//
	density,
	10,restitution,'assets/asteroids/starship.png');




function destroyAsteroid(returned){
	var ret = returned;
	//console.log(ret.idB);
	//go look at the return data in giftwrap... I was working on this!
	var position = getPosition(ret.idB); //get the position of the asteroid
	var size = getSize(ret.idB);
	//console.log(size);
	//console.log(position);
	destroy(ret.idB);//destroy it...                            See giftwrap destroy function...
	//we would do our calculation and spawn new ones here....
	size = size/2;
	
	if(size > 10){
		spawnAsteroid(size,position);
	};
		
};

//**note, in the game loop, we could do a call back, or a clock tick?
//for auto spawn?
//apparently I can override a function in JS! Interesting!
//so define a function called magic();
//the we can call magic()to do magic stuff!
//maybe create a frameCounter in the game loop as well.........


//TODO ID THEN Group?? 

function randomNumber(min, max) {
    return Math.random()*(max-min+1)+min;
};

function spawnAsteroid(size,position){
	//console.log(size);
	//console.log(position);

	var num = randomNumber(0,999999999);
	num = Math.round(num);
	//console.log(num);
	
	dynamicCircle('asteroid','asteroid'+num,position[0],position[1],size,0,false,0.5,10,restitution,'assets/asteroids/asteroid0.png');
	rnd1 = randomNumber(0,1)/50;
	rnd2 = randomNumber(0,1)/50;
	//console.log(rnd1,rnd2);
	shoveObject('asteroid'+num,rnd1,rnd2);

	
	var num = randomNumber(0,999999999);
	num = Math.round(num);
	//console.log(num);

	dynamicCircle('asteroid','asteroid'+num,position[0],position[1],size,0,false,0.5,10,restitution,'assets/asteroids/asteroid1.png');
	rnd1 = randomNumber(0,1)/50;
	rnd2 = randomNumber(0,1)/50;
	//console.log(rnd1,rnd2);
	shoveObject('asteroid'+num,rnd1,rnd2);

	var num = randomNumber(0,999999999);
	num = Math.round(num);
	//console.log(num);

	dynamicCircle('asteroid','asteroid'+num,position[0],position[1],size,0,false,0.5,10,restitution,'assets/asteroids/asteroid2.png');
	rnd1 = randomNumber(1,-1)/50;
	rnd2 = randomNumber(1,-1)/50;
	//console.log(rnd1,rnd2);
	shoveObject('asteroid'+num,rnd1,rnd2);
	

};



superCollider(
	'group',
	'bullet',
	'wall',
	'bullet',
	null,


	'group',
	'bullet',
	'asteroid',
	'bullet',
	null,

	'group',
	'bullet',
	'bullet',
	'bullet',
	null,

	'group',
	'bullet',
	'asteroid',
	null,
	'destroyAsteroid'
);



var b = 0; //bullets
///set up controls
$(window).keydown(function(e){
	//console.log(e);
	if (e.keyCode == 37){
		//console.log('left');
		rotateObject('player1',-2)
	}
	if (e.keyCode == 39){
		//console.log('right')
		rotateObject('player1',2)
	}

	//bullets....

	if (e.keyCode == 32){
		//console.log('space');
		var pos = getPosition('player1');
		//console.log(pos);

		//get spawn position....
		var psX = (pos[0] + 50*Math.cos(player1.GetAngle()));
		var psY = (pos[1] + 50*Math.sin(player1.GetAngle()));


		dynamicCircle('bullet','bullet'+b,
			//pos[0],pos[1]-25,
			psX,psY,
			6,
			0,
			false,
			0.2,friction,restitution,
			'assets/asteroids/blank.png');

		//get angle to fire from....
		var ssX =  (Math.cos(player1.GetAngle())/60); 
		var ssY =  (Math.sin(player1.GetAngle())/60);
		shoveObject('bullet'+b,ssX,ssY);
		b++;
	};


});

$(window).keyup(function(e){
	//console.log(e);
	if (e.keyCode == 37){
		//console.log('left');
		deadStop('player1');
	}
	if (e.keyCode == 39){
		//console.log('right')
		deadStop('player1');
	};
});











