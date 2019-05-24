import { flow } from 'lodash/fp';
import { map } from 'lodash';
import { mergeRunsById } from '@bundle-stats/utils';

import resolveMetricChanged from './resolve-metric-changed';
import computeDelta from './compute-delta';

export const generateRows = runs => flow([
  mergeRunsById,
  resolveMetricChanged,
  computeDelta,
])(map(runs, 'data'));