const unaccent = str => {
  if (typeof str === 'string' || str instanceof String) {
    if (!str) return str;
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  return '';
};

export default unaccent;
