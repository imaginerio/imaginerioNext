import React from 'react';
import { useRouter } from 'next/router';
import { Container, Grid, Box, Heading, Text, HStack, Image, Link } from '@chakra-ui/react';

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
      {Object.keys(pages[locale])
        .filter(p => pages[locale][p].menu)
        .map(page => (
          <Text key={page}>
            <Link href={`${page}`}>{pages[locale][page].title}</Link>
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
        <Grid templateColumns="1fr repeat(4, 140px)" columnGap="5px" fontSize={14}>
          <ContactColumn />
          <NavigationColumn />
          <Box>
            <Heading size="md">{translations.language[locale]}</Heading>
            <Text>
              <Link href="/en">English</Link>
            </Text>
            <Text>
              <Link href="/pt">Português</Link>
            </Text>
          </Box>
          <Box>
            <Heading size="md">Legal</Heading>
            {Object.keys(pages[locale])
              .filter(p => !pages[locale][p].menu)
              .map(page => (
                <Text key={page}>
                  <Link href={`${page}`}>{pages[locale][page].title}</Link>
                </Text>
              ))}
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
        <HStack borderTop="1px solid #eee" mt={5}>
          <a href="https://spatialstudieslab.rice.edu/" target="_blank" rel="noreferrer">
            <Image src="/img/logos/rice.png" h="45px" mr={5} />
          </a>
          <a href="https://www.axismaps.com" target="_blank" rel="noreferrer">
            <Image src="/img/logos/axis.png" h="80px" mr={5} />
          </a>
          <a href="https://ims.com.br" target="_blank" rel="noreferrer">
            <Image src="/img/logos/ims.png" h="80px" mr={5} />
          </a>
        </HStack>
      </Container>
    </section>
  );
};

export default Footer;
