import { some } from 'lodash';

const addRequiredKeys = (metadata, keys) => {
  keys.forEach(label => {
    if (!some(metadata, m => m.label === label)) {
      metadata.push({ label, value: null });
    }
  });
  return metadata;
};

const iiif = manifest => {
  let metadata = [];
  manifest.forEach(m => {
    if (m.label && m.value) {
      const label = m.label.none ? m.label.none[0] : m.label['pt-br'][0];
      const value = m.value.none ? m.value.none[0] : m.value['pt-br'][0];
      metadata.push({ label, value });
    }
  });
  metadata = addRequiredKeys(metadata, ['Title', 'Description', 'Identifier']);

  return metadata;
};

const findByLabel = (collection, label) => {
  const value = collection.find(m => m.label.match(new RegExp(label, 'gi')));
  if (value) return value.value;
  return null;
};

export { iiif, findByLabel };
