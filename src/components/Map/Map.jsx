import "./Map.css";
import GoogleMap from "../GoogleMap/GoogleMap";
import ellipse from "../../assets/Ellipse.svg";

function Map() {
  return (
    <section id="roadmap" className="map">
      <img className="map__image--top" src={ellipse} alt="ellipse circle"></img>
      <GoogleMap />
      <img
        className="map__image--bottom"
        src={ellipse}
        alt="ellipse circle"
      ></img>
    </section>
  );
}

export default Map;
