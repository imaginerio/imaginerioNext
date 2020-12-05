import { some } from 'lodash';

const addRequiredKeys = (metadata, keys) => {
  keys.forEach(label => {
    if (!some(metadata, m => m.label === label)) {
      metadata.push({ label, value: null });
    }
  });
  return metadata;
};

export default manifest => {
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
