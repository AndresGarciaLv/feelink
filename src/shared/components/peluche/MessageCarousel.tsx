import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';

interface Props {
  pelucheIcon: React.ReactNode;
  messages: string[];
}

export default function MessageCarousel({ pelucheIcon, messages }: Props) {
  const [index, setIndex] = useState(0);
  const fadeAnim = useState(new Animated.Value(1))[0];
  const slideAnim = useState(new Animated.Value(0))[0];
  const { width } = Dimensions.get('window');

  // Resetear el índice cuando cambian los mensajes
  useEffect(() => {
    setIndex(0);
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Animación de salida
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -50,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start(() => {
        setIndex((prev) => (prev + 1) % messages.length);
        // Resetear valores para animación de entrada
        slideAnim.setValue(50);
        // Animación de entrada
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          })
        ]).start();
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [messages, fadeAnim, slideAnim]); // Agregamos las dependencias necesarias

  return (
    <View style={styles.container}>
      {pelucheIcon}
      
      <View style={styles.messageContainer}>
        <Animated.View style={[
          styles.animatedContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }]
          }
        ]}>
          <Text style={styles.message}>{messages[index]}</Text>
        </Animated.View>
      </View>

      <View style={styles.indicators}>
        {messages.map((_, i) => (
          <View
            key={i}
            style={[
              styles.indicator,
              i === index ? styles.activeIndicator : styles.inactiveIndicator,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minHeight: 250,
    width: '90%',
    alignSelf: 'center',
  },
  messageContainer: {
    minHeight: 100, // Aumentado para mensajes más largos
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  animatedContainer: {
    width: '100%',
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    width: '90%', // Más ancho para mejor legibilidad
    lineHeight: 22,
    paddingHorizontal: 10,
    color: '#333',
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeIndicator: {
    backgroundColor: '#D8A5C2',
    width: 12,
  },
  inactiveIndicator: {
    backgroundColor: '#9BC4E0',
    opacity: 0.5,
  },
  
});