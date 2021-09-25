import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/pro-regular-svg-icons';
import { faExternalLink } from '@fortawesome/pro-solid-svg-icons';
import { Grid, Container, Box } from '@chakra-ui/react';

import ImageSearch from '../ImageSearch';
import ImageFilter from '../ImageFilter';
import ImageSort from '../ImageSort';
import ViewButtons from '../ViewButtons';
import ImageViewer from '../ImageViewer';

import { useImages } from '../../providers/ImageContext';

const Mirador = dynamic(() => import('../Mirador'), { ssr: false });

const ImageController = ({ imageWidth, height }) => {
  const [{ selectedImage }, dispatch] = useImages();

  return (
    <Box zIndex={10} boxShadow="2px 0 3px rgba(0,0,0,0.15)" pos="relative" backgroundColor="white">
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
          <Box
            float="right"
            pos="absolute"
            top="13px"
            right="50px"
            color="#666"
            cursor="pointer"
            zIndex={12}
            _hover={{
              color: 'black',
            }}
          >
            <Link href={`/iconography/${selectedImage.collection}/${selectedImage.ssid}`}>
              <FontAwesomeIcon icon={faExternalLink} width="20px" />
            </Link>
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
                  manifestId: `${process.env.NEXT_PUBLIC_IIIF}/${selectedImage.ssid}/manifest`,
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
  );
};

ImageController.propTypes = {
  imageWidth: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

ImageController.defaultProps = {};

export default ImageController;
