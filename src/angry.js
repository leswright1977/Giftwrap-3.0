//set up the world real quick!...
gravity(0,9.82);
setBackground('assets/angry/bg.png');

var density = 1;
var friction = 100;
var restitution = 0.4;

var cWidth = 800;
var cHeight = 600;

//setup walls and floors etc
staticBox('wall',    //object name
	'floor', //object id
	cWidth/2,		//X
	cHeight-50,		//Y
	cWidth,		//width
	100,			//height
	0,			//angle
	density,friction,restitution,
	false, //is sensor
	'assets/angry/marble.png');		//asset
			
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

dynamicCircle('player',
	'player1',
	90,
	380,
	40,
	0,
	false,
	2,friction,restitution,
	'assets/angry/ball3.png');
	
staticBox(
	'platform', //class
	'platform1', //id
	90,		//x pos
	475,	//y position
	30,		//width
	50,		//height
	0,		//angle
	density,friction,restitution,
	false, //is sensor
	'assets/angry/vertshort.png');

dynamicBox('box',
	'box1',
	500, //X
	449, //Y
	30, //W
	100, //h
	0,
	false,
	density,friction,restitution,'assets/angry/vertshort.png');
	
dynamicBox('box',
	'box2',
	700, //X
	449, //Y
	30, //W
	100, //h
	0,
	false,
	density,friction,restitution,'assets/angry/vertshort.png');

dynamicBox('box',
	'box3',
	600, //X
	380, //Y
	300, //W
	28, //h
	0,
	false,
	density,friction,restitution,'assets/angry/horizlong.png');
	
	
dynamicBox('box',
	'box4',
	540, //X
	340, //Y
	30, //W
	100, //h
	0,
	false,
	density,friction,restitution,'assets/angry/vertshort.png');
	
dynamicBox('box',
	'box5',
	670, //X
	340, //Y
	30, //W
	100, //h
	0,
	false,
	density,friction,restitution,'assets/angry/vertshort.png');
	
dynamicBox('box',
	'box6',
	600, //X
	280, //Y
	200, //W
	20, //h
	0,
	false,
	density,friction,restitution,'assets/angry/horizshort.png');
	
	
dynamicCircle('enemy',
	'enemy1',
	600,
	226,//Y
	40,
	0,
	false,
	5,100,restitution,
	'assets/angry/ball6.png');
	
dynamicCircle('enemy',
	'enemy2',
	600,
	350,
	40,
	0,
	false,
	5,100,restitution,
	'assets/angry/ball8.png');
	
dynamicCircle('enemy',
	'enemy3',
	560,
	480,
	40,
	0,
	false,
	5,100,restitution,
	'assets/angry/ball9.png');
	
dynamicCircle('enemy',
	'enemy4',
	640,
	480,
	40,
	0,
	false,
	5,100,restitution,
	'assets/angry/ball2.png');
	
	
	
superCollider(
	'group',
	'enemy',
	'box',
	null,
	'coll'
);

var score = 0;
	
function coll(test){

	 if(enemy1.GetUserData().impulse > 2.86){
		 destroy('enemy1');
		 enemy1.SetUserData
		 score+=10;
	 }
	 if(enemy2.GetUserData().impulse > 2.86){
		 destroy('enemy2');
		 score+=10;
	 }
	 if(enemy3.GetUserData().impulse > 2.86){
		 destroy('enemy3');
		 score+=10;
	 }
	 if(enemy4.GetUserData().impulse > 2.86){
		 destroy('enemy4');
		 score+=10;
	 }

	 console.log(box4.GetUserData().impulse)
	 
	 if(box1.GetUserData().impulse > 9){
		 destroy('box1');
		 score+=5;
	 }
	 if(box2.GetUserData().impulse > 9){
		 destroy('box2');
		 score+=5;
	 }
	 if(box3.GetUserData().impulse > 9){
		 destroy('box3');
		 score+=5;
	 }
	 if(box4.GetUserData().impulse > 9){
		 destroy('box4');
		 score+=5;
	 }
	 if(box5.GetUserData().impulse > 9){
		 destroy('box5');
		 score+=5;
	 }
	 $('#score').html('Score: '+score);
};
	
	
	
	
var firePlayer = false;
	
	
	
$("#canvas").mousedown(function(e){
	/*you cannot just get the position from the canvas 
	i.e. with e.offset
	as when you click inside the child div (child), we get the
	pos within the div!
	use page position and the offset of the canvas instead
	*/

	//console.log(e.pageX+' '+e.pageY);
	
	//console.log(e);

	circleX = getPosition('player1')[0];
	circleY = getPosition('player1')[1];
	radius = 15;

	pointX = e.pageX-canvas.offsetLeft;
	pointY = e.pageY-canvas.offsetTop;
	
	console.log(pointX+' '+pointY);
	
	insideCircle = (((pointX -circleX)*(pointX - circleX))+(pointY -circleY)*(pointY - circleY));

	if (insideCircle <= (radius*radius)){
		startX = pointX;
		startY = pointY;
		firePlayer = true;
	}
});

$("#canvas").mouseup(function(e){
	console.log('mouseup');
	
	if (firePlayer == true){
		console.log('ready');
		endX = e.offsetX;
		endY = e.offsetY;

		var X = (startX - endX)*2;
		var Y = (startY - endY)*2;
		console.log(X+''+Y);
		shoveObject('player1',X,Y);
		firePlayer = false
	}
});


/*
TODO:
splinters
impulses
*/


	
