import { promises as fs } from "fs";
import path from "path";
import { initialGifts } from "@/data/content";
import type { GiftRecord, RsvpRecord } from "@/types";

export type { GiftRecord, RsvpRecord };

const dataDir = path.join(process.cwd(), "data");
const giftsPath = path.join(dataDir, "gifts.json");
const rsvpsPath = path.join(dataDir, "rsvps.json");

async function ensureDataFiles() {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(giftsPath);
  } catch {
    await fs.writeFile(giftsPath, JSON.stringify(catalogGifts(), null, 2));
  }

  try {
    await fs.access(rsvpsPath);
  } catch {
    await fs.writeFile(rsvpsPath, JSON.stringify([], null, 2));
  }
}

function catalogGifts(existing: GiftRecord[] = []): GiftRecord[] {
  const byId = new Map(existing.map((gift) => [gift.id, gift]));
  return initialGifts.map((gift) => {
    const current = byId.get(gift.id);
    return {
      ...gift,
      claimed: current?.claimed ?? false,
      claimedBy: current?.claimedBy ?? null,
      claimedAt: current?.claimedAt ?? null,
    };
  });
}

export async function readGifts(): Promise<GiftRecord[]> {
  await ensureDataFiles();
  const raw = await fs.readFile(giftsPath, "utf8");
  const stored = JSON.parse(raw) as GiftRecord[];
  const gifts = catalogGifts(stored);
  const changed =
    stored.length !== gifts.length ||
    stored.some((gift, index) => gift.id !== gifts[index]?.id || gift.image !== gifts[index]?.image);
  if (changed) {
    await fs.writeFile(giftsPath, JSON.stringify(gifts, null, 2));
  }
  return gifts;
}

export async function writeGifts(gifts: GiftRecord[]) {
  await ensureDataFiles();
  await fs.writeFile(giftsPath, JSON.stringify(gifts, null, 2));
}

export async function toggleGift(id: string, claimedBy?: string) {
  const gifts = await readGifts();
  const index = gifts.findIndex((gift) => gift.id === id);
  if (index === -1) return null;

  const current = gifts[index];
  const nextClaimed = !current.claimed;
  gifts[index] = {
    ...current,
    claimed: nextClaimed,
    claimedBy: nextClaimed ? (claimedBy?.trim() || "A loved one") : null,
    claimedAt: nextClaimed ? new Date().toISOString() : null,
  };

  await writeGifts(gifts);
  return gifts[index];
}

export async function readRsvps(): Promise<RsvpRecord[]> {
  await ensureDataFiles();
  const raw = await fs.readFile(rsvpsPath, "utf8");
  return JSON.parse(raw) as RsvpRecord[];
}

export async function addRsvp(
  input: Omit<RsvpRecord, "id" | "createdAt">,
): Promise<RsvpRecord> {
  const rsvps = await readRsvps();
  const record: RsvpRecord = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  rsvps.push(record);
  await fs.writeFile(rsvpsPath, JSON.stringify(rsvps, null, 2));
  return record;
}
