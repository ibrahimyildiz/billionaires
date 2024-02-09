import {StyleSheet} from 'react-native';

const ExchangeStyles = StyleSheet.create({
  exchangeContainer: {
    flex: 6,
    marginLeft:20,
    marginRight:20,
  },
  exchangeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  exchangeRowName: {
    flex: 5,
  },
  exchangeRowCount: {
    flex: 1,
  },
  exchangeRowTextName: {
    fontSize: 30,
    fontFamily: 'Work Sans',
  },
  exchangeRowTextCount: {
    fontSize: 30,
    fontFamily: 'Work Sans',
  },
});

export default ExchangeStyles;
