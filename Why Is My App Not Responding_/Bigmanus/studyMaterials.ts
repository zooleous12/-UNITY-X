import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { studyMaterials, InsertStudyMaterial } from "../drizzle/schema";

export async function createStudyMaterial(material: InsertStudyMaterial) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const [created] = await db.insert(studyMaterials).values(material);
  return created;
}

export async function getUserStudyMaterials(userId: number) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db
    .select()
    .from(studyMaterials)
    .where(eq(studyMaterials.userId, userId))
    .orderBy(studyMaterials.createdAt);
}

export async function getStudyMaterialById(id: number) {
  const db = await getDb();
  if (!db) {
    return undefined;
  }

  const [material] = await db
    .select()
    .from(studyMaterials)
    .where(eq(studyMaterials.id, id))
    .limit(1);

  return material;
}

export async function deleteStudyMaterial(id: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.delete(studyMaterials).where(eq(studyMaterials.id, id));
}
