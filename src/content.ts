
import * as Tone from 'tone';

const sections = [
    {
        title: 'Section 1',
        content: 'This is the first section.',
        image: 'https://via.placeholder.com/300'
    },
    {
        title: 'Section 2',
        content: 'This is the second section.',
        image: 'https://via.placeholder.com/300'
    },
    {
        title: 'Section 3',
        content: 'This is the third section.',
        image: 'https://via.placeholder.com/300'
    },
];

const playeroptions: Tone.PlayerOptions = {
    onload: () => { },
    onerror: () => { },
    playbackRate: 1,
    loop: false,
    autostart: false,
    loopStart: 0,
    loopEnd: 0,
    reverse: false,
    fadeIn: 0,
    fadeOut: 0,
    volume: 1,
    mute: true,
    onstop: () => { },
    context: Tone.getContext()
}

export { sections, playeroptions }
