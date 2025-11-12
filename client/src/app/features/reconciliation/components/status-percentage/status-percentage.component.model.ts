/**
 * Types for StatusPercentageComponent
 */

export interface StatusData {
  label: string;
  count: number;
  percentage: number;
  color: string;
}

export const STATUS_COLORS = {
  balanced: '#7c5cff',
  overpaid: '#a855f7',
  underpaid: '#f59e0b',
  na: '#475569',
} as const;

