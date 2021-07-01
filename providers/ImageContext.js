import React, { createContext, useContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { orderBy } from 'lodash';
import unaccent from '../utils/unaccent';

const textSearch = ({ item, query }) => {
  const terms = query.split(' ').filter(t => t);
  return terms.some(term => {
    const regex = new RegExp(unaccent(term), 'gi');
    if (item.title && item.title.match(regex)) return true;
    if (item.creator && item.creator.match(regex)) return true;
    if (item.depicts) {
      if (Array.isArray(item.depicts.value)) {
        if (item.depicts.value.some(d => d.match(regex))) return true;
      } else if (item.depicts.value.match(regex)) return true;
    }
    return false;
  });
};

const search = ({ query, dates, sort, direction, allImages }) => {
  if (!allImages) return [];
  let items = allImages;
  if (query) items = items.filter(item => textSearch({ item, query }));
  items = items.filter(i => i.firstyear <= dates[1] && i.lastyear >= dates[0]);
  if (sort) {
    items = orderBy(
      items,
      i => {
        if (sort === 'date') return parseInt(i.firstyear, `0`);
        return unaccent(i[sort]).replace(/\W/gi, '');
      },
      direction ? 'asc' : 'desc'
    );
  }
  return items;
};

const StateContext = createContext();
const DispatchContext = createContext();

const initialState = {
  allImages: [],
  activeImages: [],
  selectedImage: null,
  query: '',
  dates: [1600, 2020],
  year: 1900,
  sort: null,
  direction: true,
  size: 'full',
  useLinks: true,
  showViewPoints: true,
};

function reducer(state, [type, payload]) {
  switch (type) {
    case 'QUERY':
      return {
        ...state,
        query: payload,
      };
    case 'DATES':
      return {
        ...state,
        dates: payload,
      };
    case 'YEAR':
      return {
        ...state,
        year: payload,
      };
    case 'SORT':
      return {
        ...state,
        sort: payload,
      };
    case 'DIRECTION':
      return {
        ...state,
        direction: !state.direction,
      };
    case 'FILTER':
      return {
        ...state,
        activeImages: payload,
      };
    case 'SET_ALL_IMAGES':
      return {
        ...state,
        allImages: payload,
      };
    case 'SET_ACTIVE_IMAGES':
      return {
        ...state,
        activeImages: payload,
      };
    case 'SET_SELECTED_IMAGE':
      return {
        ...state,
        selectedImage: payload,
      };
    case 'SET_SIZE':
      return {
        ...state,
        size: payload,
      };
    case 'SET_USE_LINKS':
      return {
        ...state,
        useLinks: payload,
      };
    case 'TOGGLE_VIEWPOINTS':
      return {
        ...state,
        showViewPoints: !state.showViewPoints,
      };
    default:
      return state;
  }
}

function ImageContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { query, sort, dates, direction, allImages } = state;

  useEffect(
    () => dispatch(['SET_ACTIVE_IMAGES', search({ query, sort, dates, direction, allImages })]),
    [query, sort, dates, direction, allImages]
  );

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  );
}

function useImages() {
  const dispatchContext = useContext(DispatchContext);
  const stateContext = useContext(StateContext);

  if (dispatchContext === undefined) {
    throw new Error('useImages must be used within a ImageContextProvider');
  }
  return [stateContext, dispatchContext];
}

export { ImageContextProvider, useImages };

ImageContextProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};
