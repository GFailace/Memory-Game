/*
 * Create a list that holds all of your cards
 */

 /**
* @description Funções do Projeto de Jogo da Memória
* @param {string} title - Udacity - Jogo da Memória
* @param {string} author - Guilherme Failace
*/

let symbols = ['bicycle', 'bicycle', 'leaf', 'leaf', 'cube', 'cube', 'anchor', 'anchor', 'paper-plane-o', 'paper-plane-o', 'bolt', 'bolt', 'bomb', 'bomb', 'diamond', 'diamond'],
    $deck = $('.deck'),
		$scorePanel = $('#score-panel'),
		$moveNum = $('.moves'),
		$ratingStars = $('i'),
		restart = $('.restart'),
		timer,
		opened = [],
		match = 0,
		moves = 0,
		clicks = 0
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

//Função para iniciar o jogo
let ini = ()=> {
    let cards = shuffle(symbols);
    $deck.empty();
    match = 0;
    moves = 0;
    $moveNum.text('0');
    $ratingStars.removeClass('fa-star-o').addClass('fa-star');
      for (let i = 0; i < cards.length; i++) {
          $deck.append($('<li class="card"><i class="fa fa-' + cards[i] + '"></i></li>'))
      }
      addListener();
      $(".clock").text("0:00");
      
  }
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

//Função que adiciona o Listener de click em cada carta
let addListener = ()=> {
	$deck.find('.card:not(".match, .open")').bind('click' , function() {
		clicks++ ;
		clicks == 1 ? gTimer() :'';
	if($('.show').length > 1) { return true; };
		let $this = $(this), card = $this.context.innerHTML;
	if($this.hasClass('open')){ return true;};
	  $this.addClass('open show');
		opened.push(card);
	  if (opened.length > 1) {
	    if (card === opened[0]) {
	      $deck.find('.open').addClass('match animated infinite  rubberBand');
	      setTimeout(()=> {
	        $deck.find('.match').removeClass('open show animated infinite jello');
	      }, 800);
	      match++;
	    } else {
	      $deck.find('.open').addClass('notmatch animated infinite shake');
				setTimeout(()=> {
					$deck.find('.open').removeClass('animated infinite shake');
				}, 800 / 1.5);
	      setTimeout(()=> {
	        $deck.find('.open').removeClass('open show notmatch animated infinite shake');
	      }, 800);
	    }
	    opened = [];
			moves++;
			rating(moves);
			$moveNum.html(moves);
	  }
		if (match === 8) {
			rating(moves);
			let score = rating(moves).score;
			setTimeout(()=> {
				fim(moves, score);
			}, 500);
	  }	
	});
}

//Função que retorna a pontuação do jogador
let rating =(moves)=> {
	let score = 3;
	if(moves <= 16) {
		$ratingStars.eq(3).removeClass('fa-star').addClass('fa-star-o');
		score = 3;
	} else if (moves > 16 && moves <= 20) {
		$ratingStars.eq(2).removeClass('fa-star').addClass('fa-star-o');
		score = 2;
	} else if (moves > 20) {
		$ratingStars.eq(1).removeClass('fa-star').addClass('fa-star-o');
		score = 1;
	}
	return { score };
}

//Função para reiniciar o jogo
restart.bind('click', ()=> {
 			clicks = 0;
			clearInterval(timer);
			opened = []
      ini();
	})
	
//Função que gera o timer do jogo
let gTimer = () => {
	let start = new Date().getTime();
	timer = setInterval(() => {
		let n = new Date().getTime();
		let total = n - start;
		let min = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
		let seg = Math.floor((total % (1000 * 60)) / 1000);
	if (seg < 10) {
			seg = "0" + seg
		}
		let time = min + ':' + seg;
		$(".clock").text(time);
	}, 750);
}
//Função para terminar o jogo
let fim = (moves, score) => {
	let msg = score == 1 ? score + ' estrela' :score +' estrelas';
	clearTimeout(timer)
	let t = $('.time').text()
	swal({
		allowEscapeKey: false,
		allowOutsideClick: false,
		title: 'Parabéns, você venceu!',
		text: 'com ' + moves + ' movimentos e ' + msg + '\n Woooooow!\n' + t,
		type: 'success',
		confirmButtonColor: '#02ccba',
		confirmButtonText: 'Jogar de novo!'
	}).then((isConfirm)=> {
		if (isConfirm) {
			clicks = 0;
			clearInterval(timer);
			ini();
		}
	})
}
//Iniciar o jogo
ini();