import React, {useState, useEffect, memo} from 'react';
import {View, Text, FlatList, TouchableOpacity, ActivityIndicator} from 'react-native';
import HeaderView from '../Header/HeaderView';
import FooterView from '../Footer/FooterView';
import {useNavigation} from '@react-navigation/native';
import ExchangeStyles from './ExchangeStyles';
import AppStyles from '../../styles/AppStyles';
import filter from 'lodash.filter';
import { MMKV } from 'react-native-mmkv';

const ExchangeView = () => {
  const navigation = useNavigation();
  const [fetchExchangeData, setFetchExchangeData] = useState([]);
  const [searchExchangeData, setSearchExchangeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const AsyncStorage = new MMKV();

  useEffect(() => {
    setIsLoading(true);
    setSearchExchangeData('');

    const loadPersonData = async () => {
      try {
        const data = AsyncStorage.getString('personDataList');

        if (data !== null) {
          const filteredExchangeData = JSON.parse(data).filter(
            item => item.financialAssets !== undefined,
          );
          console.log('Data is from AsyncStorage - Exchange Component');
          return filteredExchangeData.map(item => item.financialAssets);
        } else {
          console.log('No data found in AsyncStorage - Exchange Component');
        }
      } catch (error) {
        console.error('Exchange Component - Error loading data:', error);
      }
    };

    const getFrequencyArray = arr => {
      const frequencyMap = arr.reduce((acc, item) => {
        if (Array.isArray(item)) {
          item.forEach(element => {
            const key = element.exchange;
            if (key !== undefined) {
              acc[key] = acc[key] || { counts: 0, sources: new Set() };
              acc[key].sources.add(element.companyName);
              acc[key].counts = acc[key].sources.size;
            }
          });
        } else if (item) {
          const key = item.exchange;
          if (key !== undefined) {
            acc[key] = acc[key] || { counts: 0, sources: new Set() };
            acc[key].sources.add(item.companyName);
            acc[key].counts = acc[key].sources.size;
          }
        }
        return acc;
      }, {});

      // Convert the frequency map to an array of objects
      const frequencyArray = Object.keys(frequencyMap).map(key => ({
        exchange: key,
        count: frequencyMap[key].counts,
      }));
      let sortedSourceData = frequencyArray.sort((a, b) => b.count - a.count);
      setFetchExchangeData(sortedSourceData);
      setIsLoading(false);
    };

    const retrieveSourceData = async () => {
      setIsLoading(true);
      const getSourceData = await loadPersonData();
      getFrequencyArray(getSourceData);
      setIsLoading(false);
    };

    retrieveSourceData();
  }, []);

  if (isLoading) {
    return (
      <View style={AppStyles.isLoading}>
        <ActivityIndicator size={'large'} color="#18A0FB" />
      </View>
    );
  }

  const handleInputChangeInSearch = (value) => {
    const filteredData = filter(fetchExchangeData, (item) => {
      if (item !== '' && item !== undefined) {
        return contains(item, value);
      }
    });
    setSearchExchangeData(filteredData);
  };

  const contains = ({exchange}, query) => {
    if ((exchange && exchange.toLowerCase().includes(query))) {
      return true;
    }
    return false;
  };

  return (
    <>
      <HeaderView onInputChange={handleInputChangeInSearch}/>
      <View
        style={ExchangeStyles.exchangeContainer}>
        <FlatList
          data={searchExchangeData ? searchExchangeData : fetchExchangeData}
          keyExtractor={item => item.exchange}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={500}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Company', {
                    data: fetchExchangeData,
                    name: item.exchange,
                })
              }>
              <View style={ExchangeStyles.exchangeRow}>
                <View style={ExchangeStyles.exchangeRowName}>
                  <Text style={ExchangeStyles.exchangeRowTextName}>
                    {item.exchange}
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

export default memo(ExchangeView);
