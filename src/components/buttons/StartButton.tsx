import { useAudioStore } from '../../stores/audioStore'

const StartButton: React.FC = () => {
    const { createAudioContext, loadSounds, getMasterGain } = useAudioStore(state => ({
        createAudioContext: state.createAudioContext,
        loadSounds: state.loadSounds,
        toggleMute: state.toggleMute,
        getMasterGain: state.getMasterGain,
    }));

    const init = async () => {
        try {
            createAudioContext();
            await loadSounds();


        } catch (error) {
            console.error('Error initializing audio:', error);
        }

        console.log('Master Gain Volume: ', getMasterGain());
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
