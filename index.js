var config = require('config');
var readline = require('readline');

// initialization
var dot = config.get('duration');
var dash = dot*3;
var morseCode = config.get('morseCode');
console.log("dot duration: %dms, dash duration: %dms", dot, dash);

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

prompt();

function prompt(){
  rl.question("Enter a sentence: ", function(sentence) {
      var signals = convert(sentence);
      console.log(signals);
      prompt();
  });
}

function convert(text){
  var signals = "";
  for(var i=0; i<text.length; i++) {
    var signal = morseCode[text.charAt(i).toLowerCase()];
    if (signal != undefined) {
      signals+=signal;
    }
  }
  return signals;
}
