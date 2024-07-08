import React, { createContext, useState, useEffect } from 'react';
import * as Tone from 'tone';

interface AudioContextProps {
    muted: boolean;
    setMuted: (muted: boolean) => void;
    addSound: (key: string, url: string, options?: Tone.PlayerOptions) => void;
    playSound: (key: string) => void;
    stopSound: (key: string) => void;
}

const AudioContext = createContext<AudioContextProps | undefined>(undefined);

interface Props {
    children?: React.ReactNode;
}

const AudioContextProvider: React.FC<Props> = ({ children }) => {
    const [muted, setMuted] = useState(false);
    const [sounds, setSounds] = useState<{ [key: string]: Tone.Player }>({});

    useEffect(() => {
        Tone.getDestination().mute = muted;
    }, [muted]);

    const addSound = (key: string, url: string, options?: Tone.PlayerOptions) => {
        const player = new Tone.Player({ url, ...options }).toDestination();
        setSounds((prevSounds) => ({ ...prevSounds, [key]: player }));
    };

    const playSound = (key: string) => {
        if (sounds[key]) sounds[key].start();
    };

    const stopSound = (key: string) => {
        if (sounds[key]) sounds[key].stop();
    };

    const value: AudioContextProps = {
        muted,
        setMuted,
        addSound,
        playSound,
        stopSound
    };

    return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};

export { AudioContext, AudioContextProvider };
