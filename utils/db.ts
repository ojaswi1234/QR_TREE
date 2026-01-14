"use client";
import Dexie, { type EntityTable } from "dexie";

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
}

export const db = new Dexie("tree_database") as Dexie & {
  trees: EntityTable<Tree, "tree_id">;
};

// Version 3: Remove auto-increment since MongoDB generates the ID
db.version(3).stores({
  trees: "tree_id, common_name, scientific_name, health_status, planted_by, planted_date, age, description, benefits, images, qr_code",
});
