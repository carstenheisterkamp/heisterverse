import { StateCreator, create } from 'zustand'
import { devtools } from 'zustand/middleware';
import { audiosettings } from '../data/config'

const createAudioContext = () => {
    const audioContext = new (window.AudioContext || window.AudioContext)();
    audioContext.onstatechange = () => {
        console.log(`AudioContext state changed to: ${audioContext.state}`);
    };

    return audioContext;
};

interface Sound {
    file: string;
    type: string;
    loop: boolean;
    volume: number;
    start: number;
    length: number;
}

interface SoundWithAudioBuffer extends Sound {
    audioBuffer: AudioBuffer;
    source: AudioBufferSourceNode;
    gainNode: GainNode;
    panner: PannerNode;
}

interface AudioStore {
    isMuted: boolean;
    audioContext: AudioContext;
    masterGain: GainNode | null,
    sounds: Record<string, SoundWithAudioBuffer>;
    analyser: AnalyserNode | null;
    soundsPlaying: { [key: string]: boolean };
    loadSounds: () => Promise<void>;
    createMasterGain: () => void;
    createAnalyser: () => void;
    getFrequencyData: () => Uint8Array | null;
    setPosition: (key: string, x: number, y: number, z: number) => void;
    startSound: (key: string, analise: boolean, positional: boolean) => Promise<void>;
    stopSound: (key: string, fadeDuration: number) => Promise<void>;
    muteAudio: (fadeDuration: number) => Promise<void>;
    cleanup: () => void;
}

const audioStore: StateCreator<AudioStore, [["zustand/devtools", never]], []> = (set, get) => ({
    isMuted: false,
    audioContext: createAudioContext(),
    masterGain: null,
    sounds: {},
    soundsPlaying: {},
    analyser: null,
    loadSounds: async () => {
        const audiopath = audiosettings.audiopath
        const sounds: Record<string, Sound> = audiosettings.audio
        const LoadedSounds: { [key: string]: SoundWithAudioBuffer } = {};

        await Promise.all(Object.keys(sounds).map(async (key) => {
            try {
                const sound = sounds[key]
                const response = await fetch(audiopath + sound.file);
                const arrayBuffer = await response.arrayBuffer();
                const buffer = await get().audioContext.decodeAudioData(arrayBuffer);

                LoadedSounds[key] = {
                    ...sound,
                    audioBuffer: buffer
                } as SoundWithAudioBuffer;

            } catch (error) {
                console.error(`Failed to load sound ${key}:`, error);
            }
            set({ sounds: LoadedSounds }, false, 'SoundsLoaded');
            get().createMasterGain();
        }))
        get().createAnalyser();
    },

    createMasterGain: () => {
        const { audioContext } = get();
        const masterGain = audioContext.createGain();
        masterGain.connect(audioContext.destination);
        set({ masterGain: masterGain }, false, 'createMasterGain');
    },

    createAnalyser: () => {
        const { audioContext } = get();
        const audioctx = audioContext.createAnalyser();
        set({ analyser: audioctx }, false, 'createAnalyser');
    },

    getFrequencyData: () => {
        const { analyser } = get();

        if (analyser) {
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            analyser.getByteFrequencyData(dataArray);
            return dataArray;
        }
        return null;
    },

    setPosition: (key: string, x: number, y: number, z: number) => {
        const { audioContext, sounds, soundsPlaying } = get();

        if (soundsPlaying[key]) {
            if (sounds[key] && sounds[key].panner) {
                sounds[key].panner.positionX.setValueAtTime(x, audioContext.currentTime);
                sounds[key].panner.positionY.setValueAtTime(y, audioContext.currentTime);
                sounds[key].panner.positionZ.setValueAtTime(z, audioContext.currentTime);
            } else {
                if (!sounds[key]) {
                    console.error('No sound found', key);
                }
                if (!sounds[key].panner) {
                    console.error('No panner found on sound', key);
                }
            }
        }
    },

    startSound: (key: string, analise: boolean, positional: boolean) => {
        return new Promise<void>((resolve, reject) => {
            const { audioContext, sounds, isMuted, soundsPlaying, masterGain, analyser } = get();
            if (soundsPlaying[key]) {
                reject("Sound already playing");
            } else {
                if (!isMuted && sounds[key]) {
                    if (audioContext.state === 'suspended') {
                        console.log('AudioContext is suspended, resuming...')
                        audioContext.resume()
                    }

                    const sound = sounds[key]
                    const source = audioContext.createBufferSource();
                    const gainNode = audioContext.createGain();

                    sounds[key] = { ...sounds[key], source, gainNode };

                    source.loop = sound.loop;
                    source.buffer = sound.audioBuffer;
                    source.connect(gainNode);
                    gainNode.gain.value = sound.volume;

                    if (analise) {
                        if (!analyser) {
                            console.error('No analyser found')
                            return;
                        } else {
                            gainNode.connect(analyser!);
                            console.log('Connected to analyser')
                        }
                    }

                    if (positional) {
                        const panner = audioContext.createPanner();
                        panner.panningModel = 'HRTF';
                        panner.distanceModel = 'inverse';
                        panner.refDistance = 1;
                        panner.maxDistance = 10000;
                        panner.rolloffFactor = 1;
                        panner.coneInnerAngle = 360;
                        panner.coneOuterAngle = 0;
                        panner.coneOuterGain = 0;
                        gainNode.connect(panner);
                        panner.connect(masterGain!);
                        set({ sounds: { ...sounds, [key]: { ...sounds[key], panner } } }, false, 'set panner');
                        console.log('Connected to panner', panner)
                    } else {
                        gainNode.connect(masterGain!)
                        console.log('Connected to master gain')
                    }
                    set({ soundsPlaying: { ...soundsPlaying, [key]: true } }, false, 'startSound');
                    source.start(0, sound.start);
                    resolve();
                }
            }
        })
    },
    stopSound: async (key: string, fadeDuration: number) => {
        const { sounds, soundsPlaying, audioContext } = get();
        if (soundsPlaying[key]) {
            const sound = sounds[key];

            sound.gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime);
            sound.gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + fadeDuration);

            await new Promise(resolve => setTimeout(resolve, fadeDuration * 1000));
            sound.source.stop();
            set({ soundsPlaying: { ...soundsPlaying, [key]: false } }, false, 'stopSound');
        }
    },
    muteAudio: async (fadeDuration: number) => {
        const { audioContext, masterGain, isMuted } = get();

        if (isMuted) {
            masterGain!.gain.linearRampToValueAtTime(0, audioContext.currentTime);
            masterGain!.gain.linearRampToValueAtTime(1, audioContext.currentTime + fadeDuration);
        } else {
            masterGain!.gain.linearRampToValueAtTime(1, audioContext.currentTime);
            masterGain!.gain.linearRampToValueAtTime(0, audioContext.currentTime + fadeDuration);
        }

        await new Promise(resolve => setTimeout(resolve, fadeDuration * 1000));
        set({ isMuted: !isMuted }, false, 'muteAudio');

    },
    cleanup: () => {
        // const { audioContext } = get();
        // console.log('Cleaning up audio context', audioContext);
        // audioContext.close();
    }
});

export const useAudioStore = create(devtools(audioStore));