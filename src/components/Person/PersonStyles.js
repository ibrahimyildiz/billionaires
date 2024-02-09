import {StyleSheet} from 'react-native';

const PersonStyles = StyleSheet.create({
  personContainer: {
    alignItems: 'center',
    flex:6,
    marginLeft:20,
    marginRight:20,
    marginTop:0,
  },
  personRow: {
    width:'100%',
    flexDirection:'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    fontSize: 25,
  },
  personDetailContainer: {
    flex: 6,
    marginLeft:20,
    marginRight:20,
  },
  personDetailRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  globalTextTitleStyle: {
    fontFamily: 'Work Sans',
    fontSize: 25,
    color: 'black',
    fontWeight: '500',
    flex: 3,
  },
  globalTextDescriptionStyle: {
    fontFamily: 'Work Sans',
    fontSize: 25,
    color: 'black',
    fontWeight: 'normal',
    flex: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  personDetailWorthContainer: {
    flexDirection: 'row',
    flex: 1,
    marginTop:15,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  personDetailWorth: {
    fontFamily: 'Work Sans',
    fontSize: 30,
  },
  personDetailWorthImage: {
    width: 48,
    height: 48,
  },
  personDetailRow2Lines: {
    marginTop:10,
    marginBottom: 10,
  },
  fetchingContainer: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  fetchingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  fetchingText: {
    marginTop: 10,
  },
});

export default PersonStyles;
