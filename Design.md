# NexusUI musician's toolkit

For: Interface, Tuning, Timing



# Goals

- Audio Centric Interfaces
  - What do computer musicians need?
    - Ability to enter number manually for slider
    - Ability to set modules in a clear way
    - Abilities to handle pitches
    - Ability to handle time
    - Ability to work with audio samples
  - Examples of new interfaces that could be useful
    - Filter graph
    - More complex envelope (exponential segments)
    - oscilloscope or spectrum visualizer





- Tuning (TuneJS)

- Timing (WAAClock?)

  - Ability to create any number of "beat"/"metronome"/"**pulse**"s

  - Can sync an interface to a pulse, and give the interface a "next" function

    - e.g. sequencer .next(), or dial animation 

  - Or option to give an interface (sequencer) its own independent pulse ? ?

    ​

- Rack

  - Title
  - Collapsibility
  - Sharable via JSON format 
    - some way to include audio scripts? Basically is WAM….





# Modules

### Absolute Core

Slider    (& number box)

KnobSlider    (& number box)

Dial w/ number

Touch Button

Toggle

Number

2D Position w/ multitouch (one and the same, just with options)

Tilt

​	- need better tilt gui… 3 dots that move around?

### Core

Envelope 

Matrix Sequencer  w/ Toggle, Tempo, Range selection, Select for pattern

​	ability to set "volume" of each area w/ javascript ? or w/ dials on bottom row?

DB Meter

Spectrogram

Metronome

Range

Select

Waveform w/ several modes … may want to rethink what this does

- volume overlay?
- panning overlay?
- fascinating if you could construct a track in real time using js, adding volume fades, etc...
- i.e. waveform gui where you can "add" audio values, or overwrite audio values — 

### Secondary

Transport 

​	play/stop, play/pause, fastforward, rewind, 

Crossfade

KnobCrossfade

Keyboard

Typewriter

Mouse

Envelope function with button (start) or toggle (start/stop)

### Ancillary

Text Button

Text Comment

Word Toggle

Record button with timer

Playlist w/ play/stop for each one, and settings for how to travel through it — i.e. loop one, loop all

​	each item fills up as it plays 

"Track" interface for dragging clips around?

Nch Mixer?

### Spatialization Tools

2, 4 or 8 channel setup (customizable) with draggable nodes around the space









## Module Details

- Use CSS to style?
  - There is a default width/height and number location/size, which can be refigured with CSS





## Issues

Perhaps audio on the web should not be bound to the traditional dial/slider/sequencer paradigm?

Isn't the power of web audio to coordinate with graphics, multimedia...

But the distributed web audio paradigm needs a set of GUIs (or can just use PD/Max… but would be nice if all web)







# Update process

for each widget--

nx => mt

GUI.w => width



Next up:

- adjust for size (slider, dial)
  - how big to make the number? 10%? 
  - it would look nice to have all numbers same size...
- new dial, slider graphics
  - dial to radial interaction?
- optional number
- min, max, step 
  - == easy, just translate to dial itself. but make sure number accords, too