export type TermType = {
  id: number;
  title: string;
  content: string;
  required: boolean;
  created_at: string;
  updated_at: string;
  deleted: boolean;
  history: {
    id: number;
    created_at: string;
    summary: string;
  }[]
};
