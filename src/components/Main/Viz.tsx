import styled from "styled-components";
import { useCallback, useRef } from "react";

import DeckGL from "@deck.gl/react";
import { GeoJsonLayer, MapViewState } from "deck.gl";
import { useMapStore } from "../../store";
import Map from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

// types
import { FeatureCollection } from "geojson";

// datasets
import seoulBoundary from "../../utils/data/seoul_simplified.json";

const Container = styled.div`
  position: sticky;
  width: 50%;
  min-height: 100vh;
  top: 0;
  right: 0;

  // prevent overscroll-wheel drags from bubbling to the page
  overscroll-behavior: contain;

  @media (max-width: 960px) {
    width: 100%;
  }
`;

const Viz: React.FC = () => {
  const deckRef = useRef<any>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // 0 = left, 1 = middle, 2 = right
    if (e.button === 1) {
      e.preventDefault();
    }
  }, []);

  const { viewState, setViewState, setViewport } = useMapStore();

  const SeoulGeoJsonLayer = new GeoJsonLayer({
    id: "seoul-geojson",
    data: seoulBoundary as FeatureCollection,
    pickable: true,
    getLineColor: [255, 255, 255],
    getLineWidth: 100,
    filled: false,
  });

  const MAP_STYLE =
    "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json";

  const layers = [SeoulGeoJsonLayer];

  return (
    <Container onMouseDown={handleMouseDown}>
      <DeckGL
        ref={deckRef}
        viewState={viewState}
        controller={true}
        layers={layers}
        onViewStateChange={({ viewState }) => {
          setViewState(viewState as MapViewState);
        }}
        onAfterRender={() => {
          // DeckGL 렌더링 후 viewport 정보 업데이트
          if (deckRef.current && deckRef.current.deck) {
            const viewport = deckRef.current.deck.getViewports()[0];
            if (viewport) {
              setViewport(viewport);
            }
          }
        }}
      >
        <Map
          mapboxAccessToken={
            "pk.eyJ1Ijoic2doYW4iLCJhIjoiY2szamxqbjZnMGtmbTNjbXZzamh4cng3dSJ9.GGv4GVVoZ811d6PKi54PrA"
          }
          mapStyle={MAP_STYLE}
        />
      </DeckGL>
    </Container>
  );
};

export default Viz;
