export type CandidateCategory = "roi" | "reine";

export interface Candidate {
  id: string;
  name: string;
  category: CandidateCategory;
  photo_url: string | null;
  description: string | null;
  created_at: string;
}