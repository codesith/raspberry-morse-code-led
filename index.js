var config = require('config');
var readline = require('readline');
var sleep = require('sleep');

// initialization
var unit = config.get('unitMilliSeconds')*1000; // convert from millisecond to microsecond
var morseCode = config.get('morseCode');
var pin = config.get('pin');
var consoleOnly = config.get('consoleOnly'); // use this to debug without actually LED

var led = null;
if (!consoleOnly) {
  Gpio = require('onoff').Gpio,
    led = new Gpio(17, 'out');
  led.writeSync(0);
}

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

prompt();

function prompt() {
  rl.question("Enter a sentence: ", function(sentence) {
      var signals = convertToSignals(sentence);
      for (var i=0; i<signals.length; i++) {
        flash(signals[i]);
      }
      console.log("");
      prompt();
  });
}

function convertToSignals(text) {
  var signals = "";
  for(var i=0; i<text.length; i++) {
    // convert all characters to lower case
    var signal = morseCode[text.charAt(i).toLowerCase()];
    // only output singals that are defined by International Morse Code Standard
    // The only exception is "space" character
    if (signal != undefined) {
      signals+=signal;
    }
    if (i != text.length-1) {
      signals+='___';
    }
  }
  return signals;
}

function flash(signal) {
  if (!(signal == '.' || signal == '-' ||  signal == '_')) {
    return;
  }

  delay = unit;
  if (signal == '-') {
    delay = unit * 3;
  }
  process.stdout.write(signal);
  if (consoleOnly) {
    sleep.usleep(delay);
  }
  else {
    if (signal == '_') {
        sleep.usleep(delay);
    } else {
        led.writeSync(1);
        sleep.usleep(delay)
        led.writeSync(0);
    }
  }
}
