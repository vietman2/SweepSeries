export type AgreementSimpleType = {
  id: number;
  title: string;
  required: boolean;
  has_content: boolean;
};

export type AgreementType = {
  id: number;
  title: string;
  content: string;
  required: boolean;
};
