import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// 데이터베이스 테이블 타입 정의
export interface EnvironmentData {
  id: number;
  datetime: string;
  serial: string;
  temperature_avg: number | null;
  humidity_avg: number | null;
  noise_avg: number | null;
}

export interface Sensor {
  serial: string;
  address: string | null;
  geometry: string | null;
}
