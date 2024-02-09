import React, {useEffect, useState, memo} from 'react';
import {View, Text, Image, TouchableOpacity, FlatList, ActivityIndicator} from 'react-native';
import HeaderView from '../Header/HeaderView';
import FooterView from '../Footer/FooterView';
import HomeStyles from './HomeStyles';
import AppStyles from '../../styles/AppStyles';
import FileConstants from '../../utils/FileConstants';
import {numberToFixed, addhttp, getImagePath} from '../../utils/functions';
import filter from 'lodash.filter';
import { MMKV } from 'react-native-mmkv';
import {decode} from 'html-entities';

const HomeView = (params, { onInputChange }) => {
  const {route, navigation} = params;
  const [fetchPersonData, setFetchPersonData] = useState([]);
  const [filteredPersonData, setFilteredPersonData] = useState([]);
  const [searchPerson, setSearchPerson] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const AsyncStorage = new MMKV();

  useEffect(() => {
    setIsLoading(true);
    setSearchPerson('');
    setFilteredPersonData('');
    const loadPersonData = async () => {
        try {
          const data = AsyncStorage.getString('personDataList');
          if (data !== null) {
            setFetchPersonData(JSON.parse(data));
            console.log('Data is from AsyncStorage - Home Component');
          } else {
            console.log('No data found in AsyncStorage - Home Component');
          }
        } catch (error) {
          console.error('Home Component - Error loading data:', error);
        }
      };

      loadPersonData();
      setIsLoading(false);
  }, []);

  useEffect(() => {
    const filterPersonData = () => {
      if (route.params?.source) {
        return fetchPersonData.filter(row => row.source && row.source.includes(route.params.source));
      } else if (route.params?.countryOfCitizenship) {
        return fetchPersonData.filter(row => row.countryOfCitizenship === route.params.countryOfCitizenship);
      } else if (route.params?.industries) {
        return fetchPersonData.filter(row => row.industries && row.industries.includes(route.params.industries));
      } else if (route.params?.companyName) {
        return fetchPersonData.filter(item => {
          if (Array.isArray(item.financialAssets)) {
            return item.financialAssets.some(financialAssets => financialAssets.companyName === route.params.companyName);
          } else if (item.financialAssets && item.financialAssets.companyName === route.params.companyName) {
            return true;
          }
          return false;
        });
      } else {
        return fetchPersonData;
      }
    };

    if (route.params) {
      setFilteredPersonData(filterPersonData());
    }
  }, [fetchPersonData, route.params]);

  const handleInputChangeInSearch = (value) => {
    const filteredData = filter((filteredPersonData ? filteredPersonData : fetchPersonData), (item) => {
      if (item !== '' && item !== undefined) {
        return contains(item, value);
      }
    });
    setSearchPerson(filteredData);
  };

  const contains = ({naturalId, personName, source, countryOfCitizenship, birthDate, bios, abouts, state, city}, query) => {
    // if (birthDate && parseInt(query, 10) > 0 && (parseInt(query, 10) >= (calculateAge(birthDate) - 3) && parseInt(query, 10) <= (calculateAge(birthDate) + 3))) {
    //   return true;
    // }
    const biosLowerCase = bios ? bios.map(item => item.toLowerCase()) : [];
    const aboutsLowerCase = abouts ? abouts.map(item => item.toLowerCase()) : [];

    if ((personName && personName.toLowerCase().includes(query)) ||
        (source && source.toLowerCase().includes(query)) ||
        (countryOfCitizenship && countryOfCitizenship.toLowerCase().includes(query)) ||
        (biosLowerCase.length > 0 && biosLowerCase.some(str => str.includes(query))) ||
        (state && state.toLowerCase().includes(query)) ||
        (city && city.toLowerCase().includes(query)) ||
        (aboutsLowerCase.length > 0 && aboutsLowerCase.some(str => str.includes(query)))
      ) {
      return true;
    } else {
      return false;
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('Person Detail', {
          personDetail: item,
        })
      }>
      <View style={HomeStyles.renderContainer}>
        <View style={HomeStyles.renderRowLeft}>
          <Image
            style={{width: 'auto', height: 100}}
            source={{
              uri: item.person.squareImage
                ? addhttp(item.person.squareImage)
                : FileConstants.DEFAULT_IMAGE,
            }}
          />
          <Text style={HomeStyles.renderRowLeftText}>{item.rank}</Text>
        </View>

        <View style={HomeStyles.renderRowCenter}>
          <Text
            style={[
              HomeStyles.renderRowCenterText,
              HomeStyles.renderRowCenterTextName,
            ]}>
            {decode(item.personName)}
          </Text>
          <Text
            style={[
              HomeStyles.renderRowCenterText,
              HomeStyles.renderRowCenterTextSourceCountry,
            ]}>
            {item.source}
          </Text>
          <Text
            style={[
              HomeStyles.renderRowCenterText,
              HomeStyles.renderRowCenterTextSourceCountry,
            ]}>
            {item.countryOfCitizenship}
          </Text>
        </View>

        <View style={HomeStyles.renderRowRight}>
          <Text style={HomeStyles.renderRowRightText}>
            ${numberToFixed(item.finalWorth) + 'B'}
          </Text>
          <Image
            style={HomeStyles.renderRowRightImage}
            source={getImagePath(item)}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={AppStyles.isLoading}>
        <ActivityIndicator size={'large'} color="#18A0FB" />
      </View>
    );
  }

  return (
    <>
      <HeaderView onInputChange={handleInputChangeInSearch} />
      <View style={HomeStyles.homeContainer}>
        {fetchPersonData && (
          <FlatList
            data={searchPerson ? searchPerson : (filteredPersonData ? filteredPersonData : fetchPersonData)}
            keyExtractor={item => item.naturalId}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={500}
            initialNumToRender={10}
            renderItem={renderItem}
          />
        )}
      </View>
      <FooterView />
    </>
  );
};

export default memo(HomeView);
