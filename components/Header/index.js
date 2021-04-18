import React from 'react';
import { Container, Flex, Spacer, HStack, Link } from '@chakra-ui/react';

const Header = () => (
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
        <Link href="/about">About</Link>
        <Link href="/people">People</Link>
        <Link href="/research">Research</Link>
        <Link href="/press">Press</Link>
        <Link href="/iconography">Iconography</Link>
        <Link href="/map">Map</Link>
      </HStack>
    </Flex>
  </Container>
);

export default Header;
