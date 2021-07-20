import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Container, Grid, Box, Heading, Text } from '@chakra-ui/react';

import pages from '../../assets/config/pages';
import translations from '../../assets/config/translations';

const ContactColumn = () => (
  <Box>
    <Heading size="md">imagineRio</Heading>
    <Text>
      Spatial Studies Lab
      <br />
      Rice University
      <br />
      Baker Hall 264, 6100 Main St
      <br />
      Houston, TX 77005
      <br />
      United States
    </Text>
  </Box>
);

const NavigationColumn = () => {
  const { locale } = useRouter();
  return (
    <Box>
      <Heading size="md">Menu</Heading>
      <Text>
        <Link href="/">{translations.home[locale]}</Link>
      </Text>
      {Object.keys(pages[locale]).map(page => (
        <Text key={page}>
          <Link href={`${page}`} style={{ textTransform: 'capitalize' }}>
            {page}
          </Link>
        </Text>
      ))}
      <Text>
        <Link href={`/${locale}/iconography`}>{translations.iconography[locale]}</Link>
      </Text>
      <Text>
        <Link href={`/${locale}/map`}>{translations.map[locale]}</Link>
      </Text>
    </Box>
  );
};

const Footer = () => {
  const { locale } = useRouter();
  return (
    <section style={{ backgroundColor: '#F7F9FC', padding: '50px 0' }}>
      <Container>
        <Grid templateColumns="1fr repeat(4, 150px)" columnGap="40px">
          <ContactColumn />
          <Box>
            <Heading size="md">{translations.language[locale]}</Heading>
            <Text>
              <Link href="/en">English</Link>
            </Text>
            <Text>
              <Link href="/pt">Português</Link>
            </Text>
          </Box>
          <NavigationColumn />
          <Box>
            <Heading size="md">Legal</Heading>
            <Text>Facebook</Text>
            <Text>Twitter</Text>
            <Text>Instagram</Text>
          </Box>
          <Box>
            <Heading size="md">{translations.contact[locale]}</Heading>
            <Text>
              <Link href="mailto:imaginerio@rice.edu" textTransform="none">
                imaginerio@rice.edu
              </Link>
            </Text>
            <Text>
              <Link href="https://forum.imaginerio.org" target="_blank">
                {translations.forum[locale]}
              </Link>
            </Text>
          </Box>
        </Grid>
      </Container>
    </section>
  );
};

export default Footer;
