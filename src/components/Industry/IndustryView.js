import React, {useState, useEffect, memo} from 'react';
import {View, Text, FlatList, TouchableOpacity, ActivityIndicator} from 'react-native';
import HeaderView from '../Header/HeaderView';
import FooterView from '../Footer/FooterView';
import {useNavigation} from '@react-navigation/native';
import IndustryStyles from './IndustryStyles';
import AppStyles from '../../styles/AppStyles';
import filter from 'lodash.filter';
import { MMKV } from 'react-native-mmkv';

const IndustryView = () => {
  const navigation = useNavigation();
  const [fetchIndustryData, setFetchIndustryData] = useState([]);
  const [searchIndustryData, setSearchIndustryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const AsyncStorage = new MMKV();

  useEffect(() => {
    setIsLoading(true);
    setSearchIndustryData('');

    const loadPersonData = async () => {
      try {
        const data = AsyncStorage.getString('personDataList');

        if (data !== null) {
          const filteredIndustryData = JSON.parse(data).filter(
            item => item.industries !== undefined,
          );
          console.log('Data is from AsyncStorage - Industry Component');
          return filteredIndustryData.map(item => item.industries);
        } else {
          console.log('No data found in AsyncStorage - Industry Component');
        }
      } catch (error) {
        console.error('Industry Component - Error loading data:', error);
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
        industry: key,
        count: frequencyMap[key],
      }));
      let sortedIndustryData = frequencyArray.sort((a, b) => b.count - a.count);
      setFetchIndustryData(sortedIndustryData);
      setIsLoading(false);
    };

    const retrieveIndustryData = async () => {
      setIsLoading(true);
      const getIndustryData = await loadPersonData();
      getFrequencyArray(getIndustryData);
      setIsLoading(false);
    };

    retrieveIndustryData();
  }, []);

  if (isLoading) {
    return (
      <View style={AppStyles.isLoading}>
        <ActivityIndicator size={'large'} color="#18A0FB" />
      </View>
    );
  }

  const handleInputChangeInSearch = (value) => {
    const filteredData = filter(fetchIndustryData, (item) => {
      if (item !== '' && item !== undefined) {
        return contains(item, value);
      }
    });
    setSearchIndustryData(filteredData);
  };

  const contains = ({industry}, query) => {
    if ((industry && industry.toLowerCase().includes(query))) {
      return true;
    }
    return false;
  };

  return (
    <>
      <HeaderView onInputChange={handleInputChangeInSearch}/>
      <View
        style={IndustryStyles.industryContainer}>
        <FlatList
          data={searchIndustryData ? searchIndustryData : fetchIndustryData}
          keyExtractor={item => item.industry}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={500}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Person', {
                  industries: item.industry,
                })
              }>
              <View style={IndustryStyles.industryRow}>
                <View style={IndustryStyles.industryRowName}>
                  <Text style={IndustryStyles.industryRowTextName}>
                    {item.industry}
                  </Text>
                </View>
                <View style={IndustryStyles.industryRowCount}>
                  <Text style={IndustryStyles.industryRowTextCount}>
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

export default memo(IndustryView);
