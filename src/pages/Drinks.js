import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import context from '../contexts/MyContext';
import CardsDrinks from '../components/CardsDrinks';
import CategoryButtons from '../components/CategoryButtons';

function Drinks() {
  const { filterData, dataDrinks, categoryDrinks } = useContext(context);
  const history = useHistory();

  useEffect(() => {
    const verifyData = () => {
      if (filterData.length === 1) {
        history.push(`/drinks/${filterData[0].idDrink}`);
      }
    };
    verifyData();
  }, [filterData, history]);

  const verifyFilterResults = () => {
    if (filterData.length > 1) {
      return <CardsDrinks data={ filterData } />;
    }
  };

  return (
    <div>
      <Header title="Drinks" searchIcon />
      <CategoryButtons data={ categoryDrinks } />
      {filterData.length !== 0 ? verifyFilterResults()
        : <CardsDrinks data={ dataDrinks } />}
      <Footer />
    </div>
  );
}

export default Drinks;
