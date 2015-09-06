var Note = require('./note.js')
    , EventEmitter = require('events').EventEmitter
    , util = require('util')

function Instrument(melody, adsrConfig, fullNoteDuration) {
    EventEmitter.call(this)
    function frequency(key) {
        return Math.pow(2, (key - 49) / 12) * 440
    }

    var pianoConfig = {
        a: 0.01,
        d: 0.5,
        s: 0,
        r: 0.2
    }

    var fluteConfig = {
        a: 0.1,
        d: 0.1,
        s: 1,
        r: 0.05
    }

    if (adsrConfig == 'piano') {
        adsrConfig = pianoConfig
    }
    else if (adsrConfig == 'flute') {
        adsrConfig = fluteConfig
    }
    else {
        adsrConfig = pianoConfig
    }
    fullNoteDuration = fullNoteDuration || 0.3

    var notes = [];

    for (var i = 0; i < melody.length; i++) {
        var note = melody[i]

        var freq = frequency(note.key)
        var duration = (note.duration || 1) * fullNoteDuration

        if (note.sustain) {
            var sustainADSRConfig = {
                a: adsrConfig.a,
                d: adsrConfig.d,
                s: adsrConfig.s,
                r: adsrConfig.r * 5
            }
            notes.push(new Note(freq, duration, sustainADSRConfig))
        }
        else {
            notes.push(new Note(freq, duration, adsrConfig))
        }
    }
    var playingIndex = 0
    this.value = function(t) {
        if (playingIndex < notes.length) {
            if (notes[playingIndex].wasAttacked() == false) {
                notes[playingIndex].play(t)
            }
            if (notes[playingIndex].wasReleased()) {
                playingIndex++;
            }
        }
        var value = 0
        for (var i = 0; i < notes.length; i++) {
            value += notes[i].value(t)/2
        }
        if (playingIndex == notes.length && value == 0) {
            this.emit('end')
        }
        return value
    }
}

util.inherits(Instrument, EventEmitter)

module.exports = Instrument
