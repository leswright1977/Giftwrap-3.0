/*
giftwrap 3.0 Experimental CSS version......

Leslie Wright 01/11/2018

What is it??

giftwrap is a thin wrapper for box2d and CSS,
to allow new programmers to produce a web game with
minimal coding skills using JavaScript.

This work was inspired by the teaching of Russ Hunter of Perth College UHI whose 
4th year Web Programming module was freaking awesome!


This code makes use of eval, but before anyone goes on an 'eval is evil rant':
https://javascriptweblog.wordpress.com/2010/04/19/how-evil-is-eval/

TODO Maybe I should take a look at this and refactor? In progress.....
https://www.nczonline.net/blog/2013/06/25/eval-isnt-evil-just-misunderstood/
See staticbox for the solution! :-)
also see 
http://stackoverflow.com/questions/17278858/using-string-as-variable-name-in-js

//////////////////////////////SNIP///////////////////////////////////////////
Not directly, no. But, you can assign to window, which assigns it as a globally 
accessible variable :

var name = 'abc';
window[id] = 'something';
alert(abc);

However, a much better solution is to use your own object to handle this:

var name = 'abc';
var my_object = {};
my_object[name] = 'something';
alert(my_object[name]);
//////////////////////////////////////////////////////////////////////////////


All of the things are wrapped up in easy to call functions, no object oriented 
stuff. This is to make life easy for new programmers.
The game logic etc, will be all up the them.

Simple games can be implemented such as breakout, frozen bubble etc..

TODO
FIX: all objects should go into an array! (Done!) 

Still TODO with the objects array, we need to get rid of deleted objects 
out of it.
If we did something like spawn bullets, this will currently grow like crazy!


TODO We need to do a lot of work by id (individual items) rather than by class 
(name)
For example, if the USER wants to handle destroying of objects,
then the destroy function needs to iterate over a list of all objects, 
to determine which object to destroy.......
Done, mostly! 

TODO: DONE: Supercollider, users should be able to choose whether to detect 
collisions based on class (name), or individual id (id)

TODO:
Changelog:

May 2018
Added in a function to check if two objects share the same id (distinct()), 
and display a warning in the console.
Students do this with regularity and bizarre things happen in the games without 
necessarily crashing the program.
The function disctinct() is called in game-loop.js just before the main loop 
runs.

June 2018
Added example coode to handle orientation events for mobile devices

June 2018
TODO: Add in functionaility to check the length or the args list for each of our
 object types. Students often miss out an argument. This doesnt normally lead to
 a crash, but can cause odd things to happen, such as assets not loading.

 Nov 2019
 Bug fixes implemented, new version released (3.0)
 Polygons now supported.



we could do:

SuperCollider(
	'class',
	'brick',
	'ball',
	'brick',
	some_function_for_brick_collisions
)

OR

SuperCollider(
	'id',
	'brick',
	'ball',
	'brick10',
	'function_to_handle_brick10'
)


put the game loop back in!
granted we dont need it for attaching images anymore, 
but we could levarage it for games that arent driven solely by user input,
like breakout is! With a loop we could do spaceinvaders
Er actually no! Leave it out! We can do setimeout See Latest galaga.js

We also need to add post solve to superCollider() in some sensible way,
so we could spawn object in place of a destroyed target? a-la asterouds?

TODO: (in progress)  also add in impact strength? a-la angry birds ?

Can I also implement and image change on an object? I reckon so

The following functions are implemented:

Note name can be a general class of objects, for example brick
id should be unique, for example brick1, brick2 etc
This is to allow the detroy functions to keep a track of which object belongs to which div


staticBox(name,id,X,Y,W,H,angle,density,friction,restitution,img)			Build a box with these properties

dynamicBox(name,id,X,Y,W,H,fixed,angle,density,friction,restitution,img)	Build a dynamic box with these properties

function staticCircle(name,id,X,Y,S,density,friction,restitution,img)		Build a circle with these properties

dynamicCircle(name,id,X,Y,S,fixed,density,friction,restitution,img)			Build a dynamic circle with these properties


destroy(objName)														Destroy any arbitrary object

auto_destroyer()															Destroy objects pushed into the destroyList by superCollider()

spriteFollow(spriteName)											       Have sprites follow box2D objects

play_sound(asset)															Play mp3

gravity(gx,gy)																Set gravity

shoveObject(dynObject,sX,sY)												Use applyImpulse to move object

pushObject(dynObject,sX,sY)												Use applyForce to move object

positionObject(dynObject,sX,sY)											Instantly mode an object to defined location!

deadStop(dynObject)														Stop a moving object dead

superCollider()																Deal with all of the in-game collisions

getPosition(dynObject)														Get position (scaled) of an abject in play
*/


//set up all the things.
var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2MassData = Box2D.Collision.Shapes.b2MassData;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

var box2dCanvas, box2dContext;
box2dCanvas = document.getElementById('box2dCanvas'); 
box2dContext = box2dCanvas.getContext('2d');


//box2d world setup, this can be overridden later.................
world = new b2World(new b2Vec2(0, 9.81), false);

var SCALE = 30;

//debug setup
var debugDraw = new b2DebugDraw();
debugDraw.SetSprite(box2dContext);
debugDraw.SetDrawScale(SCALE);
debugDraw.SetFillAlpha(0.3);
debugDraw.SetLineThickness(1.0);
debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
world.SetDebugDraw(debugDraw);

objects = []; //array for all the things!

function setBackground(img){
	$('#canvas').css('background-image','url('+img+')');
};


function changeImage(divId,img){
	$('#'+divId).css('background-image','url('+img+')');
};

//scroll canvas background image takes args:
//X, Y and speed (where lower is faster...);
function scrollBackground(x,y,s){
	var x,y,s;
	var oX = 0;
	var oY = 0;
	function bgscroll(){
		oX = oX-x;
		oY = oY-y;
		$('#canvas').css("backgroundPosition", oX+'px '+oY+'px');
	};
	//Calls the scrolling function repeatedly
	setInterval(bgscroll, s);    
};


/*
simple timer

This can be used to spawn objects on a timer.
takes 3 args: Delay (ie length of tick in milliseconds), a counter start variable, function to run


We write a function to spawn an object like this:
NOTE We HAVE to declare the parameter clock_counter, as it is used for object id's!

This example spawns a thousand balls

function ballfunction(clock_counter){
	if(clock_counter < 1000){
		dynamicCircle('ball',
					'player'+clock_counter,
					50,
					20,
					15,
					0,
					false,
					0.2,friction,restitution,
					null);
	};
};

Then we call the clock like this

clock(700,0,'ballfunction');


*/
function clock(delay,clock_counter,timed_function){
	setTimeout(function() {
		eval(timed_function+'(clock_counter)');//function to run, pass in the current value of clock_timer
		clock_counter++;
		clock(delay,clock_counter,timed_function);
	}, delay);
};


function randomNumber(min, max) {
    return Math.random()*(max-min+1)+min;
};


//distinct
//check we do not have any two objects with the same id!
//this can break the program in inexplicable ways!
//uses objects[0].GetUserData().id to grab the ID's
function distinct(){
	var total=0;
	for(var i=0;i<objects.length;i++){
		object1 = objects[i].GetUserData().id
		for(var j=0;j<objects.length;j++){
			object2 = objects[j].GetUserData().id
			if((object1==object2)&&(i!=j)){ //if we have a match, and we are not matching against ourselves!
				console.log("More than one object has the same id ***"+object1+
						"*** This can cause the program to behave weirdly!!!!");
			};
		};
		total++;
	};
	console.log(total+" objects checked");
};



/*
staticBox takes the args:

name	name i.e somename  this will also be enumerated as somenameBMP to track and deal with the corresponding image (if set)
id		id:  This is used for collision purposes, so if we want to destroy anything with the id 'brick' we can
X,Y		X,Y coords in px
W,H		Width height in px
angle   As it says, in degrees
density,friction,restitution: Default, 1,0.5,0
img		path to image i.e. 'assets/my_image.png'
*/

var staticBox;
function staticBox(group,id,X,Y,W,H,angle,density,friction,restitution,sensor,img){
	var arglist = arguments; //pass array items into our own named array
	try {
		if (arglist.length != 12) throw err;
		} catch (err) {
		console.log('Warning!!! There should be 12 arguments supplied to staticBox, '+arglist.length+' were given');
		console.log('This may cause issues with your program');
		console.log('The id of your object is:'+id);
	};


	var oW = W; //original width for CSS
	var oH = H; //original width for CSS
	var oX = X; //original X pos for CSS
	var oY = Y; //original Y pos for CSS
	var oAngle = angle;//original angle for CSS
	//convert angle to radian
	angle = angle * (Math.PI/180);
	var W = W/2; //Fix scaling
	var H = H/2; //Fix scaling	
	var fixDef = new b2FixtureDef;
	var bodyDef = new b2BodyDef;

	bodyDef.type = b2Body.b2_staticBody;
	fixDef.shape = new b2PolygonShape;
	fixDef.shape.SetAsBox(W/SCALE,H/SCALE);

	fixDef.density = density;			//default = 1
	fixDef.friction = friction;			//default = 0.5
	fixDef.restitution = restitution;	//default = 0
	fixDef.isSensor=sensor;
	
	bodyDef.position.x = X/SCALE;
	bodyDef.position.y = Y/SCALE;
	bodyDef.angle = angle;

	window[id] = world.CreateBody(bodyDef); //do it with no eval :-)
	window[id].CreateFixture(fixDef);
	window[id].SetUserData({group:group,
								id:id,
								width:W,
								height:H,
								oX:oX,
								oY:oY,
								impulse:0});

	if(img==null){
		image = ''
		if(sensor){	
			color = 'background: lightgreen;';
		}else{
			color = 'background: blue;';
		};
	}else{
		image = 'background-image:url('+img+'); background-size:100%;'
		color = 'background: transparent;';
	};

	$('#canvas').append('<div id="'+id+'" style="position: absolute;\
	left:'+(X-(W))+'px;\
	top:'+(Y-(H))+'px;\
	transform: rotate('+oAngle+'deg);\
	'+color+image+' width:'+W*2+'px;\
	height:'+H*2+'px;\
	z-index:1;"></div>');


	objects.push(window[id]);//push everything into the staticObjects list
};



/*
dynamicBox takes the args:

name	name i.e player1  this will also be enumerated as player1BMP to track and deal with the corresponding image (if set)
id		id:  This is used for collision purposes, so if we want to destroy anything with the id 'brick' we can
X,Y		X,Y coords in px
W,H		Width height in px
fixed	Do you want rotation fixed, true/false
angle   As it says, in degrees
density,friction,restitution: Default, 1,0.5,0
img		path to image i.e. 'assets/my_image.png'
*/

var dynamicBox;
function dynamicBox(group,id,X,Y,W,H,angle,fixed,density,friction,restitution,img){
	var arglist = arguments; //pass array items into our own named array
	try {
		if (arglist.length != 12) throw err;
		} catch (err) {
		console.log('Warning!!! There should be 12 arguments supplied to dynamicBox, '+arglist.length+' were given');
		console.log('This may cause issues with your program');
		console.log('The id of your object is:'+id);
	};

	var oW = W; //original width for CSS
	var oH = H; //original width for CSS
	var oX = X; //original X pos for CSS
	var oY = Y; //original Y pos for CSS
	var oAngle = angle;//original angle for CSS

	//convert angle to radian
	angle = angle * (Math.PI/180);	
	var W = W/2; //Fix scaling
	var H = H/2; //Fix scaling
	var fixDef = new b2FixtureDef;
	var bodyDef = new b2BodyDef;

	bodyDef.type = b2Body.b2_dynamicBody;
	fixDef.shape = new b2PolygonShape;
	fixDef.shape.SetAsBox(W/SCALE,H/SCALE);
	
	fixDef.density = density;			//default = 1
	fixDef.friction = density;			//default = 0.5
	fixDef.restitution = restitution;	//default = 0
	
	bodyDef.position.x = X/SCALE;
	bodyDef.position.y = Y/SCALE;
	bodyDef.angle = angle;

	//window [group]. applied our groupname to the object.
	//tis means we can call player1.getUserData() etc.
	window[id] = world.CreateBody(bodyDef); //do it with no eval :-)
	window[id].CreateFixture(fixDef);
	window[id].SetUserData({group:group,
								id:id,
								width:W,
								height:H,
								oX:oX,
								oY:oY,
								impulse:0});
	window[id].SetFixedRotation(fixed);

	if(img==null){
		image = ''
		color = 'background: yellow;';
	}else{
		image = 'background-image:url('+img+'); background-size:100%;'
		color = 'background: transparent;';
	};

	$('#canvas').append('<div id="'+id+'" style="position: absolute;\
	left:'+(X-(W))+'px;\
	top:'+(Y-(H))+'px;\
	transform: rotate('+oAngle+'deg);\
	'+color+image+' width:'+W*2+'px;\
	height:'+H*2+'px;\
	z-index:1;"></div>');

	objects.push(window[id]);//push everything into the objects list

};

/*
staticCircle takes the args:

name	name i.e somename  this will also be enumerated as somenameBMP to track and deal with the corresponding image (if set)
id		id:  This is used for collision purposes, so if we want to destroy anything with the id 'brick' we can
X,Y		X,Y coords in px
S		Size
density,friction,restitution: Default, 1,0.5,0
img		path to image i.e. 'assets/my_image.png'
*/

var staticCircle;
function staticCircle(group,id,X,Y,S,angle,density,friction,restitution,img){
	var arglist = arguments; //pass array items into our own named array
	try {
		if (arglist.length != 10) throw err;
		} catch (err) {
		console.log('Warning!!! There should be 10 arguments supplied to staticCircle, '+arglist.length+' were given');
		console.log('This may cause issues with your program');
		console.log('The id of your object is:'+id);
	};

	var oS = S; //original size for CSS (diameter)
	var oX = X; //original X pos for CSS
	var oY = Y; //original Y pos for CSS
	

	var S = S/2; //Fix scaling
	var fixDef = new b2FixtureDef;
	var bodyDef = new b2BodyDef;
	var angle = angle;
	angle = angle * (Math.PI/180);

	bodyDef.type = b2Body.b2_staticBody;
	fixDef.shape = new b2CircleShape(S/SCALE);
	
	fixDef.density = density;			//default = 1
	fixDef.friction = friction;			//default = 0.5
	fixDef.restitution = restitution;	//default = 0

	bodyDef.position.x = X/SCALE;
	bodyDef.position.y = Y/SCALE;
	bodyDef.angle = angle;

	window[id] = world.CreateBody(bodyDef); //do it with no eval :-)
	window[id].CreateFixture(fixDef);
	window[id].SetUserData({group:group,
								id:id,
								size:oS,
								oX:oX,
								oY:oY,
								impulse:0});
	if(img==null){
		image = ''
		color = 'background: blue;';
	}else{
		image = 'background-image:url('+img+'); background-size:100%;'
		color = 'background: transparent;';
	};

	$('#canvas').append('<div id="'+id+'" style="position: absolute;\
	left:'+(X-(S))+'px;\
	top:'+(Y-(S))+'px;\
	transform: rotate('+angle+'deg);\
	'+color+image+' width:'+S*2+'px;\
	height:'+S*2+'px;\
	border-radius:'+S+'px;\
	z-index:1;"></div>');

	objects.push(window[id]);//push everything into the staticObjects list

};


/*
staticCircle takes the args:

name	name i.e player1  this will also be enumerated as player1BMP to track and deal with the corresponding image (if set)
id		id:  This is used for collision purposes, so if we want to destroy anything with the id 'brick' we can
X,Y		X,Y coords in px
S		Size
fixed	Can it roatate true/false
density,friction,restitution: Default, 1,0.5,0
img		path to image i.e. 'assets/my_image.png'
*/

var dynamicCircle;
function dynamicCircle(group,id,X,Y,S,angle,fixed,density,friction,restitution,img){
	var arglist = arguments; //pass array items into our own named array
	try {
		if (arglist.length != 11) throw err;
		} catch (err) {
		console.log('Warning!!! There should be 11 arguments supplied to dynamicCircle, '+arglist.length+' were given');
		console.log('This may cause issues with your program');
		console.log('The id of your object is:'+id);
	};
	//console.log(img);
	var oS = S; //original size for CSS (diameter)
	var oX = X; //original X pos for CSS
	var oY = Y; //original Y pos for CSS
	var fixed = fixed;
	//console.log(fixed);
	var angle = angle;
	angle = angle * (Math.PI/180);
	

	var S = S/2; //Fix scaling
	var fixDef = new b2FixtureDef;
	var bodyDef = new b2BodyDef;

	bodyDef.type = b2Body.b2_dynamicBody;
	fixDef.shape = new b2CircleShape(S/SCALE);
	
	fixDef.density = density;			//default = 1
	fixDef.friction = friction;			//default = 0.5
	fixDef.restitution = restitution;	//default = 0

	bodyDef.position.x = X/SCALE;
	bodyDef.position.y = Y/SCALE;
	bodyDef.angle = angle;
	//console.log(group);
	//console.log(id);
	window[id] = world.CreateBody(bodyDef); //do it with no eval :-)
	window[id].CreateFixture(fixDef);
	window[id].SetUserData({group:group,
								id:id,
								size:oS,
								oX:oX,
								oY:oY,
								impulse:0});
	window[id].SetFixedRotation(fixed);

	if(img==null){
		image = ''
		//color = 'background: yellow;';
		color = 'background: linear-gradient(to right, #ffff00, #ff0000);';
		//color = 'background: linear-gradient(to bottom, yellow 0%,yellow 50%,#000000 50%,red 50%,red 100%); /* W3C */';
	}else{
		image = 'background-image:url('+img+'); background-size:100%;'
		color = 'background: transparent;';
	};

	$('#canvas').append('<div id="'+id+'" style="position: absolute;\
	left:'+(X-(S))+'px;\
	top:'+(Y-(S))+'px;\
	transform: rotate('+angle+'deg);\
	'+color+image+' width:'+S*2+'px;\
	height:'+S*2+'px;\
	border-radius:'+S+'px;\
	z-index:1;"></div>');

	objects.push(window[id]);//push everything into the staticObjects list
};


var staticPolygon;
function staticPolygon(group,id,X,Y,ePoints,img){
	console.log('be careful NOT to make concave shapes! Collisions will break!');
	console.log('This object has a max size of 200*200!');
	var arglist = arguments; //pass array items into our own named array
	try {
		if (arglist.length != 6) throw err;
		} catch (err) {
		console.log('Warning!!! There should be 6 arguments supplied to staticPolygon, '+arglist.length+' were given');
		console.log('This may cause issues with your program');
		console.log('The id of your object is:'+id);
	};

	//experimental! This has no CSS built yet!!
	//Use it for static fixtures in a game, screenshot the box2d window
	//and draw the objects in as background for now.

	var angle = 0;
	angle = angle * (Math.PI/180);

	var fixDef = new b2FixtureDef;
	var bodyDef = new b2BodyDef;

	bodyDef.type = b2Body.b2_staticBody;
	fixDef.shape = new b2PolygonShape;

	fixDef.density = 100;			
	fixDef.friction = 0;
	fixDef.restitution = 0;	

	
	var points = [];
	var l = ePoints.length;
	var clipPath = '';//create empty string for the css
	for (var i = 0; i < l; i++) {
	    var vec = new b2Vec2();
	    vec.Set(ePoints[i].x/SCALE, ePoints[i].y/SCALE);
	    points[i] = vec;
		clipPath = clipPath+ePoints[i].x+'px '+ePoints[i].y+'px, ';//populate the string
	};
	clipPath = clipPath.substring(0, clipPath.length - 2);//trim the final space and comma!
	
	fixDef.shape.SetAsArray(points, points.length);	
	bodyDef.position.x = X/SCALE;
	bodyDef.position.y = Y/SCALE;
	bodyDef.angle = angle;
	

	window[id] = world.CreateBody(bodyDef); //do it with no eval :-)
	window[id].CreateFixture(fixDef);
	window[id].SetUserData({group:group,
								id:id,
								impulse:0});
	//objName.SetFixedRotation(fixed);

	if(img==null){
		image = ''
		color = 'background: yellow;';
	}else{
		image = 'background-image:url('+img+'); background-size:100%;'
		color = 'background: transparent;';
	};
	//console.log(clipPath);
	$('#canvas').append('<div id="'+id+'" style="position: absolute;\
	clip-path: polygon('+clipPath+');\
	transform: rotate('+angle+'deg);/*rortate the shape into position!*/\
	left:'+X+'px;\
	top:'+(Y)+'px;\
	'+color+image+' width:'+200+'px;\
	height:'+200+'px;\
	z-index:1;"></div>');

	objects.push(window[id]);//push everything into the staticObjects list
};
//staticPolygon('triangle','triangle',250,150,[{x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y:2}]);
/*see http://blog.sethladd.com/2011/09/box2d-and-polygons-for-javascript.html for how to draw polygons.*/




/*
destroy takes the args:
ID of the object, i.e. brick10
*/
function destroy(forDestruction){
	for (var i in objects){
		var obj = objects[i].GetUserData().id;
		if(obj==forDestruction){		
			//console.log(obj);	
			destroyList.push(objects[i]);//hand over to the destroy list
			
			//remove from objects array
			var index = objects.indexOf(i);
			if (index > -1) {
				objects.splice(index, 1);
			};
			
		};
	};

	//this is a fix, if when using supercollider() we want to respawn and object
	//we must have a world.step() occur before this can happen! Else we get a crash!
	//since I split out the game loop, and I'm trying to avoid students using 
	//it, I draw the following conclusion: If student wishes to respawn after
	//a collision, they must call their own function, get the required data
	//Then manually destroy. This has been the case since early version of giftwrap.
	//since they must destroy their object anyway, it makes sense to put this here...
	//I might make this a callable thing, but it is fine for now!
	//maybe in super collider right before the function call?
	//wee ned an arg in the list step = true

	world.Step(1/30,10,10);
	dynamicSpriteFollow();//have divs follow moving objects....
	world.ClearForces();
	world.DrawDebugData();


	////////////////////////////////////////////////////////////

};

/*
auto_destroyer(), call once in the game_loop to clean up any objects passed to the destroyList[]
*/

//$("#hello").remove();

var destroyList = []; //create array for destroyList
function auto_destroyer(){
	for (var i in destroyList){
		var cssobj = destroyList[i].GetUserData().id;
		world.DestroyBody(destroyList[i]);
		$('#'+cssobj).remove();
	};
	destroyList.length = 0;
};

/*
dynamicSpriteFollow
looks through the objects array, and updates css for the items it finds
*/
function dynamicSpriteFollow(){
	var o = objects.length;
	for(var i=0; i < o ; i++){
		var spriteName = objects[i];
		//console.log(spriteName);
		var rotation = spriteName.GetAngle()*(180/Math.PI);
		var x = spriteName.GetPosition().x*SCALE;
		var y = spriteName.GetPosition().y*SCALE;
		//console.log(y);
		var cssobj = spriteName.GetUserData().id;
		var w = spriteName.GetUserData().width;
		var h = spriteName.GetUserData().height;
		//console.log(x);

		//console.log(cssobj);

		var oX = spriteName.GetUserData().oX;
		var oY = spriteName.GetUserData().oY;
		var angle = spriteName.GetAngle();

		angle = Math.floor(angle / (Math.PI/180));
		//console.log(angle);
		//console.log(oX);
		//console.log(oY);
		//x is  = current Xpos - originalXpos
		x = x-oX;
		y = y-oY;
		//console.log(x);
		//Transforms are space seperated! Who knew! :-S
		$('#'+cssobj).css({'transform':'translate('+x+'px,'+y+'px) \
							rotate('+angle+'deg)'});
	};
};



/*
just a simple play sound function, takes a filname and path as the arg
*/
function playSound(asset,loop){
	var snd = new Audio();
	var sndsrc = document.createElement("source");
	sndsrc.type = 'audio/mpeg';
	sndsrc.src = asset;
	//console.log(sndsrc);
	snd.appendChild(sndsrc);

	if(loop == true){
		snd.addEventListener('ended', function() {
		console.log('Replaying '+sndsrc);
		snd.play();
		}, false);
	};
	snd.play();
};

/*
quick function to set gravity
*/
var gx, gy;
function gravity(gx,gy){
	world.SetGravity(new b2Vec2(gx,gy));
};


/*
shoveObject
takes args:

Object name i.e. player1
X
Y
Uses applyImpulse
*/
function shoveObject(objectID,sX,sY){
        window[objectID].ApplyImpulse(
        new b2Vec2(sX,sY),
        window[objectID].GetWorldCenter())
};
/*
pushObject
takes args:

Object name i.e. player1
X
Y
Uses applyForce
*/
function pushObject(objectID,sX,sY){
	window[objectID].ApplyForce(
	new b2Vec2(sX,sY),
	window[objectID].GetWorldCenter())      
};
/*
stop a moving object dead!
*/
function deadStop(objectID){
	window[objectID].SetLinearVelocity(new b2Vec2(0,0)); 
};
/*
position object
*/
function positionObject(objectID,sX,sY){
	window[objectID].SetPosition(new b2Vec2(sX/SCALE,sY/SCALE));
};


/*
rotateObject
takes args:

Object name i.e. player1
angle (degrees) pass it negative to do left rotate
*/
var dynObj,sAngle;
function rotateObject(objectID,sAngle){
	var currentAngle = window[objectID].GetAngle();
	currentAngle = currentAngle * (180/Math.PI);
	var newAngle = currentAngle + sAngle;
	newAngle = newAngle * (Math.PI/180);//convert to radians
	window[objectID].SetAngle(newAngle);
};


/*
superCollider() handles collisions, all of them!


takes the following args:

ObjA			The first object
ObjB			The second object
ObjC			Object to be destroyed, can be null if no destruction is required!
user_function   the name of a function to be run in the event of a collision

This function can be called only once, and is thus designed to take many args to deal with all your objects

Say we have player1 collides with player 2 so we want to destroy player 2 
AND if player1 collides with box1 then box1 is not destroyed but a sound is played by myFuction()

you can do:

superCollider('player1','player2','player2',null,'player1','box1',null,'myFunction')


Note to self: 
in Javascript, functions can handle missing args in a function, and too many!
we could do something way cool with, this like loop through the number of args,
work out how many items we are detecting contact for.
so we could specify an anonymous function and if we get 4, we go ahead, if we get 8 we go ahead twice, if we get 12 thrice and so on

*/
function superCollider(){

	var arglist = arguments; //pass array items into our own named array so we can access it inside another function!

	try {
		if (arglist.length % 5 != 0) throw err;
		} catch (err) {
		console.log('Warning!!! Length of arguments for supercollider must be divisible by five! I.e:  collide_by,ObjA,ObjB,Obj_to_destroy, function_to_run');
		console.log('null, is an acceptable value to enter for certain items, for example if you do not want to destroy an object then the following is legal:  ObjA,ObjB,null,myFunction');
	};

	//console.log(arglist);

	var driver_loop = arglist.length / 5;

	var offset = 0; //make an offset to acess the correct group of array elements
	/////////////////////////////////////////////////////////////////////////////////

	//listener for collisions
	var listener = new Box2D.Dynamics.b2ContactListener;
	listener.BeginContact = function(contact){



			////////////////////begin our loop over the arglist
			//console.log(arglist);
			var offset = 0;
			for (i=0;i < driver_loop; i++){
		
				var collideBy = arglist[0+offset]; // collide by class or id
				var objA = arglist[1+offset];
				var objB = arglist[2+offset];
				var objC = arglist[3+offset];
				var user_function = arglist[4+offset];

				//console.log(offset);
				///////////////////


				if (contact.GetFixtureA().GetBody().GetUserData != null && contact.GetFixtureB().GetBody().GetUserData != null) {
				//console.log('contact not null');

				/*data to return to our userdefined function...
				if we do this, we can customise detroy events, 
				i.e. we can do superCollider(A,B,null,myfunction)
				we get the required id's in myfunction, display a 
				change in obect behavour, i.e. an explosion
				THEN schedule the object for deletion....
				This uses JSON, because well JSON in the answer...
				*/
				idA = contact.GetFixtureA().GetBody().GetUserData().id;
				//console.log(idA);
				idB = contact.GetFixtureB().GetBody().GetUserData().id;
				//console.log(idB);

				var returnData = {idA:idA,idB:idB};
			
				if (contact.GetFixtureA().GetBody().GetUserData()[collideBy] == objA && contact.GetFixtureB().GetBody().GetUserData()[collideBy] == objB){
						//console.log('destroy '+objC);
					
					
					if (user_function != null){
						eval(user_function+'('+"returnData"+');');
					};
					
				
					if (objC != null){
						if (objA == objC){
							destroyList.push(contact.GetFixtureA().GetBody());
						};
						if (objB == objC){
							destroyList.push(contact.GetFixtureB().GetBody());
						};
					};
				};//end AA AB contact


			
				if (contact.GetFixtureA().GetBody().GetUserData()[collideBy] == objB && contact.GetFixtureB().GetBody().GetUserData()[collideBy] == objA){
						//console.log('destroy '+objC);
					
					if (user_function != null){
						eval(user_function+'('+"returnData"+');');
					};
					
				
					if (objC != null){
						if (objA == objC){			
							destroyList.push(contact.GetFixtureB().GetBody());
						};
						if (objB == objC){
							destroyList.push(contact.GetFixtureA().GetBody());
						};
					};
				};//end AB BA contact
			};//end if contact not null!
			offset = offset+5;//array offset....	
		};//end of driver loop...
	};//end contact

	//this section is outside the driver loop Fit it!!
	//probably need to do arglist here as well :-(
	//the loop above is INSIDE the 
	listener.EndContact = function(contact) {
		//nothing here yet....
	};

	listener.PostSolve = function(contact, impulse) {

		var user_function = arglist[3+offset];

		itemA = contact.GetFixtureA().GetBody();
		itemB = contact.GetFixtureB().GetBody();
		impulsea = impulse.normalImpulses[0];

		//console.log(impulsea);
		/*need to return impulse for this collision.......
		so here is a problem! We cannot loop in here, 
		impulses are more complex than a simple collision and it starts to do bizarre stuff.
		We can't in anyway append to the data sent tou our user function, and even if we could,
		because of the above it will break things in inexplicable ways!
		What we DO have is access to the objects involved!
		If I create a data item in each object called impulse, we can write the last impulse to the object.
		when the user calls supercollider, and passes data out to the userfunction, we can get the data in there.
		We can build a helper function for students called getImpulse(objectA,objectB), to go get the last impulse registered....
		It also appears that when a body is touching another, impulse is sometimes not registered in one of the bodies involved?
		I have come aross this before, so long as something is registered in one of the bodies, I think we might be ok


		Incidentally if we do this the getImpulse must also reset the impulse data in the object to zero AFTER we have pulled the data from it....

		bizzrely to SET userdata, we call GET userdata with an arg??  Who Knew!  something.GetUserData().impulse = 2.334;

		if we do getImpulse(objectA, objectB){
			var1 = objectA.GetUserData().impulse;
			var2 = objectB.GetUserData().impulse;

			reset the impulses to zero

			return the largest of var1 & var2; i.e. return(Math.max(var1,var2));

		};


		*/
	
		itemA.GetUserData().impulse = impulsea;
		itemB.GetUserData().impulse = impulsea;
		
		listener.PreSolve = function(contact, oldManifold) {
			//nothing here yet.....
		};	
	};

	this.world.SetContactListener(listener);

};//end superCollider();


//might need this for bullets...Note, gets position of object by ID!!
//only works for dynamic objects!
function getPosition(objectID){
	var x = Math.round(window[objectID].GetWorldCenter().x * SCALE);
	var y = Math.round(window[objectID].GetWorldCenter().y * SCALE);
	return [x,y];

};

function getSize(objectID){
	var x = window[objectID].GetUserData().size;
	return [x];
};




rJoints = 0;
//note first arg is the rotating end!
//Second arg is the non rotating end!
//if only two args are supplied, a simple free rotating joint is created
function revoluteJoint(obj1,obj2,speed,torque,enabled){
	var arglist = arguments;
	var revjoint = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
	revjoint.Initialize(window[obj1],window[obj2], window[obj1].GetWorldCenter());
	if(arglist.length==5){
		revjoint.motorSpeed = speed;
		revjoint.maxMotorTorque = torque;
		revjoint.enableMotor = enabled;
	};
	window['RevJoint'+rJoints] = world.CreateJoint(revjoint);
	rJoints++;
};

wJoints = 0;
function simpleWeld(obj1,obj2){
	var wjoint = new Box2D.Dynamics.Joints.b2WeldJointDef();
	wjoint.Initialize(window[obj1], window[obj2], window[obj1].GetWorldCenter());
	window['WeldJoints'+wJoints]  = world.CreateJoint(wjoint);
	wJoints++;
};

/*

example weld.....
dynamicBox('player','box',200,490,80,20,0,true,0.1,0.5,0,'assets/paddle2.png');

dynamicBox('player1','box1',370,490,80,20,0,true,0.1,0.5,0,'assets/paddle2.png');

function revWeld(A,B,x1,y1,x2,y2){
	var A,B;
	//create revolute joint between a and b
	var joint_def = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
	joint_def.bodyA = A;
	joint_def.bodyB = B;
	//connect the centers - center in local coordinate - relative to body is 0,0
	joint_def.localAnchorA = new b2Vec2(x1, y1);
	joint_def.localAnchorB = new b2Vec2(x2, y2);
	//add the joint to the world
	world.CreateJoint(joint_def);
};
revWeld(player,player1,0,0,3,0);
*/

