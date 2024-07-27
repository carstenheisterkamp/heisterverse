import { StateCreator, create } from 'zustand'
import { devtools } from 'zustand/middleware';
import { audiosettings } from '../data/config'

interface Sound {
    file: string;
    positional: boolean;
    loop: boolean;
    volume: number;
    start: number;
    length: number;
}
interface SoundWithAudioBuffer extends Sound {
    audioBuffer: AudioBuffer;
    source: AudioBufferSourceNode;
    gainNode: GainNode;
    panner: StereoPannerNode | PannerNode;
}

interface AudioStore {
    isMuted: boolean;
    audioContext: AudioContext | null;
    masterGain: GainNode | null,
    sounds: Record<string, SoundWithAudioBuffer>;
    analyser: AnalyserNode | null;
    soundsPlaying: { [key: string]: boolean };
    loadSounds: () => Promise<void>;
    createAudioContext: () => void;
    createMasterGain: () => void;
    createAnalyser: () => void;
    getFrequencyData: () => Uint8Array | null;
    setPan: (key: string, panValue: number) => void;
    set3DPosition: (key: string, x: number, y: number, z: number) => void;
    startSound: (key: string, analyse: boolean, pan?: number) => Promise<void>;
    stopSound: (key: string, fadeDuration: number) => Promise<void>;
    toggleMute: (fadeDuration: number) => Promise<void>;
    cleanup: () => void;
}

const audioStore: StateCreator<AudioStore, [["zustand/devtools", never]], []> = (set, get) => ({
    isMuted: false,
    audioContext: null,
    masterGain: null,
    sounds: {},
    soundsPlaying: {},
    analyser: null,
    createAudioContext: async () => {
        return new Promise<void>((resolve, reject) => {
            if (get().audioContext === null) {
                let audioContext: AudioContext | null = null;
                try {
                    audioContext = new AudioContext();
                    set({ audioContext }, false, 'createAudioContext');
                    console.log("audioContext created", audioContext);
                    resolve();
                } catch (error) {
                    console.error('Failed to create audio context:', error);
                    reject(error);
                }
            } else {
                console.log('Audio context already exists');
                resolve();
            }
        });
    },
    loadSounds: async () => {
        const audiopath = audiosettings.baseurl;
        const sounds: Record<string, Sound> = audiosettings.audioFiles;
        const LoadedSounds: { [key: string]: SoundWithAudioBuffer } = get().sounds || {};

        const soundsToLoad = Object.keys(sounds).filter(key => !LoadedSounds[key]);

        if (soundsToLoad.length === 0) {
            console.log('All sounds are already loaded.');
            return;
        }

        await Promise.all(soundsToLoad.map(async (key) => {
            try {
                const sound = sounds[key];
                const response = await fetch(audiopath + sound.file);
                const arrayBuffer = await response.arrayBuffer();
                let buffer = await get().audioContext!.decodeAudioData(arrayBuffer);


                if (buffer.numberOfChannels === 1) {
                    console.log('Mono sound detected, converting to stereo', key, sound.file);
                    const numberOfChannels = 2;
                    const length = buffer.length;
                    const sampleRate = buffer.sampleRate;
                    const newBuffer = get().audioContext!.createBuffer(numberOfChannels, length, sampleRate);

                    const channelData = buffer.getChannelData(0);
                    newBuffer.copyToChannel(channelData, 0);
                    newBuffer.copyToChannel(channelData, 1);

                    buffer = newBuffer;
                }

                LoadedSounds[key] = {
                    ...sound,
                    audioBuffer: buffer
                } as SoundWithAudioBuffer;

            } catch (error) {
                console.error(`Failed to load sound ${key}:`, error);
            }
        }));

        set({ sounds: LoadedSounds }, false, 'SoundsLoaded');
        get().createMasterGain();
        get().createAnalyser();
        console.log('Sounds loaded:', LoadedSounds);
    },

    createMasterGain: () => {
        const { audioContext } = get();
        const masterGain = audioContext!.createGain();
        masterGain.connect(audioContext!.destination);
        set({ masterGain: masterGain }, false, 'createMasterGain');
    },

    createAnalyser: () => {
        const { audioContext } = get();
        const audioctx = audioContext!.createAnalyser();
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
    setPan: (key: string, panValue: number) => {
        const { sounds } = get();
        const sound = sounds[key];
        console.log('Set pan value', panValue, sound);
        if (sound.panner instanceof StereoPannerNode) {
            sound.panner.pan.value = panValue;
        }
    },
    set3DPosition: (key: string, x: number, y: number, z: number) => {
        const { audioContext, sounds, soundsPlaying } = get();

        if (soundsPlaying[key]) {
            if (sounds[key] && sounds[key].panner && sounds[key].panner instanceof PannerNode) {
                sounds[key].panner.positionX.setValueAtTime(x, audioContext!.currentTime);
                sounds[key].panner.positionY.setValueAtTime(y, audioContext!.currentTime);
                sounds[key].panner.positionZ.setValueAtTime(z, audioContext!.currentTime);
            } else {
                if (!sounds[key]) {
                    console.warn('No sound found', key);
                }
                if (!sounds[key].panner) {
                    console.warn('No 3D panner found on sound', key);
                }
            }
        }
    },
    startSound: (key: string, analyse: boolean) => {
        const { audioContext, sounds, isMuted, soundsPlaying, masterGain, analyser } = get();

        return new Promise<void>((resolve, reject) => {
            if (!audioContext) {
                reject("No audio context found");
            } else if (!sounds[key]) {
                reject(`Sound ${key} not found`);
            } else if (isMuted) {
                reject("Audio is muted");
            } else if (sounds[key].loop === true && soundsPlaying[key]) {
                reject(`Sound ${key} is LOOPED and already playing`);
            }
            else {
                if (audioContext!.state === 'suspended') {
                    console.log('AudioContext is suspended, resuming...')
                    audioContext!.resume()
                }

                const sound = sounds[key]
                const source = audioContext!.createBufferSource();
                const gainNode = audioContext!.createGain();

                sounds[key] = { ...sounds[key], source, gainNode };

                source.loop = sound.loop;
                source.buffer = sound.audioBuffer;
                source.connect(gainNode);
                gainNode.gain.value = sound.volume;

                if (analyse) {
                    if (!analyser) {
                        console.error('No analyser found')
                        return;
                    } else {
                        gainNode.connect(analyser!);
                        console.log('Connected to analyser')
                    }
                }

                if (sound.positional) {
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
                    const stereoPanner = audioContext.createStereoPanner();
                    stereoPanner.pan.value = 0
                    gainNode.connect(stereoPanner);
                    stereoPanner.connect(masterGain!);
                }

                source.onended = () => {
                    set({ soundsPlaying: { ...soundsPlaying, [key]: false } }, false, 'soundEnded');
                }

                set({ soundsPlaying: { ...soundsPlaying, [key]: true } }, false, 'startSound');
                source.start(0, sound.start);
                resolve();
            }
        })
    },
    stopSound: async (key: string, fadeDuration: number) => {
        const { sounds, soundsPlaying, audioContext } = get();
        if (soundsPlaying[key]) {
            const sound = sounds[key];

            sound.gainNode.gain.linearRampToValueAtTime(1, audioContext!.currentTime);
            sound.gainNode.gain.linearRampToValueAtTime(0, audioContext!.currentTime + fadeDuration);

            await new Promise(resolve => setTimeout(resolve, fadeDuration * 1000));
            sound.source.stop();
            set({ soundsPlaying: { ...soundsPlaying, [key]: false } }, false, 'stopSound');
        }
    },
    toggleMute: async (fadeDuration: number) => {
        const { audioContext, masterGain, isMuted } = get();
        if (audioContext && masterGain) {
            if (isMuted) {
                masterGain.gain.linearRampToValueAtTime(0, audioContext.currentTime);
                masterGain.gain.linearRampToValueAtTime(1, audioContext.currentTime + fadeDuration);
            } else {
                masterGain.gain.linearRampToValueAtTime(1, audioContext.currentTime);
                masterGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + fadeDuration);
            }

            await new Promise(resolve => setTimeout(resolve, fadeDuration * 1000));

            if (masterGain.gain.value === 0) {
                set({ isMuted: true }, false, 'muteAudio');
                audioContext.suspend();
                console.warn('Audio muted');
                return
            }

            if (masterGain.gain.value > 0) {
                set({ isMuted: false }, false, 'unmuteAudio');
                audioContext.resume();
                console.warn('Audio unmuted');
                return
            }
        } else {
            console.warn('No audio context or master gain found');
        }
    },
    cleanup: () => {
        const { audioContext } = get();
        console.log('Cleaning up audio context', audioContext);
        audioContext!.close();
    }
});

export const useAudioStore = create(devtools(audioStore));