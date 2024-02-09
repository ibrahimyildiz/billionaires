import React, {memo, useRef} from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import HeaderStyles from './HeaderStyles';
import i18n from '../../i18n/i18n';
import {useNavigation, CommonActions} from '@react-navigation/native';

const HeaderView = ({ onInputChange = () => {} }) => {
  const scrollViewRef = useRef(null);
  const navigation = useNavigation();

  const handleSearch = async (query) => {
    onInputChange(query.toLowerCase());
  };

  const navigateToNewScreen = (screen) => {
    // Your navigation logic here

    // Use CommonActions to navigate to the new screen and reset the navigation stack
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: screen }],
      })
    );

    // Scroll to the top of the ScrollView
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  return (
    <View style={HeaderStyles.headerContainer}>
      <View style={HeaderStyles.headerTop}>
        <View style={HeaderStyles.logo}>
        {/* <TouchableOpacity
            onPress={() => navigation.navigate('Home')}
            > */}
          <TouchableOpacity
            onPress={() => navigateToNewScreen('Home')}
            >
            <Text style={HeaderStyles.logoTitle}>{i18n.HEADER.LOGO_TEXT}</Text>
          </TouchableOpacity>
        </View>
        <View style={HeaderStyles.searchBox}>
          <TextInput
            style={{flex: 1}}
            placeholder="Search"
            clearButtonMode="always"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={(query) => handleSearch(query)}
          />
        </View>
      </View>
      <View style={HeaderStyles.headerButton}>
        <View>
          <TouchableOpacity
            onPress={() => navigateToNewScreen('Exchange')}
            style={[HeaderStyles.button]}>
            <Text style={HeaderStyles.buttonText}>
              {i18n.HEADER.BUTTON_EXCHANGE}
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => navigateToNewScreen('Country')}
            style={[HeaderStyles.button]}>
            <Text style={HeaderStyles.buttonText}>
              {i18n.HEADER.BUTTON_COUNTRY}
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => navigateToNewScreen('Source')}
            style={[HeaderStyles.button]}>
            <Text style={HeaderStyles.buttonText}>
              {i18n.HEADER.BUTTON_SOURCE}
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => navigateToNewScreen('Industry')}
            style={[HeaderStyles.button]}>
            <Text style={HeaderStyles.buttonText}>
              {i18n.HEADER.BUTTON_INDUSTRY}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default memo(HeaderView);
