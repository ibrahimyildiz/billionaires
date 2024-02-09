import React, {useState, useEffect, memo} from 'react';
import {View, Text, FlatList, TouchableOpacity, ActivityIndicator} from 'react-native';
import HeaderView from '../Header/HeaderView';
import FooterView from '../Footer/FooterView';
import CountryStyles from './CountryStyles';
import AppStyles from '../../styles/AppStyles';
import {useNavigation} from '@react-navigation/native';
import CountryFlag from 'react-native-country-flag';
import filter from 'lodash.filter';
import { MMKV } from 'react-native-mmkv';

const CountryView = params => {
  const navigation = useNavigation();
  const [fetchCountryData, setFetchCountryData] = useState([]);
  const [searchCountryData, setSearchCountryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const countryLookup = require('country-code-lookup');
  const AsyncStorage = new MMKV();

  useEffect(() => {
    setIsLoading(true);
    setSearchCountryData('');

    const loadPersonData = async () => {
      try {
        const data = await AsyncStorage.getString('personDataList');

        if (data !== null) {
          const filteredCountryData = JSON.parse(data).filter(
            item => item.countryOfCitizenship !== undefined,
          );
          console.log('Data is from AsyncStorage - Country Component');
          return filteredCountryData.map(item => item.countryOfCitizenship);
        } else {
          console.log('No data found in AsyncStorage - Country Component');
        }
      } catch (error) {
        console.error('Country Component - Error loading data:', error);
      }
    };

    const getFrequencyArray = arr => {
      const frequencyMap = {};

      // Count the frequency of each element in the array
      arr.forEach(element => {
        frequencyMap[element] = (frequencyMap[element] || 0) + 1;
      });

      // Convert the frequency map to an array of objects
      const frequencyArray = Object.keys(frequencyMap).map(key => ({
        country: key,
        count: frequencyMap[key],
        isoCode: countryLookup.byCountry(
          key === 'Czech Republic'
            ? 'Czechia'
            : key === 'St. Kitts and Nevis'
            ? 'Saint Kitts and Nevis'
            : key === 'Eswatini (Swaziland)'
            ? 'Eswatini'
            : key,
        )?.iso2
          ? countryLookup
              .byCountry(
                key === 'Czech Republic'
                  ? 'Czechia'
                  : key === 'St. Kitts and Nevis'
                  ? 'Saint Kitts and Nevis'
                  : key === 'Eswatini (Swaziland)'
                  ? 'Eswatini'
                  : key,
              )
              .iso2.toLowerCase()
          : '',
      }));
      let sortedCountryData = frequencyArray.sort((a, b) => b.count - a.count);
      setFetchCountryData(sortedCountryData);
      setIsLoading(false);
    };

    const retrieveCountryData = async () => {
      setIsLoading(true);
      const getCountryData = await loadPersonData();
      getFrequencyArray(getCountryData);
      setIsLoading(false);
    };

    retrieveCountryData();
  }, []);

  if (isLoading) {
    return (
      <View style={AppStyles.isLoading}>
        <ActivityIndicator size={'large'} color="#18A0FB" />
      </View>
    );
  }

  const handleInputChangeInSearch = (value) => {
    const filteredData = filter(fetchCountryData, (item) => {
      if (item !== '' && item !== undefined) {
        return contains(item, value);
      }
    });
    setSearchCountryData(filteredData);
  };

  const contains = ({country}, query) => {
    if ((country && country.toLowerCase().includes(query))) {
      return true;
    }
    return false;
  };

  return (
    <>
      <HeaderView onInputChange={handleInputChangeInSearch}/>
      <View style={CountryStyles.countryContainer}>
        <FlatList
          data={searchCountryData ? searchCountryData : fetchCountryData}
          keyExtractor={item => item.isoCode}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={500}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Person', {
                  countryOfCitizenship: item.country,
                })
              }>
              <View style={CountryStyles.countryRow}>
                <View style={CountryStyles.countryRowFlag}>
                  <CountryFlag isoCode={item.isoCode} size={25} />
                </View>
                <View style={CountryStyles.countryRowName}>
                  <Text style={CountryStyles.countryRowTextName}>
                    {item.country}
                  </Text>
                </View>
                <View style={CountryStyles.countryRowCount}>
                  <Text style={CountryStyles.countryRowTextCount}>
                    {item.count}
                  </Text>
                </View>
              </View>
              <View style={AppStyles.hr} />
            </TouchableOpacity>
          )}
        />
      </View>
      <FooterView />
    </>
  );
};

export default memo(CountryView);
