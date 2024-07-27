import R3FCanvas from './components/Canvas';
/* import Content from './components/Content' */
import Navbar from './components/Navbar';
import { useEffect } from 'react';
import { useAudioStore } from './stores/audioStore';

import MuteAudioButton from './components/buttons/MuteAudio'

const App = () => {
  const loadSounds = useAudioStore((state) => state.loadSounds);

  useEffect(() => {
    loadSounds();
  }, [loadSounds]);


  return (
    <div className="relative w-[100vw]">
      <R3FCanvas />
      {/*       <Content /> */}
      <Navbar />
      <MuteAudioButton />
    </div>
  );
};

export default App;
