import { EventType } from 'rrweb';

import type { AddEventResult, ReplayContainer, ReplayPerformanceEntry } from '../types';
import { addEvent } from './addEvent';

/**
 * Create a "span" for each performance entry. The parent transaction is `this.replayEvent`.
 */
export function createPerformanceSpans(
  replay: ReplayContainer,
  entries: ReplayPerformanceEntry[],
): Promise<AddEventResult | null>[] {
  return entries.map(({ type, start, end, name, data }) =>
    addEvent(replay, {
      type: EventType.Custom,
      timestamp: start,
      data: {
        tag: 'performanceSpan',
        payload: {
          op: type,
          description: name,
          startTimestamp: start,
          endTimestamp: end,
          data,
        },
      },
    }),
  );
}
