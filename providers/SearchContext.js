import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';

const initialState = {
  allImages: [],
  activeImages: [],
  query: '',
  dates: [1600, 2020],
  sort: null,
  direction: true,
};

function reducer(state, action) {
  switch (action.type) {
    case 'QUERY':
      return {
        ...state,
        query: action.payload,
      };
    case 'DATES':
      return {
        ...state,
        dates: action.payload,
      };
    case 'SORT':
      return {
        ...state,
        sort: action.payload,
      };
    case 'DIRECTION':
      return {
        ...state,
        direction: !state.direction,
      };
    case 'FILTER':
      return {
        ...state,
        activeImages: action.payload,
      };
    default:
      return state;
  }
}

export const SearchContext = createContext();

export const SearchContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <SearchContext.Provider value={{ state, dispatch }}>{children}</SearchContext.Provider>;
};

SearchContextProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};
