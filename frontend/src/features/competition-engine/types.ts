import type { Athlete, BracketMatch, GroupStanding } from '@/shared/types/domain';

export type SeededGroup = {
  id: string;
  nome: string;
  atletas: Athlete[];
};

export type OpenLevel = 'A' | 'B' | 'C' | 'D';

export type OpenLevelsMap = Record<OpenLevel, Athlete[]>;

export type AdvancementInput = {
  standingsByGroup: Record<string, GroupStanding[]>;
  athletesById: Record<number, Athlete>;
};

export type KnockoutGeneration = {
  level: string;
  matches: BracketMatch[];
};

