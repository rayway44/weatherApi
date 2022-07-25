
import Style from './app.module.css'
import Location from './Components/LocationFinder'

function App() {
  return (
    <div className={Style.appBodyWrapper}>
      <div>
        <Location />
      </div>
    </div>
  );
}

export default App;
