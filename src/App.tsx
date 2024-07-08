import Background from './components/Background';
import R3FCanvas from './components/Canvas';
import Content from './components/Content'
import Navbar from './components/Navbar';

const App = () => {
  return (
    <div className="relative w-[100vw]">
      <Background />
      <R3FCanvas />
      <Content />
      <Navbar />
    </div>
  );
};

export default App;
