(function(){
    // players
    var players = []
    var playerOneName;
    var playerTwoName;
    var playerOne;
    var playerTwo;
    var game;
    
    // function to create a new player object 
    var Player = function (name, role, color){
        this.name = name;
        this.role = role;
        this.color = color;
        this.boxes = [];
    }
    
    var screenModule = (function(){
        // start screen html
        var startScreenHtml = '<div class="screen screen-start" id="start">\
                                  <header>\
                                    <h1>Tic Tac Toe</h1>\
                                    <a href="#" class="button">Start game</a>\
                                  </header>\
                                </div>';
        
        // finish screen html
        var finishScreenHtml = '<div class="screen screen-win" id="finish">\
                                  <header>\
                                    <h1>Tic Tac Toe</h1>\
                                    <p class="message">{{win-message}}</p>\
                                    <a href="#" class="button">New game</a>\
                                  </header>\
                                </div>';
        var exports = {};
        // function to display start screen
        exports.displayStartScreen = function(){
            $("body").append(startScreenHtml);
        };
        // function to hide start screen
        exports.hideStartScreen = function(){
            $("#start").remove();
        };
        // function to display finish screen
        exports.displayFinishScreen = function(background, message){
            $("#board").css("display", "none");
            $("body").css("background-color", background);
            $("body").append(finishScreenHtml.replace("{{win-message}}", message));
        }
        return exports;
    })
    
    // function to create a new game object                 
    var Game = function(players){
        this.players = players;
        this.currentPlayerIndex = 0;
    }
    
    // function to return the current player
    Game.prototype.getCurrentPlayer = function(){
        // return the current active player
        return this.players[this.currentPlayerIndex];
    }
    
    // function to check if the game has won, is a draw and if not increase currentPlayerIndex and mark the other player active
    Game.prototype.makeMove = function(currentPlayer){
        // call hasPlayerWon function to check if the game has been won, if it doesn't return true, check if it's a draw by calling the isBoardFull function
        if(game.hasPlayerWon(currentPlayer) !== true){
            game.isBoardFull();
        }
        // increase or decrease currentPlayerIndex based on its current value
        if(this.currentPlayerIndex === 0){
            this.currentPlayerIndex++;
        }else{
            this.currentPlayerIndex--;
        }
        // mark the new active player
        GameUI.markActivePlayer();
    }
    
    // function to check if the current player won the game
    Game.prototype.hasPlayerWon = function(currentPlayer){
        // winning conditions
        var row = [[1, 2, 3],[4, 5, 6],[7, 8, 9]];
        var column = [[1, 4, 7],[2, 5, 8],[3, 6, 9]];
        var diagonal = [[1, 5, 9],[3, 5, 7]];
        var matches = 0;
        var currentPlayerBoxes = currentPlayer.boxes.sort((a, b) => a - b);;
        // check rows and columns if player has 3 matches in a row or a column
        for(i = 0; i < 3; i++){
            // loop through each row and check if the number is in the array of boxes of the current player; if so increase matches by one
            for(j = 0; j < row[i].length; j++){
                if(currentPlayerBoxes.indexOf(row[i][j]) >= 0){
                    matches++;
                }
            }
            // if there are three matches in one row, the current player has won; display finish screen announcing the winner
            // if there are less than three matches, reset the matches to zero
            if(matches == 3){
                screenModule().displayFinishScreen(currentPlayer.color, currentPlayer.name + " has won!")
                return true;
                break;
            }else{
                matches = 0;
            }
            // loop through each column and check if the number is in the array of boxes of the current player; if so increase matches by one
            for(j = 0; j < column[i].length; j++){
                if(currentPlayerBoxes.indexOf(column[i][j]) >= 0){
                    matches++;
                }
            }
            // if there are three matches in one column, the current player has won; display finish screen announcing the winner
            // if there are less than three matches, reset the matches to zero
            if(matches == 3){
                screenModule().displayFinishScreen(currentPlayer.color, currentPlayer.name + " has won!");
                return true;
                break;
            }else{
                matches = 0;
            }
        }
        // check diagonals if player has 3 matches
        for(i = 0; i < 2; i++){
            // loop through each diagonal winning condition and check if the number is in the array of boxes of the current player; if so increase matches by one
            for(j = 0; j < diagonal[i].length; j++){
                if(currentPlayerBoxes.indexOf(diagonal[i][j]) >= 0){
                    matches++;
                }
            } 
            // if there are three matches in one diagonal, the current player has won; display finish screen announcing the winner
            // if there are less than three matches, reset the matches to zero
            if(matches == 3){
                screenModule().displayFinishScreen(currentPlayer.color, currentPlayer.name + " has won!");
                return true;
                break;
            }else{
                matches = 0;
            }
        }
    }
    
    // check if the board is full, if so it's a draw
    Game.prototype.isBoardFull = function(){
        // get all empty boxes from the board
        var emptyBoxes = $(".box:not(.inactive)");
        // if there are no empty boxes, it's a draw
        if(emptyBoxes.length == 0){
            screenModule().displayFinishScreen("red", "It's a draw!");
        }
    }
    
    var GameUI = {
    	markActivePlayer : function(){
    		// remove active class from previous player
    		$(".active").removeClass("active");
    		// get new active player
    		let currentPlayer = game.getCurrentPlayer();
    		// add class to new active player
    		$("#player" + currentPlayer.role).addClass("active");
    	},
    	hoverOn : function(target, currentPlayer){
    		// add icon class to target
    		$(target).addClass("box-filled-" + currentPlayer);
    	},
    	hoverOff : function(target, currentPlayer){
    		// remove icon class from target
    		$(target).removeClass("box-filled-" + currentPlayer);
    	},
    	addIcon : function(target, currentPlayer){
    		// add icon class to target
    		$(target).addClass("box-filled-" + currentPlayer);
    		// add inactive class to target
    		$(target).addClass("inactive");
    	},
    }
    
    // execute on load
    document.addEventListener("DOMContentLoaded", function(){
        // display start screen
        screenModule().displayStartScreen();
        // execute with delay, so start screen is displayed first
        window.setTimeout(function(){
            // prompt user for player names
            playerOneName = prompt("Please enter your name, player 1.");
            playerTwoName = prompt("Please enter your name, player 2.");
            // create two instances of player object
            playerOne = new Player(playerOneName, 1, "#FFA000");
            playerTwo = new Player(playerTwoName, 2, "#3688C3");
        
            // push player instances to players array
            players.push(playerOne);
            players.push(playerTwo);
        
        
            // create new instance of game object
            game = new Game(players);
        },200);
    })
    
    // display game when start button is clicked
    $(document).on("click", "#start .button", function(){
        // remove start screen
    	screenModule().hideStartScreen();
        // display names on play board
        $("#player1").append('<span>' + players[0]["name"] + '</span>');
        $("#player2").append('<span>' + players[1]["name"] + '</span>');
        // mark player one active
        GameUI.markActivePlayer();
    })
    
    // display player icon when the mouse enters
    $('.box').mouseenter(function(){
        // get current player
        var currentPlayer = game.getCurrentPlayer();
        // if the box isn't already marked, add the icon
    	if(!$(this).hasClass("inactive")){
        	GameUI.hoverOn(this, currentPlayer.role)
        }
    })
    
    // remove player icon when the mouse leaves
    $('.box').mouseleave(function(){
        // get current player
        var currentPlayer = game.getCurrentPlayer();
        // if the box isn't already marked, remove the icon
    	if(!$(this).hasClass("inactive")){
        	GameUI.hoverOff(this, currentPlayer.role);
        }
    })
    
    // add player icon to box when clicked - make a move
    $(".box").click(function () {
        // if the field isn't already marked, check which player is making the move and call the addIcon function to mark the box; do nothing if field is already marked
        if(!$(this).hasClass("inactive")){
            var boxId = $(this).attr("id");
            // get current player
            var currentPlayer = game.getCurrentPlayer();
            // add the matching icon to the clicked box
            GameUI.addIcon(this, currentPlayer.role);
            // store the id of the box to players boxes
            currentPlayer.boxes.push(parseInt(boxId));
            // call make move function to check if the player has won, if it's a draw and if not adjust the currentPlayerIndex and mark the other player active
            game.makeMove(currentPlayer);
        }
     });
    
    // restart game when the button on the finish screen is clicked
    $(document).on("click", "#finish .button", function(){
        location.reload();
    })
    
    // add ids with the numbers 1 to 9 to the boxes in order to keep track of the state of the game
    var boxes = $(".box");
    for(i = 0; i < boxes.length; i++){
    	$(boxes[i]).attr("id", i+1);
    }
}());