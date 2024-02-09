import React, {useState, useEffect, useRef, memo} from 'react';
import {View, Text, Image, ScrollView, TouchableOpacity, FlatList} from 'react-native';
import HeaderView from '../Header/HeaderView';
import FooterView from '../Footer/FooterView';
import PersonStyles from './PersonStyles';
import HomeStyles from '../Home/HomeStyles';
import AppStyles from '../../styles/AppStyles';
import {useNavigation} from '@react-navigation/native';
import {addhttp, calculateAge, numberToFixed, getImagePath, filterUniqueByField} from '../../utils/functions';
import FileConstants from '../../utils/FileConstants';
import filter from 'lodash.filter';
import { MMKV } from 'react-native-mmkv';
import {decode} from 'html-entities';
import i18n from '../../i18n/i18n';

const PersonDetail = params => {
  const {route} = params;
  const [fetchPersonData, setFetchPersonData] = useState([]);
  const [searchPerson, setSearchPerson] = useState([]);
  const [relatedPersonData, setRelatedPersonData] = useState([]);
  const [flatListOffset, setFlatListOffset] = useState(0);
  const [holdOffset, setHoldOffset] = useState(true);
  const navigation = useNavigation();
  const AsyncStorage = new MMKV();
  const scrollRef = useRef();
  const flatListRef = useRef(null);

  const onPressTouch = (item) => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });

    navigation.navigate('Person Detail', {
      personDetail: item,
    });
  };

  useEffect(() => {
    const loadPersonData = async () => {
      try {
        const data = AsyncStorage.getString('personDataList');

        if (data !== null) {
          setFetchPersonData(JSON.parse(data));
          console.log('Data is from AsyncStorage - Person Detail Component');
        } else {
          console.log('No data found in AsyncStorage2 - Person Detail Component');
        }
      } catch (error) {
        console.error('Person Detail Component - Error loading data:', error);
      }
    };
    loadPersonData();
  }, []);

  useEffect(() => {
    console.log('RETRIEVING RELATED PEOPLE!!');
    setRelatedPersonData('');
    setSearchPerson('');

    if (route.params.personDetail?.source) {
      const keywords =  route.params.personDetail.source.split(',').map(keyword => keyword.trim());
      const relatedFilteredPersonData = fetchPersonData.filter(row =>
        row.source &&
        keywords.some(keyword =>
          row.source.split(',').map(item => item.trim()).includes(keyword.trim())
        ) &&
        row.naturalId !== route.params.personDetail.naturalId
      );

      setRelatedPersonData(relatedFilteredPersonData);
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  }, [fetchPersonData, route.params]);

  const handleInputChangeInSearch = (value) => {
    const filteredData = filter((relatedPersonData), (item) => {
      if (item !== '' && item !== undefined) {
        if (value.length > 0) {
          setHoldOffset(false);
          flatListRef.current.scrollToOffset({ offset: 0, animated: true });
        } else {
          setHoldOffset(true);
          flatListRef.current.scrollToOffset({ offset: flatListOffset, animated: true });
        }
        return contains(item, value);
      }
    });
    setSearchPerson(filteredData);
  };

  const contains = ({personName, source, countryOfCitizenship}, query) => {
    if ((personName && personName.toLowerCase().includes(query)) || (source && source.toLowerCase().includes(query)) || (countryOfCitizenship && countryOfCitizenship.toLowerCase().includes(query))) {
      return true;
    }
    return false;
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        key={item.naturalId}
        onPress={() => onPressTouch(item)}>
        <View style={HomeStyles.renderContainer}>
          <View style={HomeStyles.renderRowLeft}>
            <Image
              style={{width: 75, height: 100}}
              source={{
                uri: item.person.squareImage
                  ? addhttp(item.person.squareImage)
                  : FileConstants.DEFAULT_IMAGE,
              }}
            />
            <Text style={HomeStyles.renderRowLeftText}>{item.rank}</Text>
          </View>

          <View style={[HomeStyles.renderRowCenter, {marginRight:5}]}>
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

          <View style={[HomeStyles.renderRowRight, {marginRight:5}]}>
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
  };

  return (
    <>
      <HeaderView onInputChange={handleInputChangeInSearch} />
      <View style={PersonStyles.personDetailContainer}>
      <ScrollView ref={scrollRef}>
          <View style={PersonStyles.personDetailWorthContainer}>
            <Text style={PersonStyles.personDetailWorth}>
              ${numberToFixed(route.params.personDetail.finalWorth)} B
            </Text>
            <Image
              style={PersonStyles.personDetailWorthImage}
              source={getImagePath(route.params.personDetail)}
            />
          </View>
          <View style={AppStyles.hr} />
          <View>
            <Image
              style={{
                width: 'auto',
                height: 390,
                marginBottom: 15,
                marginTop: 15,
              }}
              source={{
                uri: route.params.personDetail.squareImage
                  ? addhttp(route.params.personDetail.squareImage)
                  : FileConstants.DEFAULT_IMAGE,
              }}
            />
            <View style={PersonStyles.personDetailRow}>
              <GlobalTextTitle>{i18n.PERSON_DETAIL.TEXT_NAME}</GlobalTextTitle>
              <GlobalTextDescription>
                {decode(route.params.personDetail.personName)}
              </GlobalTextDescription>
            </View>
            {(route.params.personDetail?.city || route.params.personDetail?.state) && (<View style={AppStyles.hr} /> )}
            {(route.params.personDetail?.city ||
              route.params.personDetail?.state) && (
              <View style={PersonStyles.personDetailRow}>
                <GlobalTextTitle>{i18n.PERSON_DETAIL.TEXT_RESIDENCE}</GlobalTextTitle>
                <GlobalTextDescription>
                  {route.params.personDetail.city}{' '}
                  {route.params.personDetail.state}
                </GlobalTextDescription>
              </View>
            )}
            <View style={AppStyles.hr} />
            {route.params.personDetail?.rank && (
              <View style={PersonStyles.personDetailRow}>
                <GlobalTextTitle>{i18n.PERSON_DETAIL.TEXT_RANK}</GlobalTextTitle>
                <GlobalTextDescription>
                  {route.params.personDetail.rank}
                </GlobalTextDescription>
              </View>
            )}
            <View style={AppStyles.hr} />
            {route.params.personDetail?.source && (
              <View style={PersonStyles.personDetailRow}>
                <GlobalTextTitle>{i18n.PERSON_DETAIL.TEXT_SOURCE}</GlobalTextTitle>
                <GlobalTextDescription>
                  {route.params.personDetail.source}
                </GlobalTextDescription>
              </View>
            )}
            <View style={AppStyles.hr} />
            {route.params.personDetail?.countryOfCitizenship && (
              <View style={PersonStyles.personDetailRow}>
                <GlobalTextTitle>{i18n.PERSON_DETAIL.TEXT_CITIZENSHIP}</GlobalTextTitle>
                <GlobalTextDescription>
                  {route.params.personDetail.countryOfCitizenship}
                </GlobalTextDescription>
              </View>
            )}
            {route.params.personDetail?.birthDate && <View style={AppStyles.hr} /> }
            {route.params.personDetail?.birthDate && (
              <View style={PersonStyles.personDetailRow}>
                <GlobalTextTitle>{i18n.PERSON_DETAIL.TEXT_AGE}</GlobalTextTitle>
                <GlobalTextDescription>
                  {calculateAge(route.params.personDetail.birthDate)}
                </GlobalTextDescription>
              </View>
            )}
            <View style={AppStyles.hr} />
            {route.params.personDetail?.industries && (
              <View style={PersonStyles.personDetailRow}>
                <GlobalTextTitle>{i18n.PERSON_DETAIL.TEXT_INDUSTRY}</GlobalTextTitle>
                <GlobalTextDescription>
                  {route.params.personDetail.industries}
                </GlobalTextDescription>
              </View>
            )}
            {route.params.personDetail?.abouts && (<View style={AppStyles.hr} />)}
            {route.params.personDetail?.abouts && (
              <View style={PersonStyles.personDetailRow2Lines}>
                <GlobalTextTitle style={{marginBottom: 10}}>
                {i18n.PERSON_DETAIL.TEXT_ABOUT}
                </GlobalTextTitle>
                <GlobalTextDescription>
                  {decode(route.params.personDetail.abouts[0])}
                </GlobalTextDescription>
              </View>
            )}
            {route.params.personDetail?.bios && (<View style={AppStyles.hr} />)}
            {route.params.personDetail?.bios && (
              <View style={PersonStyles.personDetailRow2Lines}>
                <GlobalTextTitle style={{marginBottom: 10}}>
                {i18n.PERSON_DETAIL.TEXT_BIO}
                </GlobalTextTitle>
                <GlobalTextDescription>
                  {decode(route.params.personDetail.bios[0])}
                </GlobalTextDescription>
              </View>
            )}
            {route.params.personDetail?.financialAssets && (<View style={AppStyles.hr} />)}
            {route.params.personDetail?.financialAssets && (
              <View style={PersonStyles.personDetailRow2Lines}>
                <GlobalTextTitle style={{marginBottom: 10}}>
                {i18n.PERSON_DETAIL.TEXT_STOCKS}
                </GlobalTextTitle>
                {filterUniqueByField(
                  route.params.personDetail?.financialAssets,
                  'companyName',
                ).map((item, key) => (
                  <View key={key}>
                    {item.exchange &&
                    <View style={PersonStyles.personDetailRow}>
                      <GlobalTextTitle>{i18n.PERSON_DETAIL.TEXT_EXCHANGE}</GlobalTextTitle>
                      <GlobalTextDescription>
                        {item.exchange}
                      </GlobalTextDescription>
                    </View>
                    }
                    {item.companyName &&
                    <View style={PersonStyles.personDetailRow}>
                      <GlobalTextTitle>{i18n.PERSON_DETAIL.TEXT_COMPANY}</GlobalTextTitle>
                      <GlobalTextDescription>
                        {item.companyName}
                      </GlobalTextDescription>
                    </View>
                    }
                  </View>
                ))}
              </View>
            )}
            {relatedPersonData.length > 0 && (
              <View style={AppStyles.hr} />
            )}
        <View>
          {relatedPersonData.length > 0 && (
          <View style={PersonStyles.personDetailRow2Lines}>
            <GlobalTextTitle style={{marginBottom: 10}}>
            {i18n.PERSON_DETAIL.TEXT_RELATED_PEOPLE} ({searchPerson.length > 0 ? searchPerson.length : relatedPersonData.length})
            </GlobalTextTitle>
          </View>
          )}
          <FlatList
            ref={flatListRef}
            data={searchPerson ? searchPerson : relatedPersonData}
            keyExtractor={item => item.naturalId}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={500}
            initialNumToRender={10}
            renderItem={renderItem}
            horizontal
            onScroll={(event) => {
              holdOffset && setFlatListOffset(event.nativeEvent.contentOffset.x);
            }}
          />
        </View>
        </View>
      </ScrollView>
      </View>
      <FooterView />
    </>
  );
};

const GlobalTextTitle = ({children, style, ...rest}) => (
  <Text style={[PersonStyles.globalTextTitleStyle, style]} {...rest}>
    {children}
  </Text>
);

const GlobalTextDescription = ({children, style, ...rest}) => (
  <Text style={[PersonStyles.globalTextDescriptionStyle, style]} {...rest}>
    {children}
  </Text>
);

export default memo(PersonDetail);
