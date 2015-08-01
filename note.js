var ADSR = require('./adsr.js')
    , TAU = Math.PI * 2

module.exports = function(freq, duration, adsrConfig) {
    var freq = freq
      , duration = duration
      , startTime = false
      , released = false
      , attacked = false
      , adsr = new ADSR(adsrConfig.a, adsrConfig.d, adsrConfig.s, adsrConfig.r)

    this.active = function() {
        return adsr.active()
    }

    this.play = function(t) {
        startTime = t
        adsr.attack(t)
        attacked = true
    }

    this.value = function(t) {
        if (startTime !== false && (t - startTime >= duration) && !released) {
            released = true
            adsr.release(t)
            if (typeof this.onRelease == 'function') {
                this.onRelease()
            }
        }
        return ( 0.9 * sin(freq) + 0.1 * sin(freq * 2) + 0.1 * sin(freq * 3)) * adsr.value(t)
        function sin(f) {
            return Math.sin(TAU * f * t)
        }
    }

    this.wasReleased = function() {
        return released
    }

    this.wasAttacked = function() {
        return attacked
    }
}
