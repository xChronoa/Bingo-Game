class BallDraw {
    // Creates ballDrawns property that is empty by default on object creation.
    constructor() {
        this.ballDrawns = [];
    }
    
    // Method for generating a number from 1-75
    drawBall() {
        let randomNumber;

        if(this.ballDrawns.length === 75) {
            alert("All numbers are drawn!");
            return;
        }
        // This do while loop is used for generating a number from 1-75 that is currently not included in the ballDrawns property.
        do {
            randomNumber = Math.floor(Math.random() * (75 - 1 + 1)) + 1;
        } while (this.ballDrawns.includes(randomNumber));

        /**
         * Unique generated number is then pushed into the ballDrawns property.
         * The method markCard is also then promptly executed to ensure that each time draw ball is called
         * It will mark the slots in the Bingo Card that corresponds to the unique number that is generated. 
         */        
        this.ballDrawns.push(randomNumber);
        this.markCard();
    }

    // Method for marking the table data that corresponds to the newly generated unique number from drawBall.
    markCard() {
        // Takes all the table data that has the parent class row
        const cardRow = document.querySelectorAll('.row td');
        
        // Cycles through each individual columns from the card row.
        cardRow.forEach( (item) => {

            // Adds a class name "active" to the card that corresponds to the unique number.
            if(item.innerHTML == this.ballDrawns[this.ballDrawns.length-1]){
                item.classList.add("active");
            }

        })
    }
}