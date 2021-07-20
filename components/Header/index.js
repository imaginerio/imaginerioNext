import React from 'react';
import { useRouter } from 'next/router';
import { Container, Flex, Spacer, HStack, Link } from '@chakra-ui/react';

import pages from '../../assets/config/pages';
import translations from '../../assets/config/translations';

const Header = () => {
  const { locale, asPath } = useRouter();
  return (
    <Container maxW="6xl">
      <Flex h="90px" align="middle">
        <Link href="/" display="inherit">
          <img
            src="/svg/rio-logo.svg"
            style={{ width: 150, cursor: 'pointer' }}
            alt="ImagineRio Logo"
          />
        </Link>
        <Spacer />
        <HStack spacing={30}>
          <Link variant="header" href="/" textDecoration={asPath === '/' ? 'underline' : 'none'}>
            {translations.home[locale]}
          </Link>
          {Object.keys(pages[locale])
            .filter(p => pages[locale][p].menu)
            .map(page => (
              <Link
                variant="header"
                key={page}
                href={page}
                textDecoration={asPath.match(page) ? 'underline' : 'none'}
              >
                {pages[locale][page].title}
              </Link>
            ))}
          <Link variant="header" href="https://narratives.imaginerio.org">
            Narratives
          </Link>
          <Link
            variant="header"
            href={`/${locale}/iconography`}
            textDecoration={asPath.match(/iconography/) ? 'underline' : 'none'}
          >
            {translations.iconography[locale]}
          </Link>
          <Link variant="header" href={`/${locale}/map`}>
            {translations.map[locale]}
          </Link>
        </HStack>
      </Flex>
    </Container>
  );
};

export default Header;
