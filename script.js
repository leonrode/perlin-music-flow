

let canvas;
let particles = [];
const N_PARTICLES = 3000;
let frameRateP;
let audioVolumeP;
let freqRangeP;
let audio;
let audioStarted = false;
const  N_BINS = 128;
const MAX_DISTANCE = 10000;
const bassCutoff = 0.2;
const midCutoff = 0.55;

let bassSlider;
let midSlider;
let highSlider;
function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    frameRateP = createP();
    audioVolumeP = createP();
    freqRangeP = createP();
    bassSlider = createSlider(0, 3, 0.5, 0.05);
    bassSlider.position(10, 50);
    midSlider = createSlider(0, 3, 0.55, 0.05);
    midSlider.position(10, 70);
    highSlider = createSlider(0, 3, 0.5, 0.05);
    highSlider.position(10, 90);
    audio = new Audio(N_BINS);
    ambientLight(255, 255, 255);
    perspective(PI / 2, windowWidth / windowHeight, 1, 10000000);

    for (let i = 0; i < N_PARTICLES; i++) {
        particles.push(new Particle(random(-MAX_DISTANCE, MAX_DISTANCE), 0, random(-MAX_DISTANCE, MAX_DISTANCE), MAX_DISTANCE));
    }

    window.addEventListener("beforeunload", function(event) {
        audio.mic.stop();
    });
      
}


function draw() {
    background(0);
    frameRateP.html(round(frameRate()));
    
    audioVolumeP.html(round(audio.getVolume() * 100));
 
    const bassLevel = map(audio.getSpectrum().slice(0, bassCutoff * N_BINS).reduce((a, b) => a + b, 0) / (bassCutoff * N_BINS), 0, 255, 0, 1);
    const midLevel = map(audio.getSpectrum().slice(bassCutoff * N_BINS, midCutoff * N_BINS).reduce((a, b) => a + b, 0) / ((midCutoff - bassCutoff) * N_BINS), 0, 255, 0, 1);
    let highLevel = map(audio.getSpectrum().slice(midCutoff * N_BINS, N_BINS).reduce((a, b) => a + b, 0) / ((1 - midCutoff) * N_BINS), 0, 255, 0, 1);

    // let's amplify the highLevel
    highLevel = highLevel * 15;
    freqRangeP.html(`Bass: ${round(bassLevel, 2)}, Mid: ${round(midLevel, 2)}, High: ${round(highLevel, 2)}`);

    orbitControl();
    for (let particle of particles) {
        particle.show();
        particle.update(bassLevel * bassSlider.value(), midLevel * midSlider.value(), highLevel * highSlider.value());
    }
}