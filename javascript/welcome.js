navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
  alert('Microphone access granted to CvrrVidNotes. Happy Magic Mettings ;)');
  window.close();
});
