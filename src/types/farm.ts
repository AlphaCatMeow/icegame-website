export interface Plot {
  crop?: string;
  harvest_left: number;
  is_upgraded: boolean;
  planted_at?: string;
  plot_number: number;
  plot_status: string;
  timeleft: number;
}

export interface Seed {
  grow_time: string;
  name: string;
  num: number;
}

export interface Bags {
  seeds: Seed[];
}

export interface StoreItem {
  name: string;
  exp: number;
  grow_time: string;
  max_harvest: number;
  required_level: number;
  base_yield: number;
  base_price: number;
  buy_price: number;
}
