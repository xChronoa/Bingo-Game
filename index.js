// Constant variables for getting the document tags.
const DIV_START_CONTAINER = document.querySelector('.start-container');
const INPUT_CARD_AMOUNT = document.querySelector('#inputCards');
const DIV_TABLE_CONTAINER = document.querySelector('.table-container');
const BTN_CONTAINER = document.querySelector('.btn-container');
const BTN_GENERATE_CARDS = document.querySelector('#btnGenerateCards');
const BTN_DRAW_BALL = document.querySelector('#btnDrawBall');
const BTN_CLEAR = document.querySelector('#btnClear');
const BTN_PLAY_AGAIN = document.querySelector('#btnPlayAgain');
const P_DRAWN_BALL = document.querySelector('.pDrawnBall');
const DIV_WINNING_TABLE_CONTAINER = document.querySelector('.winning-table-container');
const DIV_WINNING_CARD_CONTAINER = document.querySelector('.winning-card-container')


/**
 * Adding key down events to the input tag with the id "inputCards"
 * Prevents user from inputting anything other than natural numbers on amount of bingo cards.
 */
INPUT_CARD_AMOUNT.addEventListener('beforeinput', (e) => {
    if (!(Number(e.data) >= 0 && Number(e.data) <= 9)) e.preventDefault();
});


// Addings click events to the buttons

/**
 * When the button generate cards is clicked it checks if the INPUT_CARD_AMOUNT's input field is empty or not.
 * Empty means the user is alerted to input amount of bingo cards.
 * If not then it calls the function generateCards.
 */
BTN_GENERATE_CARDS.addEventListener('click', () => { 
    (INPUT_CARD_AMOUNT.value !== "" && INPUT_CARD_AMOUNT.value > 0 ? generateCards() : alert("Please input amount of bingo cards!"))
});

/**
 * When the button draw ball is clicked it calls the method of the object ball draw.
 * This will also mark the card slot of a bingo card should the draw ball's number be equal to a card in the bingo card.
 * Then the drawn numbers are displayed in the INPUT_DRAWN_NUMBERS, which allows the user to read the existing numbers drawn.
 */
BTN_DRAW_BALL.addEventListener('click', () => {
    objBallDraw.drawBall();

    // Displays the currently drawn ball
    P_DRAWN_BALL.innerHTML = objBallDraw.ballDrawns[objBallDraw.ballDrawns.length-1];

	// Checks each table for existing winning line for every drawn ball.
	checkWinningLines();
});

/**
 * When the user clicks the button clear it asks confirmation from the user if they want to reset the page.
 * This will allow the user to create a new game, and input new amount of bingo cards.
 */
BTN_CLEAR.addEventListener('click', () => {
    let confirmClear = confirm("Are you sure you want to reset?")
    if(!confirmClear) return;
    
    resetBingo();
});

BTN_PLAY_AGAIN.addEventListener('click', () => {
    resetBingo();
});

let bingoCards = [];

/**
 * Function for generating the amount of bingo cards inputted by the user.
 * The generate cards is only used once every new game of the bingo card.
 * The created bingo cards are pushed into the bingoCards array, this is for allowing the creation of multiple bingo cards.
 */
function generateCards() {
    if(bingoCards.length < 1) {
        for(let i = 0; i < INPUT_CARD_AMOUNT.value; i++) {
            bingoCards.push(new BingoCard());
        }
        
        // Cycles through each individual bingo cards objects that are created.
        // Then generates their own matrix and draws the card.
        bingoCards.forEach( (element) => {
            element.generateMatrix();
            DIV_TABLE_CONTAINER.innerHTML += element.drawCard();
        });

        INPUT_CARD_AMOUNT.disabled = true;
        BTN_GENERATE_CARDS.disabled = true;
        BTN_DRAW_BALL.disabled = false;
    }

    // Creates an object of ball draw when the user generates new bingo cards.
    objBallDraw = new BallDraw();

    DIV_START_CONTAINER.classList.add("hidden");
    DIV_TABLE_CONTAINER.classList.remove("hidden");
    BTN_CONTAINER.classList.remove("hidden");
}

// For resetting the bingo card game. Creates a new game.
function resetBingo() {
    bingoCards = [];
    DIV_START_CONTAINER.classList.remove("hidden");
    DIV_TABLE_CONTAINER.innerHTML = "";
    DIV_TABLE_CONTAINER.classList.add("hidden");
    P_DRAWN_BALL.innerHTML = "0";
    BTN_CONTAINER.classList.add("hidden");
    DIV_WINNING_TABLE_CONTAINER.classList.add("hidden");
    DIV_WINNING_CARD_CONTAINER.innerHTML = "";
    INPUT_CARD_AMOUNT.value = "";
    INPUT_CARD_AMOUNT.disabled = false;
    BTN_GENERATE_CARDS.disabled = false;
    BTN_DRAW_BALL.disabled = true;
}

// Function Checking the Winning Lines from a Table
// When a winning line is identified, the table containing the winning line is then displayed in the page.
function checkWinningLines() {
	// Get all the table
    const tables = document.querySelectorAll('.card');

    // Array for storing all the cells in each tr with class name "row" from each table.
    // Table > Card (Bingo Slots) Cells
    // Creates a 1D array and stores 1D arrays. 
    // Array -> [
    //   0 [ Table -> 0 [Cells] ], 
    //   1 [ Table -> 0 [Cells] ], 
    //   2 [ Table -> 0 [Cells] ]
    // ]
    const cellsArray = [];
    
    // This forEach loop is used for getting all the existing tables displayed and to be stored in the cellsArray.
    // Cycle through each individual tables.
    tables.forEach((table, index) => {
        
        // Select all table rows with class name "row" from each individual table
        const rows = table.querySelectorAll('.row');
        
        const rowsList = [];
        // Stores all the cells in the table that contains the bingo numbers in a 1D array.
        
        // Cycle through each row of the table
        for (let i = 0; i < rows.length; i++) {
            
            // Selects all the cells in each row.
            const tds = rows[i].querySelectorAll('td'); // select all td elements in each row
            const tdList = [];

            // Cycles through each cells in the row
            for (let j = 0; j < tds.length; j++) {
                // Push the cells into tdList (1D Array).
                tdList.push(tds[j]); // store the text content of each td element
            }
            rowsList.push(tdList);
        }

        // Stores the cells of each individual tables. Tables are divided into indexes.
        cellsArray[index] = rowsList; 
    });

    // Check for each row if it is active or in simpler terms checks cells horizontally
    const tableRowWin = [];
    cellsArray.forEach( (table, tableIndex) => {

        // Cycles through each existing table.
        table.forEach( (tableRow) => {

            let lineCount = 0;
            
            // Cycles through each table rows
            tableRow.forEach( (rowCell) => {

                // Checks each row cells horizontally if it contains class name "active"
                if(rowCell.classList.contains("active")) lineCount++;
                
                if(lineCount === table.length) {
                    tableRowWin.push(cellsArray[tableIndex]);
                    return;
                }
            })
        })
    });

    // Check for each single rows of columns if it is active or in simpler terms checks cells vertically.
    const tableColumnWin = [];
    cellsArray.forEach((table) => {

        // Cycles through each existing table
        for (let i = 0; i < table.length; i++) {

          let lineCount = 0;

          // Cycles through each individual rows of columns from the table
          for (let j = 0; j < table.length; j++) {
            if (table[j][i].classList.contains("active")) lineCount++;

            if (lineCount === table.length) {
              tableColumnWin.push(table);
              break;
            }
          }
        }
    });
    
    //Top-Left to Bottom-Right
    //Variable name is as follows "Table Diagonal Top-Left Bottom-Right Win"
    const tableDiagonalTLBRWin = [];
    cellsArray.forEach( (table, tableIndex) => {

        let lineCount = 0;

        // Cycles through each existing table
        table.forEach( (tableRow, rowIndex) => {

            // Checks through each cell diagonally top-left to bottom-right
            if(tableRow[rowIndex].classList.contains("active")) lineCount++;
            
            if(lineCount === table.length) {
                tableDiagonalTLBRWin.push(cellsArray[tableIndex]);
                return;
            }
        })
    });
    
    //Top-Right to Bottom-Left
    //Variable name is as follows "Table Diagonal Top-Right Bottom-Left Win"
    const tableDiagonalTRBLWin = [];
    cellsArray.forEach((table, tableIndex) => {

        let lineCount = 0;

        // Cycles through each existing table 
        table.forEach((tableRow, rowIndex) => {
            const cellIndex = table.length - 1 - rowIndex; 

            // Checks through each cell diagonally top-right to bottom-left
            if (tableRow[cellIndex].classList.contains("active")) lineCount++;

            if (lineCount === table.length) {
                tableDiagonalTRBLWin.push(cellsArray[tableIndex]);
                return;
            }
        });
    });

    // Stores the arrays that contains the tables with winning lines from column, row, and diagonally.
    const winningLines = [tableRowWin, tableColumnWin, tableDiagonalTLBRWin, tableDiagonalTRBLWin];

    // Checks each of the arrays in the winningLines if its length is greater than 0
    // This is used for determining if there is a winning table.
    const winningTable = winningLines.filter( (array) => array.length > 0);

    // Stores the code for the html tags that will display the winning tables.
    let winningCard = "";

    // Once a winning table is identified it proceeds to displaying them in the page.
    // A for loop is utilized should there be more than 1 table that contains a winning line.
    if(winningTable.length > 0) {
        // Cycles through each winning tables.
        winningTable.forEach( (tables, tableIndex) => {
            
            // Cycles through the winning table.
            tables.forEach( (table) => {
                winningCard += `<table class="card">`;
                winningCard += `<tr class="bingo-header">
                        <td>B</td>
                        <td>I</td>
                        <td>N</td>
                        <td>G</td>
                        <td>O</td>
                        </tr>`;

                // Cycles through each row of the table.
                table.forEach( (tableRow) => {
                    winningCard += `<tr class="row">`;
    
                    // Cycles through each individual cells in each row of the table.
                    tableRow.forEach( (cellData) => {
                        winningCard += cellData.outerHTML;
                    });
    
                    winningCard += `</tr>`;
                })
                winningCard += `</table>`;
            });
        });

        DIV_TABLE_CONTAINER.classList.add("hidden");
        BTN_CONTAINER.classList.add("hidden");
        DIV_WINNING_TABLE_CONTAINER.classList.remove("hidden");
        
    }
    DIV_WINNING_CARD_CONTAINER.innerHTML += winningCard;
}