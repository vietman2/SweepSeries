export type AgreementSimpleType = {
  id: number;
  title: string;
  required: boolean;
  has_content: boolean;
};

export type AgreementType = {
  title: string;
  content: string;
  last_updated: string;
};
