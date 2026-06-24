let soundAudioContext = null;
let clickAudioBuffer = null;
let keyPressAudioBuffer = null;
let soundAudioKeepAlive = null;

function getAudioContextClass() {
  return globalThis.AudioContext || globalThis.webkitAudioContext;
}

function fillClickAudioBuffer(buffer, context) {
  const data = buffer.getChannelData(0);
  for (let index = 0; index < data.length; index += 1) {
    const elapsed = index / context.sampleRate;
    const attack = Math.min(1, elapsed / 0.0004);
    const snap = (Math.random() * 2 - 1) * Math.exp(-elapsed / 0.003);
    const body = Math.sin(2 * Math.PI * 1600 * elapsed) * Math.exp(-elapsed / 0.005);
    const mechanism = Math.sin(2 * Math.PI * 850 * elapsed) * Math.exp(-elapsed / 0.012);
    data[index] = attack * (snap * 0.5 + body * 0.25 + mechanism * 0.25);
  }
}

function fillKeyPressAudioBuffer(buffer, context) {
  const data = buffer.getChannelData(0);
  let smoothedNoise = 0;
  for (let index = 0; index < data.length; index += 1) {
    const elapsed = index / context.sampleRate;
    const attack = Math.min(1, elapsed / 0.0036);
    const rawNoise = Math.random() * 2 - 1;
    smoothedNoise = smoothedNoise * 0.84 + rawNoise * 0.16;
    const surfaceBrush = smoothedNoise * Math.exp(-elapsed / 0.0105);
    const contactBloom = Math.tanh(smoothedNoise * 0.65) * Math.exp(-elapsed / 0.0075);
    data[index] = attack * (surfaceBrush * 0.22 + contactBloom * 0.08);
  }
}

function createSoundBuffer(context, duration, fillBuffer) {
  const buffer = context.createBuffer(
    1,
    Math.ceil(context.sampleRate * duration),
    context.sampleRate
  );
  fillBuffer(buffer, context);
  return buffer;
}

function startSoundKeepAlive() {
  if (soundAudioKeepAlive || !soundAudioContext) {
    return;
  }

  const keepAlive = soundAudioContext.createOscillator();
  const keepAliveGain = soundAudioContext.createGain();
  keepAlive.frequency.value = 30;
  keepAliveGain.gain.value = 0.000001;
  keepAlive.connect(keepAliveGain).connect(soundAudioContext.destination);
  keepAlive.start();
  soundAudioKeepAlive = keepAlive;
}

function prepareSoundEffects() {
  const AudioContextClass = getAudioContextClass();
  if (!AudioContextClass) return false;

  if (
    soundAudioContext &&
    soundAudioContext.state !== "closed" &&
    clickAudioBuffer &&
    keyPressAudioBuffer
  ) {
    if (soundAudioContext.state === "suspended") {
      void soundAudioContext.resume();
    }
    startSoundKeepAlive();
    return true;
  }

  soundAudioContext = new AudioContextClass();
  clickAudioBuffer = createSoundBuffer(soundAudioContext, 0.035, fillClickAudioBuffer);
  keyPressAudioBuffer = createSoundBuffer(soundAudioContext, 0.03, fillKeyPressAudioBuffer);

  if (soundAudioContext.state === "suspended") {
    void soundAudioContext.resume();
  }

  startSoundKeepAlive();
  return true;
}

function playSoundBuffer(getBuffer, volume = 0.18) {
  if (!prepareSoundEffects()) return;

  const buffer = getBuffer();
  if (!buffer) return;

  const source = soundAudioContext.createBufferSource();
  const gain = soundAudioContext.createGain();
  gain.gain.value = volume;
  source.buffer = buffer;
  source.connect(gain).connect(soundAudioContext.destination);
  source.start();
}

function playClickSound() {
  playSoundBuffer(() => clickAudioBuffer);
}

function playKeyPressSound() {
  playSoundBuffer(() => keyPressAudioBuffer, 0.11);
}

function releaseSoundEffects() {
  const context = soundAudioContext;
  const keepAlive = soundAudioKeepAlive;
  soundAudioContext = null;
  clickAudioBuffer = null;
  keyPressAudioBuffer = null;
  soundAudioKeepAlive = null;
  if (keepAlive) {
    keepAlive.stop();
  }
  if (context && context.state !== "closed") {
    window.setTimeout(() => void context.close(), 250);
  }
}
