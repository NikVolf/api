// Copyright 2017-2020 @polkadot/api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ExtrinsicStatus, EventRecord } from '@polkadot/types/interfaces';
import { Registry } from '@polkadot/types/types';
import { SubmittableResultImpl, SubmittableResultValue } from './types';

import { createType } from '@polkadot/types/codec';

export default class SubmittableResult implements SubmittableResultImpl {
  public readonly events: EventRecord[];

  public readonly status: ExtrinsicStatus;

  constructor (registry: Registry, { events, status }: SubmittableResultValue) {
    this.events = events || [];
    this.status = status.isFinalized
      ? createType(registry, 'ExtrinsicStatus', { InBlock: status.asFinalized })
      : status;
  }

  public get isCompleted (): boolean {
    return this.isError || this.isInBlock;
  }

  public get isError (): boolean {
    return this.status.isDropped || this.status.isInvalid || this.status.isUsurped;
  }

  public get isInBlock (): boolean {
    return this.status.isInBlock;
  }

  public get isFinalized (): boolean {
    console.warn('SubmittableResult: isFinalized is deprecated; use isInBlock instead');
    return this.status.isFinalized;
  }

  /**
   * @description Filters EventRecords for the specified method & section (there could be multiple)
   */
  public filterRecords (section: string, method: string): EventRecord[] {
    return this.events.filter(({ event }): boolean =>
      event.section === section && event.method === method
    );
  }

  /**
   * @description Finds an EventRecord for the specified method & section
   */
  public findRecord (section: string, method: string): EventRecord | undefined {
    return this.events.find(({ event }): boolean =>
      event.section === section && event.method === method
    );
  }
}
