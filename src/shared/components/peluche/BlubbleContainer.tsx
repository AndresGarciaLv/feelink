// /src/components/peluche/BubbleContainer.tsx

import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

interface Props {
  bluetooth: React.ReactNode;
  peluche: React.ReactNode;
  wifi: React.ReactNode;
}

export default function BubbleContainer({ bluetooth, peluche, wifi }: Props) {
  return (
    <View style={styles.bubblesContainer}>
      <TouchableOpacity style={[styles.bubble, styles.left]}>
        {bluetooth}
      </TouchableOpacity>

      <TouchableOpacity style={[styles.bubble, styles.center]}>
        {peluche}
      </TouchableOpacity>

      <TouchableOpacity style={[styles.bubble, styles.right]}>
        {wifi}
      </TouchableOpacity>

      
    </View>
  );
}

const styles = StyleSheet.create({
  bubblesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -35 , // Ajustar Para subir o bajar la burbuja
    marginBottom: 20,
    zIndex: 10,
  },
  bubble: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginHorizontal: -10,
  },
  left: {
    marginLeft: 20,
  },
  center: {
    zIndex: 2,
    elevation: 10,
  },
  right: {
    marginRight: 20,
  },
  
});