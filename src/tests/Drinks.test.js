import React from 'react';
import { screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import drinkCategories from '../../cypress/mocks/drinkCategories';
import renderWithRouter from '../helpers/renderWithRouter';
import Provider from '../contexts/MyProvider';
import mockDataDrinks from '../helpers/mockDataDrinks';
import Drinks from '../pages/Drinks';
import mockDrinksFirstLetter from '../helpers/MockDrinksFirstLetter';

const testIdInput = 'search-input';
const testIdSearchButton = 'exec-search-btn';
async function fetchData() {
  const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=11007');
  const data = await response.json();
  return data;
}

const routDetail = '/drinks/11007';

describe('Testa página Drinks', () => {
  test('teste se os elementos na tela de Drinks estão sendo renderizados', async () => {
    const { history } = renderWithRouter(
      <Provider>
        <Drinks />
      </Provider>,
    );

    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(drinkCategories) }));
    act(() => {
      history.push('/drinks');
    });

    const buttonOrdinary = await screen.findByRole('button', {
      name: /ordinary drink/i,
    });
    const buttonCocktail = await screen.getByRole('button', { name: /cocktail/i });
    const buttonShake = await screen.getByRole('button', { name: /shake/i });
    const buttonOther = await screen.getByRole('button', { name: /other \/ unknown/i });
    const buttonCocoa = await screen.getByRole('button', { name: /cocoa/i });
    const buttonAll = await screen.getByRole('button', { name: /all/i });

    const recipeCardDrink = await screen.findByTestId('0-recipe-card');
    expect(recipeCardDrink).toBeInTheDocument();

    const recipeCardDrink11 = await screen.findByTestId('11-recipe-card');
    expect(recipeCardDrink11).toBeInTheDocument();

    const cardImage0 = await screen.findByTestId('0-card-img');
    const cardImage11 = await screen.findByTestId('11-card-img');
    const titleDrink0 = await screen.findByTestId('0-card-name');
    const titleDrink11 = await screen.findByTestId('11-card-name');

    expect(buttonOrdinary).toBeInTheDocument();
    expect(buttonCocktail).toBeInTheDocument();
    expect(buttonShake).toBeInTheDocument();
    expect(buttonOther).toBeInTheDocument();
    expect(buttonCocoa).toBeInTheDocument();
    expect(buttonAll).toBeInTheDocument();
    expect(cardImage0).toBeInTheDocument();
    expect(cardImage11).toBeInTheDocument();
    expect(titleDrink0).toBeInTheDocument();
    expect(titleDrink11).toBeInTheDocument();
  });
  test('teste se o resultado dos filtro first letter está certo', async () => {
    const { history } = renderWithRouter(
      <Provider>
        <Drinks />
      </Provider>,
    );

    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(mockDrinksFirstLetter) }));

    act(() => {
      history.push('/drinks');
    });
    const buttonSearchImg = screen.getByRole('img', { name: /search/i });
    userEvent.click(buttonSearchImg);
    const radioFirstLetter = await screen.findByRole('radio', { name: /first letter/i });
    const inputSearch = await screen.findByTestId(testIdInput);

    userEvent.click(radioFirstLetter);
    userEvent.type(inputSearch, 'y');
    expect(inputSearch).toHaveValue('y');
    const buttonSearch = screen.getByTestId(testIdSearchButton);
    userEvent.click(buttonSearch);
    const endPoint = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?f=y';
    expect(fetch).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledWith(endPoint);

    const drink1Img = await screen.findByRole('img', {
      name: /yellow bird/i,
    });
    const drink2Img = await screen.findByRole('img', {
      name: /yoghurt cooler/i,
    });
    expect(drink1Img).toBeInTheDocument();
    expect(drink2Img).toBeInTheDocument();
  });

  test('teste se os compononentes da tela de detalhes.', async () => {
    const { history } = renderWithRouter(
      <Provider>
        <Drinks />
      </Provider>,

    );
    jest.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockDataDrinks,
    });

    const data = await fetchData();

    expect(data).toEqual(mockDataDrinks);

    history.push(routDetail);
    const { pathname } = history.location;
    expect(pathname).toBe(routDetail);

    act(async () => {
      const title = await screen.findByTestId('recipe-photo');
      const imgRecipe = await screen.findByTestId('recipe-photo');
      const video = await screen.findByText(/click me/i);
      const instructions = await screen.getByTestId('instructions');
      const ingredient1 = await screen.findByTestId('0-ingredient-name-and-measure');
      const ingredient2 = await screen.findByTestId('1-ingredient-name-and-measure');
      const recommendation1 = await screen.getByTestId('0-recommendation-card');
      const recommendation2 = await screen.getByTestId('1-recommendation-card');
      const titleRecommedation1 = await screen.getByRole('heading', { name: /gg/i });
      const titleRecommendation2 = await screen.getByRole('heading', { name: /a1/i });

      const buttonStart = await screen.getByRole('button', { name: /start/i });

      expect(title).toBeInTheDocument();
      expect(title).toHaveValue('Margarita');

      expect(imgRecipe).toBeInTheDocument();
      expect(video).toBeInTheDocument();
      expect(instructions).toBeInTheDocument();

      expect(ingredient1).toBeInTheDocument();
      expect(ingredient1).toHaveValue('Tequila');

      expect(ingredient2).toBeInTheDocument();
      expect(ingredient2).toHaveValue('Salt');

      expect(titleRecommedation1).toBeInTheDocument();
      expect(recommendation1).toBeInTheDocument();

      expect(titleRecommendation2).toBeInTheDocument();
      expect(recommendation2).toBeInTheDocument();

      expect(buttonStart).toBeInTheDocument();
      expect.toHaveValue('Start');
    });
  });
});
