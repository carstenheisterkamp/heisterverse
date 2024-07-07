
import R3FCanvas from './components/Canvas';
import Navbar from './components/Navbar'
import Background from './components/Background';

const App = () => {
  return (
    <div className="relative">
      <Background />
      <R3FCanvas />
      {/*   <Background /> */}
      <Navbar />
    </div>
  );
};

export default App;
