import React, {useState, useEffect, memo} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HeaderView from './src/components/Header/HeaderView';
import HomeView from './src/components/Home/HomeView';
import PersonView from './src/components/Person/PersonView';
import PersonDetail from './src/components/Person/PersonDetail';
import CountryView from './src/components/Country/CountryView';
import SourceView from './src/components/Source/SourceView';
import IndustryView from './src/components/Industry/IndustryView';
import ExchangeView from './src/components/Exchange/ExchangeView';
import CompanyView from './src/components/Exchange/CompanyView';
import FooterView from './src/components/Footer/FooterView';
import FileConstants from './src/utils/FileConstants';
import { MMKV } from 'react-native-mmkv';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [errorFlag, setErrorFlag] = useState(false);
  const Stack = createNativeStackNavigator();
  const AsyncStorage = new MMKV();

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#FFFFFF',
    },
  };

  const downloadPersonData = async () => {
    await fetch(FileConstants.API_ENDPOINT)
      .then(response => {
        if (response.ok) {
          console.log('Downloading data from remote url');
          return response.json();
        } else {
          throw new Error('Error!');
        }
      })
      .then(json => {
        saveDBPersonData(json.personList.personsLists); // save to DB
      })
      .catch(error => {
        setErrorFlag(true);
        console.error('Error fetching data:', errorFlag + '-' + error);
      });
  };

  const saveDBPersonData = async (personDataObject: any) => {
    try {
      AsyncStorage.set('personDataList', JSON.stringify(personDataObject));
      AsyncStorage.set('lastExecutionTimestamp', String(Date.now()));

      console.log('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  useEffect(() => {
    const downloadPersonDataDaily = async () => {
      try {
        const lastExecutionTimestamp = AsyncStorage.getString(
          'lastExecutionTimestamp',
        );
        const currentTimestamp = Date.now();

        if (
          !lastExecutionTimestamp ||
          currentTimestamp - Number(lastExecutionTimestamp) >=
            24 * 60 * 60 * 1000
        ) {
          console.log('Executing the daily operation...');
          await downloadPersonData();
          AsyncStorage.set(
            'lastExecutionTimestamp',
            String(currentTimestamp),
          );
        } else {
          console.log('Daily operation already executed today.');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const retrievePersonData = async () => {
      setIsLoading(true);
      await downloadPersonDataDaily();
      setIsLoading(false);
    };

    retrievePersonData();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.isLoading}>
        <ActivityIndicator size={'large'} color="#18A0FB" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Header" component={HeaderView} />
        <Stack.Screen name="Home" component={HomeView} />
        <Stack.Screen name="Exchange" component={ExchangeView} />
        <Stack.Screen name="Company" component={CompanyView} />
        <Stack.Screen name="Person" component={PersonView} />
        <Stack.Screen name="Person Detail" component={PersonDetail} />
        <Stack.Screen name="Country" component={CountryView} />
        <Stack.Screen name="Source" component={SourceView} />
        <Stack.Screen name="Industry" component={IndustryView} />
        <Stack.Screen name="Footer" component={FooterView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  isLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default memo(App);
