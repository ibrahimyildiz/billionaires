import {StyleSheet} from 'react-native';

const CountryStyles = StyleSheet.create({
  countryContainer: {
    flex: 6,
    marginLeft:20,
    marginRight:20,
  },
  countryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    alignItems: 'center',
  },
  countryRowFlag: {
    flex: 2,
  },
  countryRowName: {
    flex: 5,
  },
  countryRowCount: {
    flex: 2,
  },
  countryRowTextName: {
    fontSize: 30,
    fontFamily: 'Work Sans',
  },
  countryRowTextCount: {
    fontSize: 30,
    fontFamily: 'Work Sans',
  },
});

export default CountryStyles;
