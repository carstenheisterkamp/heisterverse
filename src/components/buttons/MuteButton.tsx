import { useAudioStore } from '../../stores/audioStore'

const StartButton: React.FC = () => {
    const isMuted = useAudioStore(state => state.isMuted);
    const toggleMute = useAudioStore(state => state.toggleMute);

    const toggleAudio = async () => {
        try {
            await toggleMute(100);
        }
        catch (error) {
            console.error('Error muting / unmuting audio', error);
        }
    }

    return (
        <div onClick={toggleAudio}>
            <div className="w-36">
                {isMuted ? <p className="text-white">Unmute</p> : <p className="text-white">Mute</p>}
            </div>
        </div>
    );
};

export default StartButton;
