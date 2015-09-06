module.exports = function(a, d, s, r) {
    this.attackDuration = a
    this.decayDuration = d
    this.sustainLevel = s
    this.releaseDuration = r

    var attackTime = false
        , releaseTime = false
        , active = false
        , level = 0

    this.attack = function(t) {
        attackTime = t
        active = true
    }

    this.release = function(t) {
        level = this.value(t)
        releaseTime = t
    }

    this.value = function(t) {
        if (!active) {
            return 0
        }
        if (releaseTime === false) {
            var dt = t - attackTime
            if (dt < this.attackDuration) {
                return dt / this.attackDuration
            }
            dt -= this.attackDuration
            if (dt < this.decayDuration) {
                return 1 - (dt / this.decayDuration) * (1 - this.sustainLevel)
            }
            return this.sustainLevel
        }
        else {
            var dt = t - releaseTime
            if (dt < this.releaseDuration) {
                return level * (1 - dt / this.releaseDuration)
            }
            attackTime = false
            releaseTime = false
            active = false
            level = 0
            return 0
        }
    }

    this.active = function() {
        return active
    }
}
