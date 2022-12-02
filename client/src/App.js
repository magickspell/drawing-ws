import ToolBar from "./components/ToolBar";
import SettingsBar from "./components/SettingsBar";
import Canvas from "./components/Canvas";

function App() {
    return (
        <div className="app">
            <ToolBar/>
            <SettingsBar/>
            <Canvas/>
        </div>
    );
}

export default App;
