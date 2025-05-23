import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

const fondo = require('../img/Bienvenida.png');

const AuthForm: React.FC = () => {
  const [isRegistrado, setIsRegistrado] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (isRegistrado) {
      console.log('Registrando:', { name, email, password });
    } else {
      console.log('Iniciando sesión con:', { email, password });
    }
  };

  return (
    <ImageBackground source={fondo} style={styles.background}>
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>{isRegistrado ? 'Registro' : 'Iniciar Sesión'}</Text>

        {isRegistrado && (
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={name}
            onChangeText={setName}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>
            {isRegistrado ? 'Registrarme' : 'Iniciar sesión'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.switchText}>
          {isRegistrado ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
          <Text style={styles.link} onPress={() => setIsRegistrado(!isRegistrado)}>
            {isRegistrado ? 'Inicia sesión' : 'Regístrate'}
          </Text>
        </Text>
      </View>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    margin:0,
    padding: 0,
    width: '100%',
    fontFamily: 'Poppins',
  },
  form: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    padding: '10%',
    width: '100%',
    maxWidth: '100%',
    elevation: 5, 
    shadowColor: '#000', 
    shadowOpacity: 0.05,
    shadowOffset: { width: 4, height: -4 }, 
    shadowRadius: 4,
  },
  title: {
    color: '#91bddf',
    fontSize: 24,
    marginBottom: 10,
    fontWeight: '600',
    textAlign: 'center',
    
  },
  input: {
    width: '100%',
    padding: 14,
    fontSize: 15,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#a6d1f0',
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#a0c9e8',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  switchText: {
    fontSize: 14,
    color: '#444',
    marginTop: 16,
    textAlign: 'center',
  },
  link: {
    color: '#91bddf',
    fontWeight: 'bold',
  },
});

export default AuthForm;
