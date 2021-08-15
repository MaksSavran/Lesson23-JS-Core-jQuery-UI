$(document).ready(function () {
    const defaultModalMessage = "You still have time, you sure? ";
    const loseModalMessage = "It's a pity, but you lost";
    const winModalMessage = "Woohoo, well done, you did it!";

    let timerInterval;
    let timerDurationInSecods = 60;
    let solvingResult = true;
    let gameStarted = false;

    makeGrid();
    addDrugDrop();
    shufflePuzzlePieces();

    $('#start').on('click', startGame);
    $('#checkResult').on('click', () => showModalWindow());
    $('#reset').on('click', resetGame);
    $('#close').on('click', hideModalWindow);
    $('#check').on('click', checkSolvingResult);


    function shufflePuzzlePieces() {
        var parent = $("#startPuzzle");
        var divs = parent.children();
        while (divs.length) {
            parent.append(divs.splice(Math.floor(Math.random() * divs.length), 1)[0]);
        }
    };
    function makeGrid() {
        let pieceId = 0;
        for (let i = 0, top = 0; i < 4; i++, top -= 100) {
            for (let j = 0, left = 0; j < 4; j++, left -= 100) {

                let puzzleGrid = $(document.createElement('div'));
                puzzleGrid.addClass('puzzleGrid').attr('data-id', pieceId);
                $('#finishPuzzle').append(puzzleGrid);

                let pieceGrid = $(document.createElement('div'));
                pieceGrid.addClass('pieceGrid').appendTo('#startPuzzle');

                let puzzePiece = $(document.createElement('div'));
                puzzePiece.addClass('puzzlePiece').attr('data-id', pieceId).css({
                    backgroundPosition: `${left}px ${top}px`
                });
                pieceGrid.append(puzzePiece);
                pieceId++;
            }
        }
    }
    function addDrugDrop() {
        $('.puzzlePiece').draggable({
            revert: true
        });
        $('.puzzleGrid').droppable({
            over: startGame,
            drop: function (event, ui) {
                let draggableElement = ui.draggable;
                let droppedPlace = $(this);

                droppedPlace.addClass('placedPiece');
                $(draggableElement).addClass('droppedPiece').css({
                    top: 0, 
                    left: 0,
                    position: 'relative'
                }).appendTo(droppedPlace);
            }
        });
    }
    function startTimer(duration) {
        let timer = duration;
        timerInterval = setInterval(function () {
            let minutes = parseInt(timer / 60, 10);
            let seconds = parseInt(timer % 60, 10);
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            $('.timer').text(minutes + ":" + seconds);
            $('.modalMessage').text(defaultModalMessage + minutes + ":" + seconds);

            if (timer < 1) {
                checkSolvingResult();
            } else {
                timer--;
            }
        }, 1000);
    }
    function startGame() {
        if (!gameStarted) {
            gameStarted = true;
            startTimer(timerDurationInSecods);
            $('#start').prop('disabled', true);
            $('#checkResult').prop('disabled', false);
        }
    }
    function showModalWindow(handler) {
        $('#modalWindow').slideDown(500);
        $('.darkBackground').fadeIn(500);
        if (handler) {
            $('.modalMessage').text(winModalMessage);
            $('#checkResult').prop('disabled', true);
            $('#check').hide();
        } else if (handler !== undefined) {
            $('.modalMessage').text(loseModalMessage);
            $('#checkResult').prop('disabled', true);
            $('#check').hide();
        }
    }
    function hideModalWindow() {
        $('#modalWindow').slideUp(500);
        $('.darkBackground').fadeOut(500);
    }

    function resetGame() {
        gameStarted = false;
        clearInterval(timerInterval);
        $('.timer').text('01:00');
        $('#startPuzzle').html('');
        $('#finishPuzzle').html('');
        makeGrid();
        addDrugDrop();
        shufflePuzzlePieces();
        $('#start').prop('disabled', false);
        $('#checkResult').prop('disabled', true);
        $('#check').show();
    }
    function checkSolvingResult() {
        clearInterval(timerInterval);
        $('.puzzleGrid').each(function () {
            let gridId = $(this).attr('data-id');
            let pieceId = $(this).children().attr('data-id');
            
            if (gridId != pieceId) {
                solvingResult = false;
                return
            }
        });
        showModalWindow(solvingResult);
    }

})