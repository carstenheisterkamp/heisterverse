import MuteAudioButton from "./buttons/StartButton";

const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-100 text-white p-4 z-20">
            <h1 className="text-xl">Meine App</h1>
            <MuteAudioButton />
        </nav>
    );
};

export default Navbar;
