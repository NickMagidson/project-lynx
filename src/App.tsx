import { Viewer, Entity, PointGraphics, EntityDescription, GeoJsonDataSource } from 'resium'
import { Cartesian3, createWorldTerrainAsync } from 'cesium'
import './App.css'

const data = {
  type: "Feature",
  properties: {
    name: "Coors Field",
    amenity: "Baseball Stadium",
    popupContent: "This is where the Rockies play!",
  },
  geometry: {
    type: "Point",
    coordinates: [-104.99404, 39.75621, 1000000],
  },
};

const terrainProvider = createWorldTerrainAsync();
const position = Cartesian3.fromDegrees(-74.0707383, 40.7117244, 1000000);

function App() {
  return (
    <Viewer full terrainProvider={terrainProvider}>

      <Entity position={position} name="Tokyo">
        <PointGraphics pixelSize={10} />
        <EntityDescription>
          <h1>Hello, world.</h1>
          <p>JSX is available here!</p>
        </EntityDescription>
      </Entity>

      <GeoJsonDataSource data={data} />

      {/* <Entity /> ====> ISS */}
    </Viewer>
  )
}

export default App
