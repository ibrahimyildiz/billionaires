import React from 'react';
import HomeView from '../Home/HomeView';

const PersonView = ({ route, navigation }) => {

  return (
      <HomeView route = {route} navigation = {navigation}  />
  );
};

export default PersonView;
