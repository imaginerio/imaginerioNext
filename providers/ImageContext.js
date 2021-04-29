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

// REVIEW: If you merge SearchContext and ImageContext files but keep two different Contexts you
// dont need the glue code between them.
const StateContext = createContext();
const DispatchContext = createContext();

const initialState = {
  allImages: [],
  activeImages: [],
  query: '',
  dates: [1600, 2020],
  sort: null,
  direction: true,
  size: 'full',
};
// REVIEW: you can pass an array, and dispatch becomes less verbose:
// dispatch(['ACTION_NAME', payload])
function reducer(state, [type, payload]) {
  // console.log(type, payload);
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
    case 'SET_SIZE':
      return {
        ...state,
        size: payload,
      };
    default:
      return state;
  }
}

function ImageContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { query, sort, dates, direction, allImages } = state;

  // REVIEW: You don't need to have useEffect outside of the provider as a glue code,
  // it can be used here.
  useEffect(
    () => dispatch(['SET_ACTIVE_IMAGES', search({ query, sort, dates, direction, allImages })]),
    [query, sort, dates, direction, allImages]
  );

  // REVIEW: two providers but the same file: one provides State and the other Dispatch
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  );
}

// REVIEW: you dont need to export Context, you can straight up export the hook,
// which is nice as you can cosume it just like a useReducer hook, for instance:
// const [state, dispatch] = useImages() ===  const [state, dispatch] = useReducer()

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
