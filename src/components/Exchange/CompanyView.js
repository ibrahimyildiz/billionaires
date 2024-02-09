import React, {useState, useEffect, memo} from 'react';
import {View, Text, FlatList, TouchableOpacity, ActivityIndicator} from 'react-native';
import HeaderView from '../Header/HeaderView';
import FooterView from '../Footer/FooterView';
import {useNavigation} from '@react-navigation/native';
import ExchangeStyles from './ExchangeStyles';
import AppStyles from '../../styles/AppStyles';
import filter from 'lodash.filter';
import { MMKV } from 'react-native-mmkv';

const CompanyView = params => {
  const navigation = useNavigation();
  const [fetchCompanyData, setFetchCompanyData] = useState([]);
  const [searchCompanyData, setSearchCompanyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {route} = params;
  const AsyncStorage = new MMKV();

  useEffect(() => {
    setIsLoading(true);
    setSearchCompanyData('');

    const loadPersonData = async () => {
      try {
        const data = await AsyncStorage.getString('personDataList');

        if (data !== null) {
          const filteredExchangeData = JSON.parse(data).filter(
            item => item.financialAssets !== undefined,
          );
          console.log('Data is from AsyncStorage - Company Component');
          return filteredExchangeData;
        } else {
          console.log('No data found in AsyncStorage - Company Component');
        }
      } catch (error) {
        console.error('Company Component - Error loading data:', error);
      }
    };

    const getFrequencyArray = arr => {
      const frequencyMap = arr.reduce((acc, item) => {
        if (Array.isArray(item.financialAssets)) {
          item.financialAssets.forEach(element => {
            const key = element.companyName;
            if (key !== undefined && (element.exchange === route.params.name)) {
              acc[key] = acc[key] || { counts: 0, sources: new Set() };
              acc[key].sources.add(item.naturalId);
              acc[key].counts = acc[key].sources.size;
            }
          });
        } else if (item) {
          const key = item.financialAssets.companyName;
          if (key !== undefined && (item.financialAssets.exchange === route.params.name)) {
            acc[key] = acc[key] || { counts: 0, sources: new Set() };
            acc[key].sources.add(item.naturalId);
            acc[key].counts = acc[key].sources.size;
          }
        }
        return acc;
      }, {});

      // Convert the frequency map to an array of objects
      const frequencyArray = Object.keys(frequencyMap).map(key => ({
        companyName: key,
        count: frequencyMap[key].counts,
      }));
      let sortedCompanyData = frequencyArray.sort((a, b) => b.count - a.count);
      setFetchCompanyData(sortedCompanyData);
      setIsLoading(false);
    };

    const retrieveCompanyData = async () => {
      setIsLoading(true);
      const getCompanyData = await loadPersonData();
      getFrequencyArray(getCompanyData);
      setIsLoading(false);
    };

    retrieveCompanyData();
  }, []);

  if (isLoading) {
    return (
      <View style={AppStyles.isLoading}>
        <ActivityIndicator size={'large'} color="#18A0FB" />
      </View>
    );
  }

  const handleInputChangeInSearch = (value) => {
    const filteredData = filter(fetchCompanyData, (item) => {
      if (item !== '' && item !== undefined) {
        return contains(item, value);
      }
    });
    setSearchCompanyData(filteredData);
  };

  const contains = ({companyName}, query) => {
    if ((companyName && companyName.toLowerCase().includes(query))) {
      return true;
    }
    return false;
  };

  return (
    <>
      <HeaderView onInputChange={handleInputChangeInSearch} />
      <View
        style={ExchangeStyles.exchangeContainer}>
        <FlatList
          data={searchCompanyData ? searchCompanyData : fetchCompanyData}
          keyExtractor={item => item.companyName}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={500}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Person', {
                  companyName: item.companyName,
                })
              }>
              <View style={ExchangeStyles.exchangeRow}>
                <View style={ExchangeStyles.exchangeRowName}>
                  <Text style={ExchangeStyles.exchangeRowTextName}>
                    {item.companyName}
                  </Text>
                </View>
                <View style={ExchangeStyles.exchangeRowCount}>
                  <Text style={ExchangeStyles.exchangeRowTextCount}>
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

export default memo(CompanyView);
