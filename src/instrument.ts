import {EventEmitter} from 'events';

import Note from './note';

export class Instrument extends EventEmitter {
    private playing = false;
    private playingIndex = 0;
    private notes: any[] = [];

    constructor(private adsrConfig, private fullNoteDuration) {
        super();
    }

    play(melody) {
        this.notes = [];
        for (let note of melody) {
            let duration: any;
            let freq: any;
            const frequency = (key) => Math.pow(2, (key - 49) / 12) * 440;

            if (note.length > 1) {
                freq = frequency(note[0]);
                duration = +note[1] * this.fullNoteDuration;
            } else {
                freq = frequency(note);
                duration = this.fullNoteDuration;
            }

            if (note.sustain) {
                const sustainADSRConfig = {
                    a: this.adsrConfig.a,
                    d: this.adsrConfig.d,
                    s: this.adsrConfig.s,
                    r: this.adsrConfig.r * 5
                };
                this.notes.push(new Note(freq, duration, sustainADSRConfig));
            }
            else {
                this.notes.push(new Note(freq, duration, this.adsrConfig));
            }
        }
        this.playing = true;
    }

    value(time) {
        if (!this.playing) {
            throw new Error('Instrument not playing.');
        }
        if (this.playingIndex < this.notes.length) {
            if (this.notes[this.playingIndex].wasAttacked() == false) {
                this.notes[this.playingIndex].play(time);
            }
            if (this.notes[this.playingIndex].wasReleased()) {
                this.playingIndex++;
            }
        }
        let value = 0;
        for (let note of this.notes) {
            value += +note.value(time)/2;
        }
        if (this.playingIndex == this.notes.length && value == 0) {
            this.emit('end');
        }
        return value;
    }
}

export class Piano extends Instrument {
    constructor(fullNoteDuration) {
        const adsrConfig = {
            a: 0.01,
            d: 0.5,
            s: 0,
            r: 0.2
        };
        super(adsrConfig, fullNoteDuration || 0.3);
    }
}

export class Flute extends Instrument {
    constructor(fullNoteDuration) {
        const adsrConfig = {
            a: 0.1,
            d: 0.1,
            s: 1,
            r: 0.05
        };
        super(adsrConfig, fullNoteDuration || 0.3);
    }
}
