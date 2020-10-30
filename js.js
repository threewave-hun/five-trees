var board = new Array();
var iscompleted = new Array();
documentWidth = window.screen.availWidth;
grid = 0.92*documentWidth;
cellside = 0.18 * documentWidth;
cellspace = 0.04 * documentWidth;

function getPosTop(i,j){
	return cellspace + i *(cellspace+cellside);
}
function getPosLeft(i,j){
	return cellspace + j *(cellspace+cellside);
}

$(document).ready(function(){
	prepare();
	newgame();
});
function newgame(){
	init();

};

function prepare(){
	if (documentWidth>500) {
		grid = 500*0.9;
		cellspace = 20*0.9;
		cellside = 100*0.9;
	}
	$('#grid-container').css('width',grid-2*cellspace);
	$('#grid-container').css('height',grid-2*cellspace);
	$('#grid-container').css('padding',cellspace);
	$('#grid-container').css('border-radius',0.02*grid);

	$('.grid-cell').css('width',cellside);
	$('.grid-cell').css('height',cellside);
	$('.grid-cell').css('border-radius',0.02*cellside);
}

function init() {
	for(var i = 0; i < 4; i++){
		for(var j = 0; j < 4; j++){

			var grid = $("#grid-cell-"+i+j);
			grid.css('top',getPosTop(i,j));
			grid.css('left',getPosLeft(i,j));
		}
	}
	for(var i = 0;i <4; i++){
		board[i] = new Array();
		iscompleted[i] = new Array();

		for(var j = 0; j <4; j++){
			board[i][j] = 0;

			iscompleted[i][j] = false;
		}
	}

	createone();
	createone();

	setTimeout("updateBoardView()",100);
};

function updateBoardView(){

	$('.number-cell').remove();
	for(var i = 0; i < 4; i++){
		for(var j = 0; j < 4; j++){
			$('#grid-container').append('<div class ="number-cell" id ="number-cell'+i+j+'"></div>');
			var theCell = $("#number-cell"+i+j);

			if(board[i][j] == 0){
				theCell.css("width","0px");
				theCell.css('height',"0px");
				theCell.css('top',getPosTop(i,j)+cellside/2);
				theCell.css('left',getPosLeft(i,j)+cellside/2)
			}else{
				theCell.css('width',cellside);
				theCell.css('height',cellside);
				theCell.css('top',getPosTop(i,j));
				theCell.css('left',getPosLeft(i,j));
				theCell.css('background-color',getBGColor(board[i][j]));
				theCell.css('color',getColor(board[i][j]));
				theCell.text(board[i][j]);
			}

			iscompleted[i][j] = false;
		}
	}
	$('.number-cell').css("line-height",cellside+"px");
	$('.number-cell').css("font-size",0.6*cellside+"px");

}			

function getBGColor(num){
	switch(num){
		case 2:return "#eee4da"; break;
		case 4:return "#ede0c8"; break;
		case 8:return "#f2b179"; break;
		case 16:return "#f59563"; break;	
		case 32:return "#f67c5f"; break;	
		case 64:return "#f65e3b"; break;
		case 128:return "#edcf72"; break;
		case 256:return "#edcc61"; break;	
		case 512:return "#9c0"; break;	
		case 1024:return "#33b5e5"; break;	
		case 2048:return "#09c"; break;
		case 4096:return "#a6c"; break;
		case 8192:return "#93c"; break;
	}
	return "black";
}
function getColor(num){
	if (num < 6)
		return'#776e65';
	return "white";
}
function createone(){
	if(nospace(board))
		return false;
	var randx = parseInt(Math.floor(Math.random() * 4));
	var randy = parseInt(Math.floor(Math.random() * 4));

	while(true){
		if(board[randx][randy] == 0)
			break;
		var randx = parseInt(Math.floor(Math.random() * 4));
		var randy = parseInt(Math.floor(Math.random() * 4));
	}

	var randnum = Math.random() < 0.5 ? 2 : 4;

	board[randx][randy] = randnum;
	showNumFromNothing(randx,randy,randnum);

	return true;
}
function nospace(board){
	for(var i = 0; i < 4; i++){
		for(var j = 0; j < 4; j++){
			if (board[i][j] == 0)
				return false;
		}
	}
	return true;
}

function showNumFromNothing(i,j,randnum){
	var num = $('#number-cell'+i+j);

	num.css('background-color',getBGColor(randnum));
	num.css('color',getColor(randnum));
	num.text(randnum);

	num.animate({
		width: cellside,
		height: cellside,
		top:getPosTop(i,j),
		left:getPosLeft(i,j)
	},180);
}

$(document).keydown(function(event){
	event.preventDefault();
	switch( event.keyCode ){
		case 37: //left
		if (moveLeft()) {
			moveLeft();
			moveLeft();
			setTimeout("updateBoardView()",200);
			setTimeout("createone()",260);

			
			isover();
		}
			break;
		case 38: //up
		if (moveUp()) {
			moveUp();
			moveUp();
			setTimeout("updateBoardView()",200);
			setTimeout("createone()",260);

			isover();
		}
			break;
		case 39: //right
		if(moveRight()){
			moveRight();
			moveRight();
			setTimeout("updateBoardView()",200);
			setTimeout("createone()",260);

			isover();
		}
		break;
		case 40: //down
		if (moveDown()) {
			moveDown();
			moveDown();
			setTimeout("updateBoardView()",200);
			setTimeout("createone()",260);

			
			isover();
		}
			break;
		default:
			break;
	}
});

document.addEventListener('touchstart',function(event){
	startx = event.touches[0].pageX;
	starty = event.touches[0].pageY;
});
document.addEventListener('touchstart',function(event){
	event.preventDefault();
});
document.addEventListener('touchend',function(event){
	endx = event.changedTouches[0].pageX;
	endy = event.changedTouches[0].pageY;

	var deltax = endx - startx;
	var deltay = endy - starty;

	if(Math.abs(deltax)*0.8 >= Math.abs(deltay) && Math.abs(deltax)>documentWidth*0.15) {
		if(deltax > 0){
			//move right
			if(moveRight()){
				moveRight();
				moveRight();
				setTimeout("updateBoardView()",200);
				setTimeout("createone()",260);
			}

		}else{
			//move left
			if (moveLeft()) {
				moveLeft();
				moveLeft();
				setTimeout("updateBoardView()",200);
				setTimeout("createone()",260);
			}
		}
	}

	if (Math.abs(deltay)*0.8 >= Math.abs(deltax) && Math.abs(deltay)>documentWidth*0.15) {
		if (deltay > 0 ) {
			//move down
			if (moveDown()) {
				moveDown();
				moveDown();
				setTimeout("updateBoardView()",200);
				setTimeout("createone()",260);
			}

		}else{
			//move up
			if (moveUp()) {
				moveUp();
				moveUp();
				setTimeout("updateBoardView()",200);
				setTimeout("createone()",260);
			}

		}
	}
});


function moveLeft(){
	if (canmoveLeft(board)) {
		for(var i = 0; i < 4; i++)
			for(var j = 0; j < 4; j++){
				if(board[i][j] != 0){

					for(var k= 0; k< j; k++){
						if (board[i][k] == 0 && noblock_hen(i,k,j,board) ) {
							//move
							showmove(i,j,i,k);
							board[i][k] = board[i][j];
							board[i][j] =0;
							continue;
						}else if (board[i][j]==board[i][k] && noblock_hen(i,k,j,board) && !iscompleted[i][k]) {
								//move and plus
								showmove(i,j,i,k);
								board[i][k] += board[i][j];
								board[i][j] =0;

								iscompleted[i][k] = true;


								continue;
							}
						}
					}
				}

	return true;
	}else{
		return false
	}
}
function noblock_hen(row,col1,col2,board){
    for(var i = col1 + 1;i <col2; i ++)
        if(board[row][i] != 0)
            return false;
    return true;
}

function canmoveLeft(board){
	for(var i = 0; i < 4; i++)
		for(var j = 0; j < 4; j++)
			if (board[i][j] != 0)
				if(board[i][j-1] == 0 || board[i][j] ==board[i][j-1])
					return true
	return false
}
function showmove(fromx,fromy,tox,toy){
    var num = $("#number-cell"+fromx+fromy);
        num.animate({
        top:getPosTop(tox,toy),
        left:getPosLeft(tox,toy)
    },180);
}
function moveRight(){
	if (canmoveRight(board)) {
		for(var i = 0; i < 4; i++)
			for(var j = 0; j < 4; j++){
				if(board[i][j] != 0){

					for(var k= 3; k>j; k--){
						if (board[i][k] == 0 && noblock_hen(i,j,k,board) ) {
							//move
							showmove(i,j,i,k);
							board[i][k] = board[i][j];
							board[i][j] =0;
							continue;
						}else if (board[i][j]==board[i][k] && noblock_hen(i,j,k,board) &&!iscompleted[i][k]) {
								//move and plus
							showmove(i,j,i,k);
							board[i][k] += board[i][j];
							board[i][j] =0;
							iscompleted[i][k] = true;
							continue;
							}
						}
					}
				}

	return true;
	}else{
		return false;
	}
}
function canmoveRight(){
	for(var i = 0; i < 4; i++)
		for(var j = 0; j < 4; j++)
			if (board[i][j] != 0)
				if(board[i][j+1] ==0 || board[i][j] ==board[i][j+1])
					return true;
	return false;
}

function noblock_shu(first,last,j,board){
    for(var i = first + 1;i < last; i ++)
        if(board[i][j] != 0){
            return false;
        }
    return true;
}

function canmoveDown(board){
	for(var i = 0; i < 3; i++)
		for(var j = 0; j < 4; j++)
			if (board[i][j] != 0)
				if(board[i+1][j] == 0 || board[i][j] ==board[i+1][j]){
					return true;
				}

	return false;
}

function moveDown(){
	if (canmoveDown(board)) {
		for(var i = 0; i < 4; i++)
			for(var j = 0; j < 4; j++){
				if(board[i][j] != 0){

					for(var k = 3; k > i ; k --){
						if (board[k][j] ==0 && noblock_shu(i,k,j,board) ) {
							//move
							showmove(i,j,k,j);
							board[k][j] = board[i][j];
							board[i][j] =0;
							continue;
						}else if (board[k][j]==board[i][j] && noblock_shu(i,k,j,board) && ! iscompleted[k][j]) {
								//move and plus
								showmove(i,j,k,j);
								board[k][j] += board[i][j];
								board[i][j] =0;

								iscompleted[k][j] = true;
								continue;
							}
						}
					}
				}

	return true;
	}else{
		return false
	}
}
function moveUp(){
		if (canmoveUp(board)) {
		for(var i = 0; i < 4; i++)
			for(var j = 0; j < 4; j++){
				if(board[i][j] != 0){

					for(var k = 0; k < i ; k++){
						if (board[k][j] ==0 && noblock_shu(k,i,j,board) ) {
							//move
							showmove(i,j,k,j);
							board[k][j] = board[i][j];
							board[i][j] =0;
							continue;
						}else if (board[k][j]==board[i][j] && noblock_shu(k,i,j,board) && !iscompleted[k][j]) {
								//move and plus
								showmove(i,j,k,j);
								board[k][j] += board[i][j];
								board[i][j] =0;

								iscompleted[k][j] = true;
								continue;
							}
						}
					}
				}

	return true;
	}else{
		return false
	}
}
function canmoveUp(board){
	for(var i = 3; i > 0; i--)
		for(var j = 0; j < 4; j++)
			if (board[i][j] != 0)
				if(board[i-1][j] == 0 || board[i][j] ==board[i-1][j]){
					return true;
				}

	return false;
}
function isover(){
	if (!canmoveUp(board) && !canmoveDown(board) && !canmoveRight(board) && !canmoveLeft(board)) {
		alert("game over")
	}
}
