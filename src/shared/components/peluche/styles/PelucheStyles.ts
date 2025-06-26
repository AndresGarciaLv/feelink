// /src/styles/pelucheStyles.ts

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cardsContainer: {
    paddingHorizontal: 20,
    gap: 15,
    marginBottom: 20,
  },
  carouselContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    marginTop: 10,
    backgroundColor: '#f9f9f9',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

   tabBarWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
  },
  
  
});