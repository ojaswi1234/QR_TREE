export interface Tree {
  tree_id: number;
  common_name: string;
  scientific_name: string;
  description: string;
  benefits: string[];
  images: string[];
  age: number;
  planted_date: string;
  health_status: string;
  planted_by: string;
  qr_code?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
