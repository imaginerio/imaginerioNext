import React from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Flex,
  Spacer,
  Stack,
  HStack,
  Link,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

import pages from '../../assets/config/pages';
import translations from '../../assets/config/translations';

const HeaderLinks = () => {
  const { locale, asPath } = useRouter();
  return (
    <>
      <Link
        variant="header"
        href={`/${locale}`}
        textDecoration={asPath === '/' ? 'underline' : 'none'}
      >
        {translations.home[locale]}
      </Link>
      {Object.keys(pages[locale])
        .filter(p => pages[locale][p].menu)
        .map(page => (
          <Link
            variant="header"
            key={page}
            href={`/${locale}/${page}`}
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
    </>
  );
};

const Header = () => {
  const { locale } = useRouter();
  return (
    <Container maxW="6xl">
      <Flex h="90px" alignItems="center">
        <Link href={`/${locale}`} display="inherit" pos="relative" top="4px">
          <img
            src="/svg/rio-logo.svg"
            style={{ width: 150, cursor: 'pointer' }}
            alt="ImagineRio Logo"
          />
        </Link>
        <Spacer />
        <HStack spacing={30} display={['none', 'block']}>
          <HeaderLinks />
        </HStack>
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<HamburgerIcon />}
            variant="outline"
            colorScheme="blackAlpha"
            display={['block', 'none']}
          />
          <MenuList>
            <Stack mx={5}>
              <HeaderLinks />
            </Stack>
          </MenuList>
        </Menu>
      </Flex>
    </Container>
  );
};

export default Header;
