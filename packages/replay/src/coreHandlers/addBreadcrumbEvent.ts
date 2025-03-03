import type { Breadcrumb } from '@sentry/types';
import { EventType } from 'rrweb';

import type { ReplayContainer } from '../types';
import { addEvent } from '../util/addEvent';

/**
 * Add a breadcrumb event to replay.
 */
export function addBreadcrumbEvent(replay: ReplayContainer, breadcrumb: Breadcrumb): void {
  if (breadcrumb.category === 'sentry.transaction') {
    return;
  }

  if (breadcrumb.category === 'ui.click') {
    replay.triggerUserActivity();
  } else {
    replay.checkAndHandleExpiredSession();
  }

  replay.addUpdate(() => {
    void addEvent(replay, {
      type: EventType.Custom,
      // TODO: We were converting from ms to seconds for breadcrumbs, spans,
      // but maybe we should just keep them as milliseconds
      timestamp: (breadcrumb.timestamp || 0) * 1000,
      data: {
        tag: 'breadcrumb',
        payload: breadcrumb,
      },
    });

    // Do not flush after console log messages
    return breadcrumb.category === 'console';
  });
}
