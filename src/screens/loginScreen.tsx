import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { KeyboardAvoidingView, Platform, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';


const fondo = require('../img/Bienvenida.png');

const AuthForm: React.FC = () => {
  const [formState, setFormState] = useState<null | 'login' | 'register'>(null);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Debe ingresar un email válido')
      .max(150, 'Máximo 150 caracteres')
      .required('El email es requerido'),
    password: Yup.string()
      .min(8, 'Mínimo 8 caracteres')
      .required('Password es requerido'),
    checkPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Las contraseñas deben coincidir')
      .required('Confirmar contraseña es requerido'),
  });

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const renderForm = () => (
    <Formik
      initialValues={{ name: '', email: '', password: '', checkPassword: '' }}
      enableReinitialize
      validationSchema={formState === 'register' ? validationSchema : null}
      onSubmit={(values) => {
        if (formState === 'register') {
          console.log('Registrando:', values);
        } else {
          console.log('Iniciando sesión con:', values);

          const isTerapeuta = values.email === 'terapeuta@gmail.com';
          const isTutor = values.email === 'tutor@gmail.com';

          if (isTerapeuta) {
            navigation.navigate('Dashboard', { openAddModal: false });
          } else if (isTutor) {
            navigation.navigate('HomeTutor');
          } else {
            alert('Usuario no reconocido');
          }
        }
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <>
          <Text style={styles.title}>
            {formState === 'register' ? 'Registro' : 'Iniciar Sesión'}
          </Text>

          {formState === 'register' && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
              />
              {touched.name && errors.name && <Text style={{ color: 'red' }}>{errors.name}</Text>}
            </>
          )}

          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            value={values.email}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            keyboardType="email-address"
          />
          {touched.email && errors.email && <Text style={{ color: 'red' }}>{errors.email}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={values.password}
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            secureTextEntry
          />
          {touched.password && errors.password && <Text style={{ color: 'red' }}>{errors.password}</Text>}

          {formState === 'register' && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Confirmar contraseña"
                value={values.checkPassword}
                onChangeText={handleChange('checkPassword')}
                onBlur={handleBlur('checkPassword')}
                secureTextEntry
              />
              {touched.checkPassword && errors.checkPassword && (
                <Text style={{ color: 'red' }}>{errors.checkPassword}</Text>
              )}
            </>
          )}

          <TouchableOpacity onPress={handleSubmit as any} style={styles.button}>
            <Text style={styles.buttonText}>
              {formState === 'register' ? 'Registrarme' : 'Iniciar sesión'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.switchText}>
            {formState === 'register' ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
            <Text
              style={styles.link}
              onPress={() => setFormState(formState === 'register' ? 'login' : 'register')}
            >
              {formState === 'register' ? 'Inicia sesión' : 'Regístrate'}
            </Text>
          </Text>
        </>
      )}
    </Formik>
  );

  const renderInitialButtons = () => (
    <>
      <Text style={styles.title}>Bienvenido a Feelink</Text>

      <TouchableOpacity onPress={() => setFormState('login')} style={styles.button}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setFormState('register')}
        style={[styles.button, { marginTop: 16 }]}
      >
        <Text style={styles.buttonText}>Registrarme</Text>
      </TouchableOpacity>
    </>
  );

  const extraHeight = formState === null ? { paddingVertical: '15%', minHeight: '35%' } : {};

  return (
  <ImageBackground source={fondo} style={styles.background}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, width: '100%' }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <View style={[styles.form, extraHeight]}>
              {formState ? renderForm() : renderInitialButtons()}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
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