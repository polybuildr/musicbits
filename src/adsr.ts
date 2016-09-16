export default class ADSR {
    public attackTime: any = false;
    private releaseTime: any = false;
    private active = false;
    private level = 0;

    constructor(
        private attackDuration,
        private decayDuration,
        private sustainLevel,
        private releaseDuration
    ) {}

    attack(time) {
        this.attackTime = time;
        this.active = true;
    }

    release(time) {
        this.level = this.value(time);
        this.releaseTime = time;
    }

    value(time) {
        if (!this.active) {
            return 0;
        }
        if (this.releaseTime === false) {
            let dt = time - this.attackTime;
            if (dt < this.attackDuration) {
                return dt / this.attackDuration;
            }
            dt -= this.attackDuration;
            if (dt < this.decayDuration) {
                return 1 - (dt / this.decayDuration) * (1 - this.sustainLevel);
            }
            return this.sustainLevel;
        }
        else {
            let dt = time - this.releaseTime;
            if (dt < this.releaseDuration) {
                return this.level * (1 - dt / this.releaseDuration);
            }
            this.attackTime = false;
            this.releaseTime = false;
            this.active = false;
            this.level = 0;
            return 0;
        }
    }

    isActive() {
        return this.active;
    }
}
