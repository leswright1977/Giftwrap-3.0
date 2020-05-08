//first lets check no two object have the same id!!
distinct();
integrated_fps = 0;
var fps_counter = 0;
time_t1 = Date.now()/1000;
function game_loop() {
	world.Step(1/30,10,10);
	dynamicSpriteFollow();//have divs follow moving objects....
	auto_destroyer();//destroy objects scheduled for destruction
	world.ClearForces();
	//world.m_debugDraw.m_sprite.graphics.clear();
	world.DrawDebugData();
	window.requestAnimationFrame(game_loop);
	
	fps_counter++;
	time_t2 = Date.now()/1000;
	time_t3 = time_t2 - time_t1;
	
	if(Math.round(time_t3) == 5){
		//type integrated_fps at the console to get fps!
		integrated_fps = fps_counter/time_t3;
		//reset timer and counter
		time_t1 = Date.now()/1000;
		fps_counter = 0;
	};
	
};

game_loop(); //start the animation







