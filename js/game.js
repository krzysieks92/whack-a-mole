//zmienne
var game = document.querySelector('.game');
var modalAll = document.querySelectorAll('.modal');
var modal = document.querySelector('.modal-content');
var modalTwo = document.querySelector('.modal-content-two');
var modalResults = document.querySelector('.modal-content-results');
var btnNG = document.querySelector('.new-game');
var btnNGR = document.querySelector('.new-game-results');
var exit = document.querySelectorAll('.exit');
var btnMore = document.querySelector('.more');
var result = document.querySelector('.result');
var score = 0;
var scoreBoard = document.querySelector('.score');
var playerName = document.querySelector('.player-name');
var btnStart = document.querySelector('.start');
var scoreBoard = document.querySelector('.score');
var game = document.querySelector('.game');
var holes = document.querySelectorAll('.hole');
var moles = document.querySelectorAll('.mole');
var lastHole;
var timeUp = false;
var usersArray =[];

//funkcje

//rozpoczyna gre
function startGame(){
	game.style.display = "flex";
	scoreBoard.textContent = 0;//zeruje tablice wynikow
	score = 0;
	result.textContent = 0;
	timeUp = false;
	peep();
	setTimeout(() => {
		timeUp = true;
		if(timeUp === true){
			game.style.display = "none";	
			modalTwo.style.display = "block";
		}
	}, 10000);//po uplywie 10s znika okno gry pojawia sie okienko modal z wynikiem
}	

//pojawianie sie i znikanie moli w przedziale 200ms - 1000ms
function peep (){
	var time = randomTime(200, 1000);
	var hole = randomHole(holes);
	hole.classList.add('up');

	setTimeout(() => {
		hole.classList.remove('up');
		if(!timeUp) peep();	
		}, time);
}

//losowy czas w okreslonym przedziale
function randomTime(min, max){
	return Math.round(Math.random()*(max-min) + min);
}

//pojawianie sie moli w losowej dziurze
function randomHole(holes){
	var idx = Math.floor(Math.random()*holes.length);
	var hole = holes[idx];
	if(hole === lastHole){
		return randomHole(holes);	
	}
	lastHole = hole;
	return hole;	
}

//gdy klikniemy na mola powoduje odtwarzanie dzwieku, dodanie wyniku oraz usuniecie klasy up
function bonk(e){
	if(!e.isTrusted) return;
	score++;
	this.classList.remove('up');
	document.querySelector('.whack-sound').play();
	result.textContent = scoreBoard.textContent = score;
}

//powoduje ze po wczytaniu strony od nowa i zapisaniu gry mamy aktualna liste wynikow
function init(){
	if(localStorage.usersRecord){
		usersArray = JSON.parse(localStorage.usersRecord);
		for(var i=0; i<usersArray.length; i++){
			prepareTable(usersArray[i].name, usersArray[i].score); 
		}
	}
}

//zapisuje wynik gry do localStorage
function saveOnClick(){
	var firstNameVal = playerName.value;
	var scoreVal = score;
	
	var usersObj = {name: firstNameVal, score: scoreVal};
	
	var sort = usersArray.sort(function(a, b){
		if(a.score < b.score)
			return 1;
		else
			return -1;
	});
	
	sort.push(usersObj);

	localStorage.usersRecord = JSON.stringify(sort);
	
	prepareTable(firstNameVal, scoreVal);
}

//tworzy tabele dodajac nowe komorki z imieniem gracza i jego wynikiem
function prepareTable(firstNameVal, scoreVal){
	var table = document.querySelector('.results-table');
	var row = table.insertRow();
	var firstNameCell = row.insertCell(0);
	var scoreCell = row.insertCell(1);
	
	firstNameCell.innerHTML = firstNameVal;
	scoreCell.innerHTML = scoreVal;
}

//znikniecie okna z uzyskanym wynikiem i pojawienie sie okna ze wszystkimi wynikami gry
function resultsDisplay(){
	modalTwo.style.display = "none";
	modalResults.style.display = "block";
}


//zdarzenia

//przycisk rozpocznij gre, nacisniecie powoduje odtwarzanie dzwieku, pojawienie sie okienka do wpisania imienia oraz znikniecie przycisku rozpocznij gre
btnNG.onclick = function(){
	document.querySelector('.fanfares-sound').play();//odtwarzanie dzwieku
	setTimeout(() => {
		modal.style.display = "block";
		this.style.display = "none";
	}, 400);	//utawienie czasu 400ms, po ktorym pojawia sie okno modal i znika przycisk rozpocznij gre
}

//przycisk exit - wyjdz z gry, powodujacy zamkniecie sie okienek modal i powrot do strony startowej
exit.forEach(exit => exit.onclick = function(){
	modalAll.forEach(modal => modal.style.display = "none");
	btnNG.style.display = "block";
	document.querySelector('.type').innerHTML = '';
	scoreBoard.style.display = "none";
})

//przycisk nowa gra, rozpoczyna nowa gre po zapisaniu wynikow
btnNGR.onclick = function (){
	modalResults.style.display = "none";
	startGame();
}

//przycisk start, rozpoczyna gre po wpisaniu swojego imienia
btnStart.onclick = function(){
	modal.style.display = "none";
	btnNG.style.display = "none";
	scoreBoard.style.display = "inline-block";
	game.style.display = "flex";
	startGame();
}

//przycisk jeszcze raz, nowa gra bez zapisania wynikow
btnMore.onclick = function(){
	modalTwo.style.display = "none";
	startGame();
}

//wpisywanie imienia do pola input
playerName.onkeyup = function(){
	document.querySelector('.type').innerHTML = playerName.value;
}

//po kliknieciu na mola inicjuje funcke bonk
moles.forEach(mole => mole.addEventListener('click', bonk));






