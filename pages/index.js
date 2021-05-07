import React from 'react';
import Image from 'next/image';
import { Container, Grid, Box, Heading, Text, Button, Link } from '@chakra-ui/react';

import Head from '../components/Head';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => (
  <>
    <Head title="imagineRio" />
    <Header />
    <section style={{ backgroundColor: '#F7F9FC', padding: '50px 0' }}>
      <Container>
        <Grid templateColumns="1fr 300px" columnGap="50px">
          <Box display="flex" alignItems="center">
            <Box>
              <Heading size="sm">Map</Heading>
              <Heading size="md">imagineRio</Heading>
              <Text my={10}>
                A searchable digital atlas that illustrates the social and urban evolution of Rio de
                Janeiro, as it existed and as it was imagined. Lorem ipsum dolor sit amet,
                consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
                dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo
                dolores et ea rebum. Stet clita kasd gubergren, no sea.
              </Text>
              <Link href="/map">
                <Button bgColor="#3C558E" color="white" px={10}>
                  View the map
                </Button>
              </Link>
            </Box>
          </Box>
          <Box p="40px" bgColor="black" position="relative" width="660px" borderRadius="20px">
            <Image src="/img/screenshot.png" width={660} height={430} />
          </Box>
        </Grid>
      </Container>
    </section>
    <section style={{ padding: '50px 0' }}>
      <Container>
        <Grid templateColumns="1fr 1fr" columnGap="50px">
          <Box>
            <Heading size="sm">Iconography</Heading>
            <Heading size="md">Views, maps, plans, aerials</Heading>
            <Text my={10}>
              Views, historical maps, and ground floor plans –from iconographic, cartographic, and
              architectural archives– are located in both time and space while their visual and
              spatial data are integrated across a number of databases and servers, including a
              public repository of images, a geographic information system, an open-source
              relational database, and a content delivery web system
            </Text>
            <Link href="/iconography">
              <Button bgColor="#3C558E" color="white" px={10}>
                Browse iconography
              </Button>
            </Link>
            <Box my={10}>
              <Image src="/img/image3.png" width={460} height={286} alt="imagineRio" />
            </Box>
            <Box my={10}>
              <Image src="/img/image.png" width={460} height={460} alt="imagineRio" />
            </Box>
          </Box>
          <Box>
            <Image src="/img/image1.png" width={460} height={460} alt="imagineRio" />
            <Box my={10}>
              <Image src="/img/image2.png" width={460} height={320} alt="imagineRio" />
            </Box>
            <Box my={10}>
              <Image src="/img/image4.png" width={460} height={320} alt="imagineRio" />
            </Box>
          </Box>
        </Grid>
      </Container>
    </section>
    <Footer />
  </>
);

export default Home;
