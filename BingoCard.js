class BingoCard {
    // Creates a multidimensional array property named "matrix" that is empty by default on object creation.
    constructor() {
        this.matrix = [[]];
    }

    // Method for creating the unique numbers that corresponds to each column of the BINGO.
    generateMatrix() {
        // The random numbers are generated based on the current column being filled.
        /**
         * B - 1-15
         * I - 16-30
         * N - 31-45
         * G - 46-60
         * O - 61-75
         */

        // Creates a column for each row of the BINGO card.
        for(let col = 0; col < 5; col++) {
            let column = [];

            // Will repeat as long as the array column length is less than 5.
            // This will ensure that it will input 5 columns per row.
            // As well as make sure that each individual numbers are unique.
            while(column.length < 5) {
                let minLimit = col * 15 + 1;
                let maxLimit = (col + 1) * 15;
                let randomNumber = Math.floor(Math.random() * (maxLimit - minLimit + 1)) + minLimit;
                
                if(!column.includes(randomNumber)) column.push(randomNumber);
            }

            // The columns are then pushed into the row of the matrix.
            // Using matrix[col] as a way to increase the row size automatically and adding the values simulataneously 
            // The columns of the BINGO at this moment are oriented as Rows and Columns.
            this.matrix[col] = column;
        }

        // The center slot is marked as Free SLot.
        this.matrix[2][2] = "FREE";

        // For the first map the parameter column is not used, it is only for accessing the index parameter.
        // Reverses the columns and rows. Columns becomes the rows, rows becomes the columns vice-versa.
        this.matrix = this.matrix[0].map((column, i) => this.matrix.map(row => row[i]));
    }
    
    /**
     * Method for creating the bingo card that contains unique numbers that corresponds to the current object.
     * The tags that will be used for the webpage are stored in the variable td. 
     * After all the values in the matrix are fetched it is then added into the BINGO_CARD 
     * Or in tag/class name terms it is added to a div class named table-container. 
     * Thereby displaying the matrix in the webpage.
     */
    drawCard() {
        let td = "";
        td += `<table class="card">`;
        td += `<tr class="bingo-header">
                <td>B</td>
                <td>I</td>
                <td>N</td>
                <td>G</td>
                <td>O</td>
               </tr>`;

        // Cycles through each individual rows inside the matrix, the rows are seperated by the tr tag class named as row.
        this.matrix.forEach( (item) => {
            td += `<tr class="row">`;

            //Cycles through each individual columns inside the matrix's rows.
            item.forEach( (element) => {
                if(element === "FREE") {
                    td += `<td class="free active">${element}</td>`;  
                } else {
                    td += `<td class="">${element}</td>`;  
                }
            });
                
            td += "<tr>";
        });

        td += `</table>`;

        // Returns the fetched matrix data to be used when displaying into the div table-container.
        return td;
    }
}