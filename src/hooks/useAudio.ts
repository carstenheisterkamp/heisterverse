import { useContext } from "react";
import { AudioContext } from './AudioContext';

const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context as NonNullable<typeof context>;
};

export default useAudio