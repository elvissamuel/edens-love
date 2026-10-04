import { promises as fs } from "fs";
import path from "path";
import { initialGifts } from "@/data/content";
import { postToAppsScript } from "@/lib/apps-script";
import type { GiftRecord } from "@/types";

export type { GiftRecord };

const dataDir = path.join(process.cwd(), "data");
const giftsPath = path.join(dataDir, "gifts.json");

type GiftOverlay = Pick<
  GiftRecord,
  "id" | "price" | "draft" | "claimed" | "claimedBy" | "claimedAt"
>;

async function readLocalOverlay(): Promise<GiftOverlay[]> {
  try {
    const raw = await fs.readFile(giftsPath, "utf8");
    return JSON.parse(raw) as GiftOverlay[];
  } catch {
    return [];
  }
}

async function writeLocalOverlay(gifts: GiftRecord[]) {
  if (process.env.VERCEL) return;
  try {
    await fs.mkdir(dataDir, { recursive: true });
    const overlay: GiftOverlay[] = gifts.map((gift) => ({
      id: gift.id,
      price: gift.price,
      draft: gift.draft,
      claimed: gift.claimed,
      claimedBy: gift.claimedBy,
      claimedAt: gift.claimedAt,
    }));
    await fs.writeFile(giftsPath, JSON.stringify(overlay, null, 2));
  } catch {
    // Serverless filesystems are read-only; Google Sheets is the store there.
  }
}

async function readRemoteOverlay(): Promise<GiftOverlay[] | null> {
  const payload = await postToAppsScript({ type: "gift-list" });
  if (!payload || payload.ok === false || !Array.isArray(payload.gifts)) {
    return null;
  }
  return payload.gifts as GiftOverlay[];
}

function mergeGifts(overlay: GiftOverlay[] = []): GiftRecord[] {
  const byId = new Map(overlay.map((gift) => [gift.id, gift]));
  return initialGifts.map((gift) => {
    const current = byId.get(gift.id);
    return {
      ...gift,
      price:
        typeof current?.price === "number" && Number.isFinite(current.price)
          ? current.price
          : null,
      draft: current?.draft ?? false,
      claimed: current?.claimed ?? false,
      claimedBy: current?.claimedBy ?? null,
      claimedAt: current?.claimedAt ?? null,
    };
  });
}

export async function readGifts(includeDrafts = false): Promise<GiftRecord[]> {
  const local = await readLocalOverlay();
  const remote = await readRemoteOverlay();
  const overlay = remote && remote.length > 0 ? remote : local;
  const gifts = mergeGifts(overlay);
  await writeLocalOverlay(gifts);
  return includeDrafts ? gifts : gifts.filter((gift) => !gift.draft);
}

export async function updateGift(
  id: string,
  patch: Partial<Pick<GiftRecord, "price" | "draft" | "claimed" | "claimedBy">>,
) {
  const gifts = await readGifts(true);
  const index = gifts.findIndex((gift) => gift.id === id);
  if (index === -1) return null;

  const current = gifts[index];
  gifts[index] = {
    ...current,
    price:
      patch.price === undefined
        ? current.price
        : patch.price === null || Number.isNaN(patch.price)
          ? null
          : patch.price,
    draft: patch.draft ?? current.draft,
    claimed: patch.claimed ?? current.claimed,
    claimedBy:
      patch.claimedBy === undefined ? current.claimedBy : patch.claimedBy,
    claimedAt: patch.claimed
      ? new Date().toISOString()
      : patch.claimed === false
        ? null
        : current.claimedAt,
  };

  const updated = gifts[index];
  await writeLocalOverlay(gifts);
  const remote = await postToAppsScript({
    type: "gift-update",
    id: updated.id,
    price: updated.price,
    draft: updated.draft,
    claimed: updated.claimed,
    claimedBy: updated.claimedBy,
    claimedAt: updated.claimedAt,
  });
  if (process.env.VERCEL && remote?.ok !== true) {
    throw new Error("Could not save the gift to Google Sheets.");
  }
  return updated;
}
