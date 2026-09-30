export type AdminCandidate = {
  id: string;
  name: string;
  category: string;
  photo_url: string | null;
  description: string | null;
  votes: {
    id: string;
  }[];
};
