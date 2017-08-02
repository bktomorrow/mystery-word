const express = require('express');
const app = express();

const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const fs = require('fs');
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");



app.engine('mst', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mst')

app.use(express.static('public'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.use(expressValidator())


let index = Math.round(Math.random()*words.length);
let word = words[index];

console.log(words[index]);

let wordArr = [];
for (var i = 0; i < word.length; i++) {
  wordArr.push("_ ");
}
let guessedLetters = [];
let guesses = 8;
let err = "";
let won = "YOU LOST";

app.get("/", function (req, res) {
  res.render('index', { wordArr: wordArr, guessedLetters: guessedLetters, guesses: guesses, err: err});
});
app.get('/endGame', (req, res) => {
  res.render('endGame', {word: word, guesses: guesses, won: won})
})

app.post("/", function (req, res) {

  if(req.body.newGuess.length === 1){
    err = "";
    let guess = req.body.newGuess.toLowerCase();


    if (word.includes((guess))) {

        let count = false;
        for (var i = 0; i < wordArr.length; i++) {
          if(word.charAt(i) === guess){
            if(wordArr[i] === guess){

            }
            else{

              while (!count) {
                guessedLetters.push(req.body.newGuess);
                count = true;
              }
              wordArr[i] = guess;
            }
          }
        }

        let counter = 0;
        for (var i = 0; i < wordArr.length; i++) {
          if(wordArr[i] === word.charAt(i)){
            counter++;
          }
        }

        if(counter === wordArr.length){
          won = "YOU WON";
          res.redirect('/endGame')
        }
        else{
          res.redirect('/');
        }

    }
    else{
      let alreadyGuessed = false;
      for (var i = 0; i < guessedLetters.length; i++) {
        if(guessedLetters[i] === guess){
          alreadyGuessed = true;
        }
      }

      if(alreadyGuessed === false){
        guesses = guesses-1;
        guessedLetters.push(req.body.newGuess);
      }

      else {
        err = "You have already guessed that letter"
      }

      if(guesses === 0){
        won = "YOU LOST";
        res.redirect('/endGame')
      }

      else{
        res.redirect('/');
      }
    }
  }

  else{
    err = "Please enter a one letter vaild submission";
    res.redirect('/');
  }
});

app.post("/endGame", function (req, res){
  if(req.body.replay === 'y' || req.body.replay === 'yes'){
    console.log(words[index]);

    index = Math.round(Math.random()*words.length);
    word = words[index];
    wordArr = [];
    for (var i = 0; i < word.length; i++) {
      wordArr.push("_ ");
    }
    guessedLetters = [];
    guesses = 8;
      res.redirect('/');
  }
  else{

  }

})

app.listen(3000, () => {
  console.log("port 3000");
});
