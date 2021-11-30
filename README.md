[-> 中文Readme](README_cn.md)

# ScoreDraft Editor

ScoreDraft Editor is an [Electron](https://www.electronjs.org/) based editor UI for [ScoreDraft](https://github.com/fynv/ScoreDraft), designated for its [YAML based input format]([Introduction to ScoreDraft | ScoreDraft](https://fynv.github.io/ScoreDraft/intro_eng.html#yaml-based-input)). ScoreDraft Editor can be used for music composing, previewing, engraving (with the help of [LilyPond](http://lilypond.org/)) and sharing (as a staic HTML demo-page).

Like LilyPond, ScoreDraft Editor supports your composing process through a simple text editor interface instead of a Piano Roll used by most DAW. ScoreDraft enhances LilyPond in the following apsects:

* Providing a built-in synthesizer, which supports SoundFont2. The synthesizer can be activated anytime during the composing process. Depending on the sound-font of your choice, the sound quality can be much better than the system sequencer.

* Provding a voice synthesizer, compatible to [UTAU]([utau.us](http://utau.us)). Composer can preview not only the melody, but also the voice part.

* Providing a sequence visualizer called Meteor. The visualizer component can be embedded into the HTML demo-page.

While providing the above features, ScoreDraft Editor still allows you to generate high-quality sheet-music. While generating the demo-page, LilyPond is called in the background for the sheet part. A LilyPond file is generated as an intermediate output. You can manually improve it for better sheet-music if you would like.

## Get All the Components

ScoreDraft Editor is based on a collection of awesome open-source productions which needs to be installed from different sources.

### Python

Python 3.x needed. Which can be installed from:

[Welcome to Python.org](https://www.python.org/)

or [Miniconda &mdash; Conda documentation](https://docs.conda.io/en/latest/miniconda.html)

### LilyPond

[LilyPond &ndash; Music notation for everyone](http://lilypond.org/index.html)

### ScoreDraft

Here you need the PyPi package **scoredraft_editor** instead of **scoredraft**, which provides additional entries that are directly called by the editor.

```shell
# pip install scoredraft_editor
```

### The Editor

The editor itself is much smaller than the Electron binraries. So the smartest way to get the editor installed is to follow the [manual distribution](https://www.electronjs.org/docs/latest/tutorial/application-distribution#manual-distribution) procedural of electron. Download the prebuilt binaries, and copy everything from this repo to the electron folder. (May need to remove default_app.asar).

You can also check the **release** part of this repo where I may put the full binary packages.






