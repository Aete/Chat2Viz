import { create } from "zustand";
import sensorData from "../utils/data/s_dot_coord.json";
import { supabase } from "../utils/supabase"; // Import Supabase client

// S-DoT sensor data type definition
export interface SensorData {
  serial: string;
  lon: number;
  lat: number;
}

// Sensor store state type definition
interface SensorStoreState {
  // Data
  sensors: SensorData[];
  filteredSensors: SensorData[];
  selectedSensor: SensorData | null;

  // Loading state
  isLoading: boolean;

  // Actions
  setSensors: (sensors: SensorData[]) => void;
  setSelectedSensor: (sensor: SensorData | null) => void;
  setFilteredSensors: (
    boundingBox: {
      minLat: number;
      maxLat: number;
      minLon: number;
      maxLon: number;
    } | null
  ) => void;
  clearFilter: () => void;
  getSensorsInBounds: (bounds: {
    minLat: number;
    maxLat: number;
    minLon: number;
    maxLon: number;
  }) => SensorData[];
  initializeData: () => void;
  fetchEnvironmentAvgBySensors: (
    sensorIds: string[],
    startTime: string,
    endTime: string,
    parameter: string
  ) => Promise<SensorData | null>;
}

const useSensorStore = create<SensorStoreState>((set, get) => {
  // Re-initialize data function (for manual refresh)
  const initializeData = () => {
    set({ isLoading: true });
    try {
      const sensors = sensorData as SensorData[];
      console.log("Re-initializing sensors:", sensors.length);
      set({
        sensors,
        filteredSensors: sensors,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to load sensor data:", error);
      set({ isLoading: false });
    }
  };

  // Initialize data immediately
  const initialSensors = sensorData as SensorData[];
  console.log("Loading sensors on store creation:", initialSensors.length);

  return {
    // Initial state with loaded data
    sensors: initialSensors,
    filteredSensors: initialSensors,
    selectedSensor: null,
    isLoading: false,

    // Set sensor data
    setSensors: (sensors: SensorData[]) => {
      set({ sensors, filteredSensors: sensors });
    },

    // Set selected sensor
    setSelectedSensor: (sensor: SensorData | null) => {
      set({ selectedSensor: sensor });
    },

    // Filter sensors by bounding box
    setFilteredSensors: (
      boundingBox: {
        minLat: number;
        maxLat: number;
        minLon: number;
        maxLon: number;
      } | null
    ) => {
      const { sensors } = get();
      const filtered = boundingBox
        ? get().getSensorsInBounds(boundingBox)
        : sensors;
      set({ filteredSensors: filtered });
    },

    // Clear filter (show all sensors)
    clearFilter: () => {
      const { sensors } = get();
      set({ filteredSensors: sensors });
    },

    // Get sensors within bounding box
    getSensorsInBounds: (bounds: {
      minLat: number;
      maxLat: number;
      minLon: number;
      maxLon: number;
    }) => {
      const sensors = get().sensors;
      return sensors.filter(
        (sensor) =>
          sensor.lat >= bounds.minLat &&
          sensor.lat <= bounds.maxLat &&
          sensor.lon >= bounds.minLon &&
          sensor.lon <= bounds.maxLon
      );
    },

    // Re-initialize data (mainly for testing or manual refresh)
    initializeData,

    // Fetch average environmental data by sensors and time range
    fetchEnvironmentAvgBySensors: async (
      sensorIds: string[],
      startTime: string,
      endTime: string,
      parameter: string
    ) => {
      try {
        console.log('test', sensorIds, startTime, endTime, parameter);
        const { data, error } = await supabase.rpc("environment_avg_by_sensors", {
          p_sensor_serials: sensorIds,
          p_start: startTime,
          p_end: endTime,
          p_value: parameter,
        });

        if (error) {
          console.error("Error fetching environment averages:", error);
          return null;
        }

        return data;
      } catch (err) {
        console.error("Unexpected error fetching environment averages:", err);
        return null;
      }
    },
  };
});

export default useSensorStore;

// Convenience hooks
export const useSensors = () => useSensorStore((state) => state.sensors);
export const useFilteredSensors = () =>
  useSensorStore((state) => state.filteredSensors);
export const useSelectedSensor = () =>
  useSensorStore((state) => state.selectedSensor);

export const useSensorLoading = () =>
  useSensorStore((state) => state.isLoading);
// Individual action hooks to avoid infinite loop
export const useSetSensors = () => useSensorStore((state) => state.setSensors);
export const useSetSelectedSensor = () =>
  useSensorStore((state) => state.setSelectedSensor);
export const useSetFilteredSensors = () =>
  useSensorStore((state) => state.setFilteredSensors);
export const useClearFilter = () =>
  useSensorStore((state) => state.clearFilter);
export const useGetSensorsInBounds = () =>
  useSensorStore((state) => state.getSensorsInBounds);
export const useInitializeData = () =>
  useSensorStore((state) => state.initializeData);

// Export the new function
export const useFetchEnvironmentAvgBySensors = () =>
  useSensorStore((state) => state.fetchEnvironmentAvgBySensors);
