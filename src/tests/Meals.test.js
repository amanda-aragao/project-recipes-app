import React from 'react';
import { screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouter from '../helpers/renderWithRouter';
import Provider from '../contexts/MyProvider';
import mockMealsFirstLetterW from '../helpers/mockMealFirtsLetterW';
import Meals from '../pages/Meals';
import mealCategories from '../../cypress/mocks/mealCategories';
import mockDataMeals from '../helpers/mockDataMeals';

const testIdInput = 'search-input';
const testIdSearchButton = 'exec-search-btn';
const routDetail = '/meals/52940';

async function fetchData() {
  const response = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=52940');
  const data = await response.json();
  return data;
}
describe('Testa página Meals', () => {
  test('teste se os elementos na tela de Meals estão sendo renderizados', async () => {
    const { history } = renderWithRouter(
      <Provider>
        <Meals />
      </Provider>,
    );

    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(mealCategories) }));
    act(() => {
      history.push('/meals');
    });

    const buttonBeef = await screen.findByRole('button', { name: /beef/i });
    const buttonBreakfest = await screen.getByRole('button', { name: /breakfast/i });
    const buttonChicken = await screen.getByRole('button', { name: /chicken/i });
    const buttonDessert = await screen.getByRole('button', { name: /dessert/i });
    const buttonGoat = await screen.getByRole('button', { name: /goat/i });
    const buttonAll = await screen.getByRole('button', { name: /all/i });
    const recipeCardDrink = await screen.findByTestId('0-recipe-card');
    expect(recipeCardDrink).toBeInTheDocument();
    const recipeCardDrink11 = await screen.findByTestId('11-recipe-card');
    expect(recipeCardDrink11).toBeInTheDocument();
    const cardImage0 = await screen.findByTestId('0-card-img');
    const cardImage11 = await screen.findByTestId('11-card-img');
    const titleDrink0 = await screen.findByTestId('0-card-name');
    const titleDrink11 = await screen.findByTestId('11-card-name');

    expect(buttonBeef).toBeInTheDocument();
    expect(buttonBreakfest).toBeInTheDocument();
    expect(buttonChicken).toBeInTheDocument();
    expect(buttonDessert).toBeInTheDocument();
    expect(buttonGoat).toBeInTheDocument();
    expect(buttonAll).toBeInTheDocument();
    expect(cardImage0).toBeInTheDocument();
    expect(cardImage11).toBeInTheDocument();
    expect(titleDrink0).toBeInTheDocument();
    expect(titleDrink11).toBeInTheDocument();
  });
  test('teste se o resultado dos filtro first letter está certo', async () => {
    const { history } = renderWithRouter(
      <Provider>
        <Meals />
      </Provider>,
    );

    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(mockMealsFirstLetterW) }));

    act(() => {
      history.push('/meals');
    });
    const buttonSearchImg = screen.getByRole('img', { name: /search/i });
    userEvent.click(buttonSearchImg);
    const inputSearch = await screen.findByTestId(testIdInput);
    const radioFirstLetter = await screen.findByRole('radio', { name: /first letter/i });

    userEvent.click(radioFirstLetter);
    userEvent.type(inputSearch, 'w');
    expect(inputSearch).toHaveValue('w');
    const buttonSearch = screen.getByTestId(testIdSearchButton);
    userEvent.click(buttonSearch);
    const endPointMeals = 'https://www.themealdb.com/api/json/v1/1/search.php?f=w';
    expect(fetch).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledWith(endPointMeals);

    const cardImage0 = await screen.findByRole('img', { name: /white chocolate creme brulee/i });
    const cardImage1 = await screen.findByRole('img', { name: /wontons/i });
    const cardImage2 = await screen.findByTestId('2-card-img');
    const title0 = await screen.getByText(/white chocolate creme brulee/i);
    const title1 = await screen.getByText(/wontons/i);
    const title2 = await screen.getByText(/walnut roll gužvara/i);

    expect(cardImage0).toBeInTheDocument();
    expect(cardImage1).toBeInTheDocument();
    expect(cardImage2).toBeInTheDocument();
    expect(title0).toBeInTheDocument();
    expect(title1).toBeInTheDocument();
    expect(title2).toBeInTheDocument();
  });

  test('teste se os compononentes da tela de detalhes.', async () => {
    const { history } = renderWithRouter(
      <Provider>
        <Meals />
      </Provider>,

    );
    jest.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockDataMeals,
    });

    const data = await fetchData();

    expect(data).toEqual(mockDataMeals);

    history.push(routDetail);
    const { pathname } = history.location;
    expect(pathname).toBe('/meals/52940');

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
      expect(title).toHaveValue('Brown Stew Chicken');

      expect(imgRecipe).toBeInTheDocument();
      expect(video).toBeInTheDocument();
      expect(instructions).toBeInTheDocument();

      expect(ingredient1).toBeInTheDocument();
      expect(ingredient1).toHaveValue('Chicken');

      expect(ingredient2).toBeInTheDocument();
      expect(ingredient2).toHaveValue('Tomato');

      expect(titleRecommedation1).toBeInTheDocument();
      expect(recommendation1).toBeInTheDocument();

      expect(titleRecommendation2).toBeInTheDocument();
      expect(recommendation2).toBeInTheDocument();

      expect(buttonStart).toBeInTheDocument();
      expect.toHaveValue('Start');
    });
  });
});
