import React from 'react';
import { render, userEvent } from '@testing-library/react';
import InProgressMeals from '../components/InProgressMeals';
import { fetchApiMeals } from '../service/APIs';
import mockDataDrinks from '../helpers/mockDataDrinks';
import Provider from '../contexts/MyProvider';

jest.mock('../service/APIs');
const routProgress = '/drinks/11007/in-progress';
describe('InProgressMeals', () => {
  test('should render the component correctly', async () => {
    fetchApiMeals.mockResolvedValue(mockDataDrinks);
    const { history } = renderWithRouter(
      <Provider>
        <InProgressMeals id="11007" />
      </Provider>,
    );

    history.push(routProgress);
    const { pathname } = history.location;
    expect(pathname).toBe(routProgress);

    const recipePhoto = await findByTestId('recipe-photo');
    expect(recipePhoto).toBeInTheDocument();

    const recipeTitle = await getByTestId('recipe-title');
    const shareBtn = await getByTestId('share-btn');
    const favoriteBtn = await getByTestId('favorite-btn');
    const recipeCategory = await getByTestId('recipe-category');
    const instructions = await getByTestId('instructions');
    const ingredientSteps = await getAllByTestId(/ingredient-step/i);
    const finishRecipeBtn = await getByTestId('finish-recipe-btn');

    expect(recipeTitle).toBeInTheDocument();
    expect(shareBtn).toBeInTheDocument();
    expect(favoriteBtn).toBeInTheDocument();
    expect(recipeCategory).toBeInTheDocument();
    expect(instructions).toBeInTheDocument();
    expect(ingredientSteps).toHaveLength(2);
    expect(finishRecipeBtn).toBeInTheDocument();
  });

  test('should check and uncheck ingredients', async () => {
    fetchApiMeals.mockResolvedValue(mockDataDrinks);

    const { getByTestId } = render(<InProgressMeals id="11007" />);

    const ingredientStep1 = getByTestId('0-ingredient-step');
    const ingredientStep2 = getByTestId('1-ingredient-step');

    userEvent.click(ingredientStep1);
    expect(ingredientStep1.firstChild.checked).toBeTruthy();

    userEvent.click(ingredientStep2);
    expect(ingredientStep2.firstChild.checked).toBeTruthy();

    userEvent.click(ingredientStep1);
    expect(ingredientStep1.firstChild.checked).toBeFalsy();
  });
});
