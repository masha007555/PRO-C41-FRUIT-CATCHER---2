class Game{
    constructor(){}

    getState() {
        var gameStateRef = database.ref('gameState');
        gameStateRef.on("value", function (data) {
            gameState = data.val();
        })
    }

    update(state) {
        database.ref('/').update({
            gameState: state
        });
    }

    async start() {
        if (gameState === 0) {
            player = new Player();

            var playerCountRef = await database.ref('playerCount').once("value");
            if (playerCountRef.exists()) {
                playerCount = playerCountRef.val();
                player.getCount();
            }

            form = new Form()
            form.display();
        }

        player1 = createSprite(200,500);
        player1.addImage("player1",player_img);
        
        player2 = createSprite(800,500);
        player2.addImage("player2", player_img);
        players=[player1,player2];

    }
    
    play(){
        
        form.hide();

        Player.getPlayerInfo();
        image(back_img, 0, 0, 1000, 800);
        var x =100;
        var y=200;
        var index =0;
        var position = 25;

        drawSprites();
        for(var plr in allPlayers){
            index = index+1;
            x = 500-allPlayers[plr].distance;
            y=500;
            position += 275;
            
            players[index -1].x = x;
            players[index - 1].y = y;
            
            if(index === player.index){
                fill("white");
                stroke("black");
                strokeWeight(3);
                textSize(25);
                text(allPlayers[plr].name,x - 25,y + 25);
            }

            if(fruitGroup.isTouching(players[index - 1]) && index === player.index){
                player.score++;
                player.update();
            }

            fill(255);
            textSize(25);
            stroke("black");
            strokeWeight(2);
            text(allPlayers[plr].name + "'s Score: " + allPlayers[plr].score,position,30);

            if(allPlayers[plr].score >= 50){
                fill(255); 
                stroke("black"); 
                strokeWeight(4); 
                textSize(50); 
                text("The Winner is "+allPlayers[plr].name,210,100);
                game.update(2);
            }
        }

        if (keyIsDown(RIGHT_ARROW) && player.index !== null || keyIsDown(68) && player.index !== null) {
            player.distance -= 10
            player.update();
        }
        if (keyIsDown(LEFT_ARROW) && player.index !== null || keyIsDown(65) && player.index !== null) {
            player.distance += 10
            player.update();
        }

        if (frameCount % 20 === 0) {
            fruits = createSprite(random(100, 1000), 0, 100, 100);
            fruits.velocityY = 6;
            var rand = Math.round(random(1,5));

            switch(rand){
                case 1: fruits.addImage("fruit1",fruit1_img);
                break;
                case 2: fruits.addImage("fruit1", fruit2_img);
                break;
                case 3: fruits.addImage("fruit1", fruit3_img);
                break;
                case 4: fruits.addImage("fruit1", fruit4_img);
                break;
                case 5: fruits.addImage("fruit1", fruit5_img);
                break;
            }
            fruitGroup.add(fruits);
        }
                 
        if (player.index !== null) {
            for (var i = 0; i < fruitGroup.length; i++) {
                if (fruitGroup.get(i).isTouching(players)) {
                    fruitGroup.get(i).destroy();
                }
            }
        }
    }

    end(){
       console.log("Game Ended");
       fruitGroup.destroyEach();
       
       textSize(100);
       fill(255);
       stroke("black");
       strokeWeight(4);
       text("GAME OVER",175,250);
    }
}
