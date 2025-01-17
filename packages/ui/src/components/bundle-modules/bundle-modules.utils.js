import { useMemo } from 'react';
import intersection from 'lodash/intersection';
import union from 'lodash/union';
import merge from 'lodash/merge';
import get from 'lodash/get';
import { MODULE_PATH_PACKAGES } from '@bundle-stats/utils/lib-esm/webpack';
import {
  MODULE_CHUNK,
  MODULE_FILTERS,
  MODULE_FILE_TYPE,
  MODULE_SOURCE_TYPE,
  getModuleSourceFileType,
} from '@bundle-stats/utils';

export const addRowFlags = (row) => {
  const { key, runs } = row;

  // @NOTE Assign instead destructuring for perf reasons

  // eslint-disable-next-line no-param-reassign
  row.thirdParty = Boolean(key.match(MODULE_PATH_PACKAGES));
  // eslint-disable-next-line no-param-reassign
  row.duplicated = Boolean(runs.find((run) => run?.duplicated === true));
  // eslint-disable-next-line no-param-reassign
  row.fileType = getModuleSourceFileType(row.key);

  return row;
};

export const getCustomSort = (item) => [!item.changed, item.key];

export const generateGetRowFilter =
  ({ chunkIds }) =>
  (filters) =>
  (row) => {
    // Skip not changed rows
    if (filters[MODULE_FILTERS.CHANGED] && !row.changed) {
      return false;
    }

    // Skip not duplicated rows
    if (filters[MODULE_FILTERS.DUPLICATED] && !row.duplicated) {
      return false;
    }

    // Skip not matching source type
    if (
      !(
        (filters[`${MODULE_SOURCE_TYPE}.${MODULE_FILTERS.FIRST_PARTY}`] &&
          row.thirdParty === false) ||
        (filters[`${MODULE_SOURCE_TYPE}.${MODULE_FILTERS.THIRD_PARTY}`] && row.thirdParty === true)
      )
    ) {
      return false;
    }

    // Skip not matching source file types
    if (!filters[`${MODULE_FILE_TYPE}.${row.fileType}`]) {
      return false;
    }

    // List of chunkIds with filter value set to `true`
    const checkedChunkIds = chunkIds.reduce((agg, chunkId) => {
      if (get(filters, `${MODULE_CHUNK}.${chunkId}`)) {
        return [...agg, chunkId];
      }

      return agg;
    }, []);

    // Filter if any of the chunkIds are checked
    if (checkedChunkIds.length !== chunkIds.length) {
      const rowRunsChunkIds = row?.runs?.map((run) => run?.chunkIds || []) || [];
      const rowChunkIds = union(...rowRunsChunkIds);
      const matchedChunkIds = intersection(rowChunkIds, checkedChunkIds);

      return matchedChunkIds.length > 0;
    }

    return true;
  };
