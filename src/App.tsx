import R3FCanvas from './components/Canvas';
/* import Content from './components/Content' */
import Navbar from './components/Navbar';

import MuteAudioButton from './components/buttons/StartButton'

const App = () => {
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
