import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Container, Flex, Spacer, HStack } from '@chakra-ui/react';

import pages from '../../assets/config/pages';

const Header = () => {
  const { locale } = useRouter();
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
          <Link href="/">Home</Link>
          {Object.keys(pages[locale]).map(page => (
            <Link key={page} href={`${page}`}>
              {pages[locale][page].title}
            </Link>
          ))}
          <Link href={`/${locale}/iconography`}>Iconography</Link>
          <Link href={`/${locale}/map`}>Map</Link>
        </HStack>
      </Flex>
    </Container>
  );
};

export default Header;
