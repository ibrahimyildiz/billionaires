import {StyleSheet} from 'react-native';

const IndustryStyles = StyleSheet.create({
  industryContainer: {
    flex: 6,
    marginLeft:20,
    marginRight:20,
  },
  industryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  industryRowName: {
    flex: 5,
  },
  industryRowCount: {
    flex: 1,
  },
  industryRowTextName: {
    fontSize: 30,
    fontFamily: 'Work Sans',
  },
  industryRowTextCount: {
    fontSize: 30,
    fontFamily: 'Work Sans',
  },
});

export default IndustryStyles;
