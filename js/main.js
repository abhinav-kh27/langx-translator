// DARK MODE TOGGLE
const toggleBtn = document.getElementById('toggleDark');
const body = document.body;
if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark-mode');
}
toggleBtn.onclick = () => {
  body.classList.toggle('dark-mode');
  localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
};

// TRANSLATION LOGIC
const translateBtn = document.getElementById('translateBtn');
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');

translateBtn.onclick = async () => {
  const from = document.getElementById('fromLang').value;
  const to = document.getElementById('toLang').value;
  const text = inputText.value.trim();

  if (!text) return;

  outputText.value = 'Translating...';
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    outputText.value = data.responseData.translatedText;
  } catch (err) {
    outputText.value = '';
    alert("Translation failed. Please try again.");
  }
};

// TEXT-TO-SPEECH
const speakBtn = document.getElementById('speakBtn');
speakBtn.onclick = () => {
  const text = outputText.value;
  const langCode = document.getElementById('toLang').value;

  if (!text) return;

  const utterance = new SpeechSynthesisUtterance(text);

  // Map MyMemory language codes to speech synthesis codes
  const langMap = {
    en: 'en-IN',
    hi: 'hi-IN',
    ta: 'ta-IN',
    te: 'te-IN',
    kn: 'kn-IN',
    fr: 'fr-FR'
  };

  utterance.lang = langMap[langCode] || 'en-IN';
  speechSynthesis.speak(utterance);
};

// VOICE INPUT (SPEECH TO TEXT)
const voiceBtn = document.getElementById('voiceBtn');
voiceBtn.onclick = () => {
  const from = document.getElementById('fromLang').value;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('Speech recognition not supported in this browser.');
    return;
  }

  const recognition = new SpeechRecognition();
  const langMap = {
    en: 'en-IN',
    hi: 'hi-IN',
    ta: 'ta-IN',
    te: 'te-IN',
    kn: 'kn-IN',
    fr: 'fr-FR'
  };

  recognition.lang = langMap[from] || 'en-IN';

  recognition.onstart = () => {
    voiceBtn.textContent = '🎤 Listening...';
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    inputText.value = transcript;
    voiceBtn.textContent = '🎙️ Speak';
  };

  recognition.onerror = (event) => {
    alert('Speech recognition error: ' + event.error);
    voiceBtn.textContent = '🎙️ Speak';
  };

  recognition.onend = () => {
    voiceBtn.textContent = '🎙️ Speak';
  };

  recognition.start();
};
