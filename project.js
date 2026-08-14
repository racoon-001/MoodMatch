let userScore = 0;
let compScore = 0;

const choices = document.querySelectorAll(".choice");
const msg= document.querySelector("#msg");
const userScorePara = document.querySelector("#user-score");
const compScorePara = document.querySelector("#comp-score");

const genCompChoice = () => {

    const options = ["rock", "paper", "scissors"];
    const randIdx = Math.floor(Math.random() * 3);
    return options[randIdx];
    
}

const drawGame = () => {
    msg.innerText = "It's a draw!";
    msg.style.backgroundColor = "#0b0c1a";
}
const showWinner = (userWin, userChoice, compChoice) => {
    if(userWin){
userScore++;
userScorePara.innerText = userScore;
        msg.innerText = `You win!  Your ${userChoice} beats ${compChoice}`;
        msg.style.backgroundColor = "#2cbd70";
    }else {
        compScore++;
        compScorePara.innerText = compScore;
        msg.innerText = `You lose!  ${compChoice} beats  Your ${userChoice}`;
        msg.style.backgroundColor = "#fc1313";
    }
}

const playGame =(userChoice) => {
    console.log("user Choice =", userChoice);
const compChoice = genCompChoice();
console.log("comp Choice =", compChoice);


if(userChoice === compChoice) {
    drawGame();
}else{
    let userWin = true;
    if(userChoice ==="rock") {
        userWin = compChoice ==="paper" ? false : true;
    } else if (userChoice ==="paper") {
        userWin = compChoice ==="scissors" ? false : true;
    } else {
        userWin = compChoice ==="rock" ? false : true;
    }
    showWinner(userWin, userChoice, compChoice);
}
};




    choices.forEach((choice) => {
    console.log(choice);
    choice.addEventListener("click", () => {
        const userChoice = choice.getAttribute("id");
        console.log("choice was clicked");
        playGame(userChoice);
    } );
});