import React, { createContext, useState, useEffect } from 'react';
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

export const ImageContext = createContext();

export const ImageContextProvider = ({ children }) => {
  const [allImages, setAllImages] = useState([]);
  const [activeImages, setActiveImages] = useState([]);
  const [query, setQuery] = useState('');
  const [dates, setDates] = useState([1600, 2020]);
  const [sort, setSort] = useState(null);
  const [sortDirection, setSortDirection] = useState(true);
  const [size, setSize] = useState('full');

  useEffect(() => {
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
        sortDirection ? 'asc' : 'desc'
      );
    }
    setActiveImages(items);
  }, [query, sort, dates, sortDirection, allImages]);

  return (
    <ImageContext.Provider
      value={{
        allImages,
        setAllImages,
        activeImages,
        setActiveImages,
        query,
        setQuery,
        dates,
        setDates,
        sort,
        setSort,
        sortDirection,
        setSortDirection,
        size,
        setSize,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};

ImageContextProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};
