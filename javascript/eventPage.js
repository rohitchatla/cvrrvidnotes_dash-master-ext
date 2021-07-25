const audioContext = new AudioContext();
const destination = audioContext.createMediaStreamDestination();
//const WatsonSpeech = require("./watson-speech.js");
{
  /* <script src="./watson-speech.js"></script>; */
}
let tabStream,
  micStream,
  tabAudio,
  micAudio,
  output,
  audioConfig,
  recognizer,
  text = "",
  score = 0,
  micable = true,
  paused = false,
  email,
  duration;

const constraints = {
  audio: true,
};

// const setupReader = (filee) => {
//   let reader = new FileReader();
//   reader.readAsDataURL(filee);
//   reader.onload = function () {
//     //console.log(reader.result);
//     setInitialImageBase64(reader.result);
//   };
//   reader.onerror = function (error) {
//     console.log("Error: ", error);
//   };
// };

{/* <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  console.log(e.target.files[0]);
                  setFile(e.target.files[0]);
                  setupReader(e.target.files[0]);
                }}
              /> */}


// azure speech configurations
// const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
//   "4bc1dcdc604e4e0bb10b90fd93696fc3 ",
//   "eastus"
// );
// speechConfig.speechRecognitionLanguage = "en-IN";
// speechConfig.outputFormat = 1;

// get tab audio
function getTabAudio() {
  chrome.tabCapture.capture(constraints, (_stream) => {
    // keep playing the audio in the background

    // const audio = new Audio();
    // audio.srcObject = _stream;
    // audio.play();

    // tabStream = _stream;
    // tabAudio = audioContext.createMediaStreamSource(tabStream);
    // tabAudio.connect(destination);

    // output = new MediaStream();
    // output.addTrack(destination.stream.getAudioTracks()[0]);

    // VANILLA JAVASCRIPT
    // var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    // var recognition = new SpeechRecognition();
    // recognition.continuous = true;
    // recognition.interimResults = true;

    // // start recognition
    // recognition.start();

    // // This runs when the speech recognition service starts
    // recognition.onstart = function () {
    //   console.log("listening, speak");
    // };

    // // This runs when the speech recognition service returns result
    // recognition.onresult = function (event) {
    //   var transcript = event.results[event.results.length - 1][0].transcript;
    //   var confidence = event.results[event.results.length - 1][0].confidence;
    //   text += transcript;
    //   console.log(text);
    // };
    console.log("started0");
    // IBM WATSON
    //http://localhost:3002/api/speech-to-text/token
    fetch("https://s2twatibm.herokuapp.com/api/speech-to-text/token") //https://s2twatibm.herokuapp.com/api/speech-to-text/token
      .then(function (response) {
        return response.json();
      })
      .then(function (token) {
        console.log("started1");
        console.log(token);
        var stream = WatsonSpeech.SpeechToText.recognizeMicrophone(
          Object.assign(token, {
            objectMode: true, // send objects instead of text
            format: false, // optional - performs basic formatting on the results such as capitals an periods
          })
        );

        stream.on("data", function (data) {
          //console.log(data);
          var conf = data.results[data.results.length - 1].alternatives[0]
            .confidence
            ? data.results[data.results.length - 1].alternatives[0].confidence
            : 0; //0th has more confidence and sometimes confidence attribute doesnt come at all in any also
          if (conf && conf > 0.37) {
            //conf && conf > 0.47
            transcript =
              data.results[data.results.length - 1].alternatives[0].transcript;
            if (score == 0) {
              score = Math.max(score, conf);
            } else {
              score = (score + conf) / 2;
            }
            text += transcript;
            console.log(text);

            /*Classes oncall with names,test imp points */
            if (
              transcript == "chatla" ||
              transcript == "venkat" ||
              transcript == "rohit" ||
              transcript == "exam assignment" ||
              transcript == "cia"
            ) {

    //           await axios
    // .post(
    //   "https://cvrrvidrooms.herokuapp.com/mailoncall",
    //   {
    //     to: "rohitchatla@gmail.com",
    //     title: transcript,
    //     desc: text,
    //     fileb64: '',//attachments(if_any)
    //   },
    //   {
    //     headers: {
    //       authorization: `bearer ${localStorage.authToken}`,
    //       //'Content-Type': 'multipart/form-data', //'Content-Type': 'application/json',
    //       //Accept: 'application/json',
    //     },
    //   }
    // )
    // .then(() => {
    // })
    // .catch((err) => console.error(err));
    //         fetch("https://cvrrvidrooms.herokuapp.com/mailoncall")
    // .then(function (response) {
    //   return response.json();
    // })
    // .then(function (token) {})

    const body={
        to: "rohitchatla@gmail.com",
        title: transcript,
        desc: text,
        fileb64: '',//attachments(if_any)
    }

    const response = await fetch(`https://cvrrvidrooms.herokuapp.com/mailoncall`, {
      method: "POST",
      headers: {
        //authorization: `Bearer ${token}`, //localStorage.getItem("token")
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  
    const oncall = await response.json();
    console.log(oncall);
            }

    
          }
        });

        stream.on("error", function (err) {
          console.log(err);
        });
      })
      .catch(function (error) {
        console.log(error);
      });

    // azure speech
    // audioConfig = SpeechSDK.AudioConfig.fromStreamInput(output);
    // recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

    // recognizer.startContinuousRecognitionAsync();

    // recognizer.recognizing = (s, e) =>
    //   console.log(`RECOGNIZING: Text=${e.result.text}`);

    // recognizer.recognized = (s, e) => {
    //   text += e.result.text;
    //   if (score == 0) {
    //     score = Math.max(score, JSON.parse(e.result.json).NBest[0].Confidence);
    //   } else {
    //     score = (score + JSON.parse(e.result.json).NBest[0].Confidence) / 2;
    //   }
    // };

    // recognizer.canceled = (s, e) => {
    //   console.log(`CANCELED: Reason=${e.reason}`);
    //   recognizer.stopContinuousRecognitionAsync();
    // };

    // recognizer.sessionStopped = (s, e) => {
    //   console.log('\n Session stopped event.');
    //   recognizer.stopContinuousRecognitionAsync();
    //   chrome.browserAction.setIcon({ path: '../assets/icon48.png' });

    //   chrome.storage.sync.get('email', (data) => {
    //     const newWindow = window.open('../html/textEditor.html');
    //     newWindow.text = text.replace('undefined', '');
    //     newWindow.email = data.email;
    //     newWindow.duration = duration;
    //     newWindow.confidenceScore = (100 * score).toFixed(2);
    //   });

    //   // reload the background script to reset the variables
    //   reloadBackgroundScript();
    // };
  });
}

function reloadBackgroundScript() {
  chrome.extension.getBackgroundPage().window.location.reload();
}

function cancelStream() {
  chrome.browserAction.setIcon({ path: "../assets/icon48.png" });
  reloadBackgroundScript();
}

// get mic audio
function getMicAudio() {
  navigator.mediaDevices.getUserMedia(constraints).then((mic) => {
    micStream = mic;
    micAudio = audioContext.createMediaStreamSource(micStream);
    micAudio.connect(destination);

    getTabAudio();
  });
}

// start recording the stream
function startRecord() {
  setTimeout(() => {
    chrome.browserAction.setIcon({ path: "../assets/icon_red.png" });
    getMicAudio();
  }, 3000);
}

function pauseResumeRecord() {
  if (!paused) {
    tabAudio.disconnect(destination);
    if (micable) {
      micAudio.disconnect(destination);
    }
    paused = true;
  } else {
    tabAudio.connect(destination);
    if (micable) {
      micAudio.connect(destination);
    }
    paused = false;
  }
}

function muteMic() {
  if (micable) {
    micAudio.disconnect(destination);
    micable = false;
  } else {
    micAudio.connect(destination);
    micable = true;
  }
}

// stop record -> stop all the tracks
function stopRecord(totalTime) {
  //micStream.getTracks().forEach((t) => t.stop());
  //tabStream.getTracks().forEach((t) => t.stop());
  duration = totalTime;

  console.log("\n Session stopped event.");
  chrome.browserAction.setIcon({ path: "../assets/icon48.png" });

  chrome.storage.sync.get("email", (data) => {
    const newWindow = window.open("../html/textEditor.html");
    newWindow.text = text.replace("undefined", "");
    newWindow.email = data.email;
    newWindow.duration = duration;
    newWindow.confidenceScore = (100 * score).toFixed(2);
  });

  // reload the background script to reset the variables
  reloadBackgroundScript();
  stream.stop.bind(stream);
  //recognizer.stopContinuousRecognitionAsync();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case "record":
      startRecord();
      break;
    case "stop":
      stopRecord(request.duration);
      break;
    case "pause":
      pauseResumeRecord();
      break;
    case "mute":
      muteMic();
      break;
    case "cancel":
      cancelStream();
      break;
    default:
      break;
  }
});
