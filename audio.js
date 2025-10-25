class Audio {
    constructor(N_BINS) {
        this.mic = new p5.AudioIn();
        this.fft = new p5.FFT();
        this.mic.start();
        this.fft.setInput(this.mic);
        this.N_BINS = N_BINS;
        console.log(this.mic.getLevel());
    } 


    getSpectrum() {
        return this.fft.analyze(this.N_BINS);
    }

    getVolume() {
        return this.mic.getLevel();
    }




}