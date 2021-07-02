import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Grid, Container, Flex, Box, Link } from '@chakra-ui/react';

import Head from '../../components/Head';
import Timeline from '../../components/Timeline';
import GridResizable from '../../components/GridResizable';
import ImageSearch from '../../components/ImageSearch';
import ImageFilter from '../../components/ImageFilter';
import ImageSort from '../../components/ImageSort';
import ViewButtons from '../../components/ViewButtons';
import ImageViewer from '../../components/ImageViewer';

import { useImages } from '../../providers/ImageContext';
import useWindowDimensions from '../../utils/useWindowDimensions';

const Mirador = dynamic(() => import('../../components/Mirador'), { ssr: false });
const AtlasController = dynamic(() => import('../../components/AtlasController'), { ssr: false });

const Atlas = ({ images }) => {
  let height = 800;
  let width = 1000;
  if (typeof window !== 'undefined') ({ height, width } = useWindowDimensions());
  height -= 90;

  const [{ selectedImage }, dispatch] = useImages();
  useEffect(() => {
    dispatch(['SET_ALL_IMAGES', images]);
    dispatch(['SET_USE_LINKS', false]);
  }, []);

  const [imageWidth, setImageWidth] = useState(500);

  useEffect(() => {
    if (imageWidth <= 400) {
      dispatch(['SET_SIZE', 'grid']);
    }
  }, [imageWidth]);

  return (
    <>
      <Head title="Map" />
      <Grid
        h="90px"
        pos="relative"
        templateColumns="170px 1fr"
        p={4}
        boxShadow="0 2px 3px rgba(0,0,0,0.15)"
        zIndex={12}
      >
        <Link href="/" display="inherit">
          <Flex alignItems="center" borderRight="1px solid #ccc" pr={5} mr={5}>
            <img
              src="/svg/rio-logo.svg"
              style={{ width: 150, cursor: 'pointer' }}
              alt="ImagineRio Logo"
            />
          </Flex>
        </Link>
        <Timeline min={1500} max={2020} triple />
      </Grid>
      <Box h="calc(100vh - 90px)">
        <GridResizable
          initialWidth={imageWidth}
          handler={setImageWidth}
          minWidth={200}
          maxWidth={width * 0.75}
        >
          <Box
            zIndex={10}
            boxShadow="2px 0 3px rgba(0,0,0,0.15)"
            pos="relative"
            backgroundColor="white"
          >
            {selectedImage ? (
              <Box h="100%">
                <Box
                  pos="absolute"
                  top="13px"
                  left="15px"
                  color="#666"
                  cursor="pointer"
                  zIndex={12}
                  _hover={{
                    color: 'black',
                  }}
                  onClick={() => dispatch(['SET_SELECTED_IMAGE', null])}
                >
                  <FontAwesomeIcon icon={faTimesCircle} width="20px" />
                </Box>
                <Mirador
                  config={{
                    id: 'mirador',
                    window: {
                      allowClose: false, // Configure if windows can be closed or not
                      allowFullscreen: true, // Configure to show a "fullscreen" button in the WindowTopBar
                      allowMaximize: false, // Configure if windows can be maximized or not
                      allowTopMenuButton: false,
                    },
                    workspace: {
                      showZoomControls: true,
                      allowNewWindows: false,
                    },
                    workspaceControlPanel: {
                      enabled: false,
                    },
                    windows: [
                      {
                        manifestId: `https://images.imaginerio.org/iiif/3/${selectedImage.ssid}/manifest`,
                      },
                    ],
                  }}
                  style={{ position: 'relative', width: '100%', height: '100%' }}
                />
              </Box>
            ) : (
              <Box pt="20px">
                {imageWidth >= 400 && (
                  <Container>
                    <Grid templateColumns="1fr 40px 125px" gap={5} mb={2}>
                      <ImageSearch hideIcon />
                      <ImageFilter />
                      <ViewButtons />
                    </Grid>
                  </Container>
                )}
                <ImageViewer
                  height={imageWidth >= 400 ? height - 100 : height - 55}
                  width={imageWidth}
                  noLink
                  control={<ImageSort small collection />}
                />
              </Box>
            )}
          </Box>
          <AtlasController width={width - imageWidth} height={height} />
        </GridResizable>
      </Box>
    </>
  );
};

Atlas.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export async function getStaticProps({ params }) {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_SEARCH_API}/documents`);
  const images = data.reduce(
    (memo, d) => [
      ...memo,
      ...d.Documents.map(img => ({ ...img, collection: d.title.toLowerCase() })),
    ],
    []
  );
  return { props: { images, ...params } };
}

export default Atlas;
