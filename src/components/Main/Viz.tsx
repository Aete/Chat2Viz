import styled from "styled-components";
import { useCallback, useEffect } from "react";

import DeckGL from "@deck.gl/react";
import { GeoJsonLayer, MapViewState } from "deck.gl";
import { useMapStore } from "../../store";
import { supabase } from "../../utils/supabase";
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
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // 0 = left, 1 = middle, 2 = right
    if (e.button === 1) {
      e.preventDefault();
    }
  }, []);

  const { viewState, setViewState } = useMapStore();

  // Supabase에서 환경 데이터 5줄 가져오기
  useEffect(() => {
    const fetchEnvironmentData = async () => {
      try {
        const { data: environment, error } = await supabase
          .from("environment")
          .select("*")
          .limit(5);

        if (error) {
          console.error("데이터 가져오기 오류:", error);
        } else {
          console.log("환경 데이터 5줄:", environment);
        }
      } catch (err) {
        console.error("예상치 못한 오류:", err);
      }
    };

    fetchEnvironmentData();
  }, []);

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
        viewState={viewState}
        controller={true}
        layers={layers}
        onViewStateChange={({ viewState }) =>
          setViewState(viewState as MapViewState)
        }
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
