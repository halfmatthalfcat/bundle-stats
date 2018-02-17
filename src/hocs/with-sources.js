import { map } from 'lodash';
import {
  compose,
  withProps,
  withState,
  withHandlers,
} from 'recompose';

import {
  isGistUrl,
  getGistRawUrl,
} from '../utils/gist';
import fetchJSON from '../utils/fetch';
import {
  syncUrlsToSearch,
  getUrlParams,
} from '../utils/search-params';

const resolveUrl = (url) => {
  if (isGistUrl(url)) {
    return getGistRawUrl(url);
  }

  return url;
};

const syncSearchParams = sources =>
  syncUrlsToSearch(map(sources, 'url'));


const getDefaultSource = url => ({
  url,
  resolvedUrl: resolveUrl(url),
  error: false,
  loading: false,
  fetched: false,
  res: {},
});

const addSource = ({ sources, setSources }) => (url) => {
  const newSources = [
    ...sources,
    getDefaultSource(url),
  ];
  setSources(newSources);
  syncSearchParams(newSources);
};

const removeSource = ({ sources, setSources }) => (sourceIndex) => {
  const newSources = [
    ...sources.slice(0, sourceIndex),
    ...sources.slice(sourceIndex + 1),
  ];
  setSources(newSources);
  syncSearchParams(newSources);
};

const updateSource = ({ sources, setSources }) => (sourceIndex, payload) =>
  setSources([
    ...sources.slice(0, sourceIndex),
    {
      ...sources[sourceIndex],
      ...payload,
    },
    ...sources.slice(sourceIndex + 1),
  ]);

const fetchSources = (props) => {
  props.sources.forEach((source, index) => {
    const {
      resolvedUrl,
      loading,
      fetched,
      error,
    } = source;

    if (loading || fetched || error) {
      return;
    }

    props.updateSource(index, {
      loading: true,
    });

    fetchJSON(resolvedUrl)
      .then(res => props.updateSource(index, {
        loading: false,
        fetched: true,
        res,
      }))
      .catch(err => props.updateSource(index, {
        loading: false,
        fetched: false,
        error: err.message,
      }));
  });
};

const enhance = () => compose(
  withProps({
    initialUrls: getUrlParams(),
  }),
  withState(
    'sources',
    'setSources',
    ({ initialUrls }) => initialUrls.map(getDefaultSource),
  ),
  withHandlers({
    addSource,
    removeSource,
    updateSource,
  }),
  BaseComponent => (props) => {
    fetchSources(props);
    return BaseComponent(props);
  },
);

export default enhance;