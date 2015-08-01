# musicbits

musicbits is a node library for easier creation of music with [baudio](https://github.com/substack/baudio)-like modules.

## API

```js
var musicbits = require('musicbits')
```

### musicbits.ADSR(a, d, s, r)

A simple ADSR envelope, where:
- a: attackDuration
- d: decayDuration
- s: sustainLevel
- r: releaseDuration

### musicbits.Note(frequency, duration, adsrConfig)

- frequency: frequency in Hertz
- duration: duration in seconds
- adsrConfig: JSON object with keys `a`, `d`, `s` and `r` to pass to `musicbits.ADSR`

### musicbits.Instrument(melody, adsrConfig, fullNoteDuration)

- melody: an array container integers representing note indices or arrays of two elements each, first being the note index and second being the duration

  For example, the melody argument `[40, [41, 2], 42]` would play note 40 for one note duration, note 41 for 2 notes duration and then 42 for one note duration

- adsrConfig (_optional_): A string, either `piano` or `flute` or a JSON object with keys `a`, `d`, `s` and `r` to pass to `musicbits.ADSR`

- fullNoteDuration (_optional_): Length of a normal length note in seconds
