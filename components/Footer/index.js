import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Container, Grid, Box, Heading, Text } from '@chakra-ui/react';

import pages from '../../assets/config/pages';

const ContactColumn = () => (
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
);

const NavigationColumn = locale => (
  <Box>
    <Heading size="md">Menu</Heading>
    <Text>
      <Link href="/">Home</Link>
    </Text>
    {Object.keys(pages[locale]).map(page => (
      <Text key={page}>
        <Link href={`${page}`} style={{ textTransform: 'capitalize' }}>
          {page}
        </Link>
      </Text>
    ))}
    <Text>
      <Link href={`/${locale}/iconography`}>Iconography</Link>
    </Text>
    <Text>
      <Link href={`/${locale}/map`}>Map</Link>
    </Text>
  </Box>
);

const Footer = () => {
  const { locale } = useRouter();
  return (
    <section style={{ backgroundColor: '#F7F9FC', padding: '50px 0' }}>
      <Container>
        <Grid templateColumns="1fr repeat(3, 150px)" columnGap="40px">
          <ContactColumn />
          <NavigationColumn locale={locale} />
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
};

export default Footer;
