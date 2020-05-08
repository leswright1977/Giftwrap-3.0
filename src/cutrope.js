//set up the world real quick!...
gravity(0,9.82);
setBackground('assets/cutrope/bg2.png');

var density = 100;
var friction = 100;
var restitution = 0.4;

var cWidth = 500;
var cHeight = 500;

//setup walls and floors etc
staticBox('wall',    //object name
	'floor', //object id
	cWidth/2,		//X
	cHeight,		//Y
	cWidth,		//width
	1,			//height
	0,			//angle
	density,friction,restitution,
	false, //is sensor
	null);		//asset
			
staticBox('wall',
	'ceiling',
	cWidth/2,
	0,
	cWidth,
	1,
	0,
	density,friction,restitution,
	false, //is sensor
	null);	
		
staticBox('wall',
	'leftwall',
	1,
	cHeight/2,
	1,
	cHeight,
	0,
	density,friction,restitution,
	false, //is sensor
	null);

staticBox('wall',
		'rightwall',
	cWidth,//X
	cHeight/2,//Y
	1, //W
	cHeight,//H
	0,
	density,friction,restitution,
	false, //is sensor
	null);


staticBox(
	'box', //class
	'box0', //id
	250,	//x pos
	40,	//y position
	10,		//width
	10,		//height
	0,		//angle
	density,friction,restitution,
	false, //is sensor
	'assets/cutrope/anchor.png');


dynamicCircle('chain', //firt link in chain
	'hang0',
	250, //X
	45, //Y
	5,
	0,
	false,
	100,100,0,
	'assets/cutrope/ball.png');
revoluteJoint('box0','hang0'); //anchor it

var chX = 250;
var chY = 45;
for(var i=1;i<30;i++){
	dynamicCircle('chain',
		'hang'+i,
		chX, //X
		chY, //Y
		4,
		0,
		false,
		100,100,restitution,
		'assets/cutrope/ball.png');
	chX-=5;
	chY+=5;

	revoluteJoint('hang'+i,'hang'+(i-1));
	
};
//console.log(chX+' '+chY);


dynamicCircle('ball',
	'ball',
	105,
	165,
	30,
	0,
	false,
	1,100,restitution,
	'assets/cutrope/ball.png');
	
revoluteJoint('hang29','ball');

//////////////////////////////rinse and repeat!
staticBox(
	'box', //class
	'box1', //id
	50,	//x pos
	40,	//y position
	10,		//width
	10,		//height
	0,		//angle
	density,friction,restitution,
	false, //is sensor
	'assets/cutrope/anchor.png');
	
dynamicCircle('chain', //firt link in chain
	'hang30',
	55, //X
	45, //Y
	5,
	0,
	false,
	50,100,0,
	'assets/cutrope/ball.png');
revoluteJoint('box1','hang30'); //anchor it

var chX = 58;
var chY = 48;
for(var i=31;i<49;i++){
	dynamicCircle('chain',
		'hang'+i,
		chX, //X
		chY, //Y
		4,
		0,
		false,
		50,100,restitution,
		'assets/cutrope/ball.png');
	chX+=3;
	chY+=6;
	revoluteJoint('hang'+i,'hang'+(i-1));
};
//console.log(chX+' '+chY);

revoluteJoint('hang48','ball');


var clicking = false;

$('#canvas').mousedown(function(){
    clicking = true;
	//console.log("click");
});

$('#canvas').mouseup(function(){
    clicking = false;
	//console.log("unclick");
});

$('#canvas').mousemove(function(e){
	
	pointX = e.pageX-canvas.offsetLeft;
	pointY = e.pageY-canvas.offsetTop;
	
	//console.log(pointX+' '+pointY);

	if (clicking){
		//console.log(pointX+' '+pointY);
		pointX = e.pageX-canvas.offsetLeft;
		pointY = e.pageY-canvas.offsetTop;
		
		circleRadius = 10;

		collisions(pointX,pointY,circleRadius);
	};
});

function collisions(pointX,pointY,circleRadius){
	//console.log(pointX,pointY,circleRadius);
	
	for(var i=1;i<49;i++){
		var Xpos = getPosition('hang'+i)[0];
		var Ypos = getPosition('hang'+i)[1];
		
		//console.log(Xpos+' '+pointX);
		
		Xpos1 = Xpos-circleRadius;
		Xpos2 = Xpos+circleRadius;
		
		Ypos1 = Ypos-circleRadius;
		Ypos2 = Ypos+circleRadius;
		
		if((pointY >= Ypos1)&&(pointY <=Ypos2)){
		
			if((pointX >= Xpos1)&&(pointX <=Xpos2)){
					destroy('hang'+i); //destroy link
			}
		
		}
		
		
	}
}



function killBall(returned){
	var ret = returned;
	console.log(ret.idB);
	//go look at the return data in giftwrap... I was working on this!
	var position = getPosition(ret.idB); //get the position of the ball
	//console.log(size);
	//console.log(position);
	destroy(ret.idB);//destroy it...                            See 
	explode(position);	
};


function explode(position){
	//console.log(size);
	//console.log(position);

	for(var i=0;i<30;i++){
		dynamicCircle('bits','bits'+i,position[0],position[1],5,0,false,0.5,10,restitution,'assets/cutrope/ball.png');
		rnd1 = randomNumber(0,1)/10;
		rnd2 = randomNumber(0,1)/10;
		//console.log(rnd1,rnd2);
		shoveObject('bits'+i,rnd1,rnd2);
	};
};



superCollider(
	'group',
	'ball',
	'wall',
	null,
	'killBall'
);












