
var synth = window.speechSynthesis;
var utter = new SpeechSynthesisUtterance();

var textAreaField = document.getElementById('txtVoice');

var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
var voicesList = [];

let msg = document.querySelector('div');
msg.setAttribute('class', 'msg');
msg.style.display = 'none';
let selectVoice = document.getElementsByClassName('voiceList')[0];
let datalist = document.getElementById('language');
let stop = document.getElementById('stop');
let pause = document.getElementById('pause');
let play = document.getElementById('play');

let speedEle = document.getElementById('pitch');
let rateEle = document.getElementById('rate');

var btnText1 = document.getElementById('btntxt1');
var btnText2 = document.getElementById('btntxt2');

var btnVoice1 = document.getElementById('btnvoice1');
var btnVoice2 = document.getElementById('btnvoice2');

var inp = document.getElementById('textID');

selectVoice.addEventListener('input', (e) => {
  utter.voice = voicesList[e.target.value] || voicesList[0];
  recognition.lang = voicesList[e.target.value].lang || voicesList[0].lang;
})

msg.addEventListener('animationend', () => {
  msg.style.display = 'none';
});

function isRunning(status) {
  switch (status) {
    case 'textOn':
      console.log(status)
      msg.style.display = 'block';
      btnText1.style.pointerEvents = 'none';
      btnVoice1.style.pointerEvents = 'none';
      msg.innerText = "Text to Speech is On";
      break;
    case 'textOff':
      console.log(status)
      msg.style.display = 'block';
      btnText1.style.pointerEvents = 'auto';
      btnVoice1.style.pointerEvents = 'auto';
      msg.innerText = "Text to Speech is Off";
      break;
    case 'voiceOn':
      console.log(status)
      msg.style.display = 'block';
      btnText1.style.pointerEvents = 'none';
      btnVoice1.style.pointerEvents = 'none';
      msg.innerText = "Voice Recognition is On";
      break;
    case 'voiceOff':
      console.log(status)
      msg.style.display = 'block';
      btnText1.style.pointerEvents = 'auto';
      btnVoice1.style.pointerEvents = 'auto';
      msg.innerText = "Voice Recognition is Off";
      break;
    default:
      msg.innerText = "";
      btnText1.style.pointerEvents = 'auto';
      btnVoice1.style.pointerEvents = 'auto';
      break;
  }
}



stop.addEventListener('click', () => {
  synth.cancel();
  play.style.display = 'inline';
  pause.style.display = 'none';
  btnText1.style.display = 'inline';
  btnText2.style.display = 'none';
})

function funBtns(e) {
  if (e == 'pause') {
    synth.pause();
    play.style.display = 'inline';
    pause.style.display = 'none';
  } else {
    synth.resume();
    play.style.display = 'none';
    pause.style.display = 'inline';
  }
}

//Voice to Text
if (!recognition) {
  alert('not working speech API')
}
else {
  recognition.continuous = false; // Stop automatically after a phrase
  recognition.interimResults = true; // Get partial results as user speaks
}
recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  textAreaField.textContent = "You said: " + transcript;
};

recognition.onerror = (err) => {
  console.error("Speech recognition error:", err.error);
};

function toggleVoice(e) {
  if (e == 'on') {
    isRunning('voiceOn');
    recognition.start();
    textAreaField.innerText = "Listing...!!"
  }
  else {
    isRunning('voiceOff');
    recognition.stop();
    textAreaField.innerText += "\nStopped Listening."
  }
  e == 'on' ? btnVoice2.style.display = 'inline' : btnVoice2.style.display = 'none';
  e == 'on' ? btnVoice1.style.display = 'none' : btnVoice1.style.display = 'inline';

}

//Text to Voice

synth.onvoiceschanged = () => {
  voicesList = synth.getVoices();

  for (let obj in voicesList) {
    let options = document.createElement('option');
    options.value = obj;
    options.innerText = `${voicesList[obj].name}`;
    datalist.appendChild(options);
console.log(options);
  }


  utter.pitch = speedEle.value < 0 ? 1 : Number(speedEle.value);
  utter.rate = rateEle.value < 0 ? 1 : Number(rateEle.value);
  synth.speak(utter);
  play.style.display = 'none';
  pause.style.display = 'inline';
};

function toggleText(e) {
  if (e == 'on') {
    isRunning('textOn');
    utter.text = inp.value;
    synth.speak(utter);
    btnText2.style.display = 'inline';
    btnText1.style.display = 'none';
    pause.style.display = 'inline';
    play.style.display = 'none';
    utter.onend = function () {
      // We call the 'off' logic to clean up the UI and re-enable the Voice button.
      // We use 'off' here because it's the simplest way to run the cleanup logic.
      toggleText('off');
    };
  }
  else {
    synth.cancel();
    isRunning('textOff');
    btnText2.style.display = 'none';
    btnText1.style.display = 'inline';
    pause.style.display = 'none';
    play.style.display = 'inline';
  }

}

