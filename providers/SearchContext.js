import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const SearchContext = createContext();

export const SearchContextProvider = ({ children }) => {
  const [query, setQuery] = useState('');
  const [dates, setDates] = useState([1600, 2020]);
  const [sort, setSort] = useState(null);
  const [sortDirection, setSortDirection] = useState(true);

  return (
    <SearchContext.Provider
      value={{
        query,
        setQuery,
        dates,
        setDates,
        sort,
        setSort,
        sortDirection,
        setSortDirection,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

SearchContextProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};
