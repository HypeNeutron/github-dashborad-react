import React from 'react';
import styled from 'styled-components';
import { GithubContext } from '../context/context';
import { Pie3D, Column3D, Bar3D, Doughnut2D } from './Charts';

const Repos = () => {
  const { repos } = React.useContext(GithubContext);

  const languages = repos.reduce((obj, item) => {
    const { language, stargazers_count } = item;
    if (!language) return obj; //not have language return {} undefined

    obj[language] ??
      (obj[language] = { label: language, value: 1, stars: stargazers_count });

    obj[language] = {
      ...obj[language],
      value: obj[language].value + 1,
      stars: obj[language].stars + stargazers_count,
    };
    return obj;
  }, {});

  //# most used language-------
  const totalMostUsed = Object.values(languages).reduce(
    (acc, item) => (acc += item.value),
    0
  );

  const mostUsed = Object.values(languages).reduce((acc, item) => {
    let percentage = (item.value / totalMostUsed) * 100;
    acc[item.label] = { label: item.label, value: percentage };
    return acc;
  }, {});

  const mostUsedSorted = Object.values(mostUsed)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // First 5 language

  //# most stars per language----
  const mostStars = Object.values(languages).reduce((acc, item) => {
    acc[item.label] = { label: item.label, value: item.stars };
    return acc;
  }, {});

  const mostStarsSorted = Object.values(mostStars)
    .sort((a, b) => {
      return b.value - a.value;
    })
    .slice(0, 5); // First 5 language
  //# stars MostPopular and Most forks 5 language ----
  let { stars, forks } = repos.reduce(
    (acc, item) => {
      const { stargazers_count, name, forks } = item;
      acc.stars[stargazers_count] = { label: name, value: stargazers_count };
      acc.forks[forks] = { label: name, value: forks };
      return acc;
    },
    { stars: {}, forks: {} }
  );

  stars = Object.values(stars).slice(-5).reverse();
  forks = Object.values(forks).slice(-5).reverse();

  return (
    <section className="section">
      <Wrapper className="section-center">
        <Pie3D data={mostUsedSorted} />
        <Column3D data={stars} />
        <Doughnut2D data={mostStarsSorted} />
        <Bar3D data={forks} />
      </Wrapper>
    </section>
  );
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;