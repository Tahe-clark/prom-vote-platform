export interface Candidate {
  id: string;
  name: string;
  category: "roi" | "reine";
  photo_url: string;
  description: string;
  created_at: string;
}