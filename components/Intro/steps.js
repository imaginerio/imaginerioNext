import React from 'react';
import { Heading, UnorderedList, ListItem, Text } from '@chakra-ui/react';

const steps = [
  {
    element: '.intro___timeline',
    heading: {
      en: 'Timeline',
      pt: 'Linha do Tempo',
    },
    text: {
      en: [
        'The horizontal timeline controls the date of the map and images.',
        'Drag the middle slider to adjust the year of the map.',
        'Drag the outer circular sliders to filter images by first and last year.',
      ],
      pt: [
        'A linha do tempo controla a data do mapa e das imagens.',
        'Arraste o ponteiro central para ajustar o ano do mapa.',
        'Arraste os ponteiros laterais para filtrar as imagens por ano inicial e final.',
      ],
    },
    position: 'bottom',
  },
  {
    element: '.intro___images',
    heading: {
      en: 'Image Pane',
      pt: 'Painel de Imagens',
    },
    text: {
      en: 'The image pane displays filtered results (by date, by region, and text search).',
      pt: 'O painel de imagens mostra o resultado dos filtros (por data, por região, e por texto).',
    },
  },
  {
    element: '.intro___images___search',
    heading: {
      en: 'Search, Filter, and Display Options',
      pt: 'Opções de busca, filtros e modo de exibição',
    },
    text: {
      en: 'Search, filter, and display images by grid, title, or tile view',
      pt: 'Busque, filtre e exiba as imagens em lista de miniaturas, de títulos ou mosaico.',
    },
  },
  {
    element: '.intro___atlas .mapboxgl-map',
    heading: {
      en: 'Map Pane',
      pt: 'Painel do Mapa',
    },
    text: {
      en: 'The map pane adjusts to the selected year.',
      pt: 'O painel do mapa mostra o ano selecionado.',
    },
  },
  {
    element: '.intro___atlas___legend',
    heading: {
      en: 'Map Legend',
      pt: 'Legenda',
    },
    text: {
      en: [
        'Click the tab to view the map legend, search polygons, and customize the map.',
        'Right click+drag or hold shift+drag to rotate and tilt the map.',
      ],
      pt: [
        'Clique na aba para ver a legenda, buscar polígonos e customizar o mapa.',
        'Mantenha o botão direito ou a tecla shift pressionados e arraste o mouse para girar e inclinar o mapa.',
      ],
    },
  },
];

const makeIntro = (step, language) => {
  const heading = (
    <Heading mt={-30} mb={10}>
      {step.heading[language]}
    </Heading>
  );
  let text;
  if (Array.isArray(step.text[language])) {
    text = (
      <UnorderedList>
        {step.text[language].map(t => (
          <ListItem key={t}>{t}</ListItem>
        ))}
      </UnorderedList>
    );
  } else {
    text = <Text>{step.text[language]}</Text>;
  }
  return (
    <>
      {heading}
      {text}
    </>
  );
};

const getSteps = (language = 'en') =>
  steps.map(step => ({
    ...step,
    intro: step.intro || makeIntro(step, language),
  }));

export default getSteps;
