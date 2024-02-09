import {StyleSheet} from 'react-native';

const HomeStyles = StyleSheet.create({
  homeContainer: {
    flex:6,
    marginLeft:20,
    marginRight:20,
  },
  renderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  renderRowLeft: {
    marginRight: 15,
    flex: 2,
  },
  renderRowLeftText: {
    fontSize: 15,
    paddingTop: 10,
    fontFamily: 'Work Sans',
    opacity: 0.5,
  },
  renderRowCenter: {
    flex: 3.5,
  },
  renderRowCenterText: {
    fontFamily: 'Work Sans',
    marginTop: 0,
  },
  renderRowCenterTextName: {
    fontSize: 20,
    marginBottom: 15,
  },
  renderRowCenterTextSourceCountry: {
    fontSize: 18,
  },
  renderRowRight: {
    alignItems: 'center',
    flex: 2.5,
  },
  renderRowRightText: {
    fontSize: 25,
    fontFamily: 'Work Sans',
  },
  renderRowRightImage: {
    width: 48,
    height: 48,
  },
});

export default HomeStyles;
