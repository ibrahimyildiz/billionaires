import {StyleSheet} from 'react-native';

const HeaderStyles = StyleSheet.create({
  headerContainer: {
    margin:20,
  },
  headerTop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  logo: {
  },
  logoTitle: {
    fontSize: 25,
    color: '#18A0FB',
    textAlign: 'left',
  },
  searchBox: {
    paddingHorizontal:20,
    borderColor: '#18A0FB',
    borderWidth:1,
    borderRadius: 8,
    width: '60%',
    height: 40,
  },
  button: {
    width: 'auto',
    backgroundColor: '#18A0FB',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
    padding:10,
  },
  headerButton: {
    width:'100%',
    flexDirection:'row',
    justifyContent: 'space-between',
  },
});

export default HeaderStyles;
