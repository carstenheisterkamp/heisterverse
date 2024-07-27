/* eslint-disable @typescript-eslint/no-loss-of-precision */
import { useAudioStore } from '../../stores/audioStore'

const StartButton: React.FC = () => {
    const createAudioContext = useAudioStore(state => state.createAudioContext);
    const loadSounds = useAudioStore(state => state.loadSounds);
    const toggleMute = useAudioStore(state => state.toggleMute);

    const init = async () => {
        try {
            await createAudioContext();
            await loadSounds();
            toggleMute(100);
        } catch (error) {
            console.error('Error initializing audio:', error);
        }
    };

    return (
        <div onClick={init}>
            <div className="w-36">
                <p className="text-white">Start Experience</p>
            </div>
        </div>
    );
};

export default StartButton;
