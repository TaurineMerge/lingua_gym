export interface MaterialsCardProps {
  title: string;
  description: string;
  username: string;
  tags: string[];
  language: string;
  type: CardType;
}

export enum CardType {
  TEXT = 'text',
  SET = 'set',
}