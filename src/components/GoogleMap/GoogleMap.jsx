import "./GoogleMap.css";
import { useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { getPath } from "../../utils/pathGenerator";

function GoogleMap() {
  const [openMarkerIndex, setOpenMarkerIndex] = useState(null);

  const handleMarkerClick = (index) => {
    setOpenMarkerIndex(index);
  };

  const APIkey = import.meta.env.VITE_GOOGLE_API_KEY;
  const mapId = import.meta.env.VITE_MAP_ID;

  return (
    <APIProvider apiKey={APIkey}>
      <div className="googlemap">
        <div className="googlemap__map">
          <Map
            mapId={mapId}
            defaultCenter={{ lat: 38.5, lng: -77 }}
            defaultZoom={5}
            gestureHandling={"greedy"}
            disableDefaultUI={false}
            fullscreenControl={false}
          >
            {getPath().map((item, index) => (
              <div key={index}>
                {/* AdvancedMarker */}
                <AdvancedMarker
                  position={{ lat: item.lat, lng: item.long }}
                  onClick={() => handleMarkerClick(index)}
                ></AdvancedMarker>

                {/* Conditionally render InfoWindow */}
                {openMarkerIndex === index && (
                  <InfoWindow
                    position={{ lat: item.lat, lng: item.long }}
                    onCloseClick={() => setOpenMarkerIndex(null)}
                  >
                    <div>
                      <h3>
                        {item.stop}
                        {item.city}
                      </h3>
                      <p>{item.name}</p>
                    </div>
                  </InfoWindow>
                )}
              </div>
            ))}
          </Map>
        </div>
      </div>
    </APIProvider>
  );
}

export default GoogleMap;
