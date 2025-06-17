import "./Main.css";
import About from "../About/About";
import GoogleMap from "../GoogleMap/GoogleMap";
import Map from "../Map/Map";
import ellipse from "../../assets/Ellipse.svg";
import Events from "../Events/Events";

function Main() {
  return (
    <main>
      <About />
      <Map />
      <Events></Events>
    </main>
  );
}

export default Main;
