import React, {useState, useEffect, memo} from 'react';
import {View, Text, FlatList, TouchableOpacity, ActivityIndicator} from 'react-native';
import HeaderView from '../Header/HeaderView';
import FooterView from '../Footer/FooterView';
import {useNavigation} from '@react-navigation/native';
import SourceStyles from './SourceStyles';
import AppStyles from '../../styles/AppStyles';
import filter from 'lodash.filter';
import { MMKV } from 'react-native-mmkv';

const SourceView = () => {
  const navigation = useNavigation();
  const [fetchSourceData, setFetchSourceData] = useState([]);
  const [searchSourceData, setSearchSourceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const AsyncStorage = new MMKV();

  useEffect(() => {
    setIsLoading(true);
    setSearchSourceData('');

    const loadPersonData = async () => {
      try {
        const data = AsyncStorage.getString('personDataList');

        if (data !== null) {
          const filteredSourceData = JSON.parse(data).filter(
            item => item.source !== undefined,
          );
          console.log('Data is from AsyncStorage - Source Component');
          return filteredSourceData.map(item => item.source);
        } else {
          console.log('No data found in AsyncStorage - Source Component');
        }
      } catch (error) {
        console.error('Source Component - Error loading data:', error);
      }
    };

    const getFrequencyArray = arr => {
      const frequencyMap = {};

      arr.forEach(entry => {
        const keywords = entry && entry.split(',').map(keyword => keyword.trim());

        keywords && keywords.forEach(keyword => {
          frequencyMap[keyword] = (frequencyMap[keyword] || 0) + 1;
        });
      });

      const frequencyArray = Object.keys(frequencyMap).map(key => ({
        source: key,
        count: frequencyMap[key],
      }));
      let sortedSourceData = frequencyArray.sort((a, b) => b.count - a.count);
      setFetchSourceData(sortedSourceData);
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
    const filteredData = filter(fetchSourceData, (item) => {
      if (item !== '' && item !== undefined) {
        return contains(item, value);
      }
    });
    setSearchSourceData(filteredData);
  };

  const contains = ({source}, query) => {
    if ((source && source.toLowerCase().includes(query))) {
      return true;
    }
    return false;
  };

  return (
    <>
      <HeaderView onInputChange={handleInputChangeInSearch}/>
      <View
        style={SourceStyles.sourceContainer}>
        <FlatList
          data={searchSourceData ? searchSourceData : fetchSourceData}
          keyExtractor={item => item.source}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={500}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Person', {
                  source: item.source,
                })
              }>
              <View style={SourceStyles.sourceRow}>
                <View style={SourceStyles.sourceRowName}>
                  <Text style={SourceStyles.sourceRowTextName}>
                    {item.source}
                  </Text>
                </View>
                <View style={SourceStyles.sourceRowCount}>
                  <Text style={SourceStyles.sourceRowTextCount}>
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

export default memo(SourceView);
