import React from 'react';
import { useRouter } from 'next/router';
import { FiSearch, FiXCircle } from 'react-icons/fi';
import { InputGroup, Input, InputRightElement, InputLeftElement } from '@chakra-ui/react';

import { useImages } from '../../providers/ImageContext';
import translation from '../../assets/config/translations';

const ImageSearch = () => {
  const { locale } = useRouter();
  const [{ query }, dispatch] = useImages();

  return (
    <InputGroup gridColumn={['1 / 3', '1']}>
      <InputLeftElement>
        <FiSearch />
      </InputLeftElement>
      <Input
        value={query}
        onChange={({ target: { value } }) => dispatch(['QUERY', value])}
        placeholder={`${translation.searchImages[locale]}...`}
      />
      <InputRightElement>
        {query && (
          <FiXCircle
            color="#666"
            onClick={() => dispatch(['QUERY', ''])}
            style={{ cursor: 'pointer' }}
          />
        )}
      </InputRightElement>
    </InputGroup>
  );
};

export default ImageSearch;
