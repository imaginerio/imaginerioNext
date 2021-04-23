import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import { Container, Grid, Flex, Box, Heading, Text, Link } from '@chakra-ui/react';

const ImageRow = ({
  style,
  collection,
  ssid,
  title,
  width: rawWidth,
  height: rawHeight,
  creator,
  date,
  source,
  thumbnail,
}) => {
  let imgHeight = 150;
  let imgWidth = 300;
  if (rawWidth) imgWidth = Math.round((150 / rawHeight) * rawWidth);
  if (imgWidth > 400) {
    imgWidth = 400;
    if (rawHeight) imgHeight = Math.round((400 / rawWidth) * rawHeight);
  }
  return (
    <div style={style}>
      <Container maxW="5xl">
        <Grid
          templateColumns={`minmax(0, 1fr) ${imgWidth ? `${imgWidth}px` : '40%'}`}
          columnGap="40px"
          key={ssid}
          pb="30px"
          mb="30px"
          minH="150px"
          borderBottom="1px solid rgba(0,0,0,0.1)"
        >
          <Flex flexDirection="column" justifyContent="center">
            <Heading size="md" mt={0} variant="oneline">
              <Link href={`/iconography/${collection}/${ssid}`}>
                {title.length > 150 ? `${title.substr(0, title.lastIndexOf(' ', 150))}...` : title}
              </Link>
            </Heading>
            <Box>
              {creator && (
                <Text>
                  <b>Creator: </b>
                  {creator}
                </Text>
              )}
              {date && (
                <Text>
                  <b>Date: </b>
                  {date}
                </Text>
              )}
              {source && (
                <Text variant="oneline">
                  <b>Source: </b>
                  <Link href={source.link}>{source.value || source.link}</Link>
                </Text>
              )}
            </Box>
          </Flex>
          <Flex align="center" justify="flex-end">
            <Box w={`${imgWidth}px`} h={`${imgHeight}px`}>
              <Image src={thumbnail} height={imgHeight} width={imgWidth} />
            </Box>
          </Flex>
        </Grid>
      </Container>
    </div>
  );
};

ImageRow.propTypes = {
  style: PropTypes.shape().isRequired,
  collection: PropTypes.string.isRequired,
  ssid: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  creator: PropTypes.string,
  date: PropTypes.string,
  source: PropTypes.shape(),
  thumbnail: PropTypes.string.isRequired,
};

ImageRow.defaultProps = {
  width: null,
  height: null,
  creator: null,
  date: null,
  source: null,
};

export default ImageRow;
