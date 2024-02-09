import {StyleSheet} from 'react-native';

const SourceStyles = StyleSheet.create({
  sourceContainer: {
    flex: 6,
    marginLeft:20,
    marginRight:20,
  },
  sourceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  sourceRowName: {
    flex: 5,
  },
  sourceRowCount: {
    flex: 1,
  },
  sourceRowTextName: {
    fontSize: 30,
    fontFamily: 'Work Sans',
  },
  sourceRowTextCount: {
    fontSize: 30,
    fontFamily: 'Work Sans',
  },
});

export default SourceStyles;
