import ADSR from './adsr';

const TAU = Math.PI * 2;

export default class Note {
    private startTime: any = false;
    private released = false;
    private attacked = false;
    private adsr: ADSR;
    public onRelease: any;

    constructor(private frequency, private duration, adsrConfig) {
        this.adsr = new ADSR(adsrConfig.a, adsrConfig.d, adsrConfig.s, adsrConfig.r); 
    }

    active() {
        return this.adsr.isActive();  
    }

    play(time) {
        this.startTime = time;
        this.adsr.attack(time);
        this.attacked = true;
    }

    value(time) {
        if (this.startTime !== false && (time - this.startTime >= this.duration) && !this.released) {
            this.released = true;
            this.adsr.release(time);
            if (typeof this.onRelease ==='function') {
                this.onRelease();
            }
        }
        const sin = (f) => Math.sin(TAU * f * time);
        return (0.9 * sin(this.frequency) + 0.1 * sin(this.frequency) + 0.1 * sin(this.frequency)) * this.adsr.value(time);
    }

    wasReleased() {
        return this.released;
    }

    wasAttacked() {
        return this.attacked;
    }
}
