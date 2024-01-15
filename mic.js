//kod na ziskanie dat z mikrofonu

class Microphone {
    constructor (){
        this.initialized = false;
        //pyta sa pri prvom spusteni o povolenie pouzivat mikrofon
        navigator.mediaDevices.getUserMedia({audio: true})
        //ak povolene
        .then(function(stream){
            this.audioContext = new AudioContext();
            this.mic = this.audioContext.createMediaStreamSource(stream);
            this.analyzer = this.audioContext.createAnalyser();
            this.analyzer.fftSize = 1024;
            const bufferLength = this.analyzer.frequencyBinCount;
            this.dataArray = new Uint8Array(bufferLength);
            this.mic.connect(this.analyzer);
            this.initialized = true;
        //ak zamietnute
        }.bind(this)).catch(function(err){
            alert(err);
        });
    }

    //usporiadane data z mikrofonu pripravene na pouzitie, dzka array fftsize/2
    //cim viac dat, tym lepsie to funguje
    getSamples(){
        this.analyzer.getByteTimeDomainData(this.dataArray);
        let normSamples = [...this.dataArray].map(e=> e/128 - 1);
        return normSamples;
    }
}