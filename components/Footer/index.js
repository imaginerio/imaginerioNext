import React from 'react';
import Link from 'next/link';
import { Container, Grid, Box, Heading, Text } from '@chakra-ui/react';

const Footer = () => (
  <section style={{ backgroundColor: '#F7F9FC', padding: '50px 0' }}>
    <Container maxW="5xl">
      <Grid templateColumns="1fr repeat(3, 150px)" columnGap="40px">
        <Box>
          <Heading size="md">imagineRio</Heading>
          <Text>
            1234 Street Address
            <br />
            Houston, TX
            <br />
            12345
            <br />
            United States
          </Text>
        </Box>
        <Box>
          <Heading size="md">Menu</Heading>
          <Text>
            <Link href="/">Home</Link>
          </Text>
          <Text>
            <Link href="/about">About</Link>
          </Text>
          <Text>
            <Link href="/people">People</Link>
          </Text>
          <Text>
            <Link href="/research">Research</Link>
          </Text>
          <Text>
            <Link href="/press">Press</Link>
          </Text>
          <Text>
            <Link href="/iconography">Iconography</Link>
          </Text>
          <Text>
            <Link href="/map">Map</Link>
          </Text>
        </Box>
        <Box>
          <Heading size="md">Social Media</Heading>
          <Text>Facebook</Text>
          <Text>Twitter</Text>
          <Text>Instagram</Text>
        </Box>
        <Box>
          <Heading size="md">Contact</Heading>
          <Text>Email</Text>
          <Text>Phone</Text>
        </Box>
      </Grid>
    </Container>
  </section>
);

export default Footer;
