import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

const fondo = require('../img/Bienvenida.png');

const AuthForm: React.FC = () => {
  const [formState, setFormState] = useState<null | 'login' | 'register'>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleSubmit = () => {
    if (formState === 'register') {
      console.log('Registrando:', { name, email, password });
    } else if (formState === 'login') {
      console.log('Iniciando sesión con:', { email, password });
      navigation.navigate('Dashboard', { openAddModal: false });
    }
  };

  const renderForm = () => (
    <>
      <Text style={styles.title}>{formState === 'register' ? 'Registro' : 'Iniciar Sesión'}</Text>

      {formState === 'register' && (
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
          {formState === 'register' ? 'Registrarme' : 'Iniciar sesión'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.switchText}>
        {formState === 'register' ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
        <Text style={styles.link} onPress={() => setFormState(formState === 'register' ? 'login' : 'register')}>
          {formState === 'register' ? 'Inicia sesión' : 'Regístrate'}
        </Text>
      </Text>
    </>
  );

  const renderInitialButtons = () => (
    <>
      <Text style={styles.title}>Bienvenido a Feelink</Text>

      <TouchableOpacity onPress={() => setFormState('login')} style={styles.button}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setFormState('register')} style={[styles.button, { marginTop: 16 }]}>
        <Text style={styles.buttonText}>Registrarme</Text>
      </TouchableOpacity>
    </>
  );

  // Estilo extra cuando está en la pantalla inicial
  const extraHeight = formState === null ? { paddingVertical: '15%', minHeight: '35%' } : {};

  return (
    <ImageBackground source={fondo} style={styles.background}>
      <View style={styles.container}>
        <View style={[styles.form, extraHeight]}>
          {formState ? renderForm() : renderInitialButtons()}
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
    width: '100%',
    fontFamily: 'Poppins',
  },
  form: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    padding: '10%',
    width: '100%',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 4, height: -4 },
    shadowRadius: 4,
  },
  title: {
    color: '#91bddf',
    fontSize: 24,
    marginBottom: 16,
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
