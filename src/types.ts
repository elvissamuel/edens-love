export type GiftRecord = {
  id: string;
  name: string;
  detail: string;
  hint: string;
  image: string;
  price: number | null;
  draft: boolean;
  claimed: boolean;
  claimedBy: string | null;
  claimedAt: string | null;
};

export type RsvpRecord = {
  id: string;
  name: string;
  email: string;
  attending: boolean;
  guests: number;
  message: string;
  createdAt: string;
};
