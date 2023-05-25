import { StatInterval } from 'services/Stats.service';

export enum Period {
  OneDay = '1 day',
  SevenDays = '7 days',
  ThirtyDays = '30 days',
  Total = 'Total'
}

export const periodToInterval: Record<Period, StatInterval> = {
  [Period.OneDay]: StatInterval.OneDay,
  [Period.SevenDays]: StatInterval.SevenDay,
  [Period.ThirtyDays]: StatInterval.ThirtyDay,
  [Period.Total]: StatInterval.Total
};
