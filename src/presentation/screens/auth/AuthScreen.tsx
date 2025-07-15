import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import { RootStackParamList } from "../../../core/types/common/navigation";
import { loginSchema, registerSchema } from "../../../application/auth/authSchemas";
// @ts-ignore
import ScreenBackground from "../../../shared/assets/img/Bienvenida.png";
import { useLoginMutation, useRegisterMutation } from "../../../core/http/requests/authServerApi";
import { useAppDispatch } from "../../../core/stores/store";
import { login } from "../../../core/stores/auth/authSlice";
import { buildAuthStateFromResponse } from "../../../core/composables/authComposables";

const AuthScreen: React.FC = () => {
  const [formState, setFormState] = useState<null | 'login' | 'register'>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const [loginRequest] = useLoginMutation();
  const [registerRequest] = useRegisterMutation();

  const [keyboardShown, setKeyboardShown] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => setKeyboardShown(true));
    const hideSub = Keyboard.addListener("keyboardDidHide", () => setKeyboardShown(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleLogin = async (email: string, password: string) => {
    loginRequest({ email, password }).unwrap()
      .then((res) => {
        const authState = buildAuthStateFromResponse(res);
        dispatch(login({
          user: authState.userData!,
          accessToken: authState.accessToken!,
          role: authState.role!
        }));

        navigation.navigate("RoleBased");
      })
      .catch(err => {
        console.error(err);
        alert('Error al iniciar sesión. Por favor, verifica tus credenciales.');
      });
  };

  const handleRegister = async (userName: string, email: string, password: string) => {
    registerRequest({ name: userName, email, password }).unwrap()
      .then((res) => {
        const authState = buildAuthStateFromResponse(res);
        dispatch(login({
          user: authState.userData!,
          accessToken: authState.accessToken!,
          role: authState.role!
        }));
        navigation.navigate("Dashboard");
      })
      .catch(err => {
        console.error(err);
        alert('Error al registrarse. Por favor, verifica tus datos.');
      });
  };

  const renderForm = () => (
    <Formik
      initialValues={{ name: '', email: '', password: '', checkPassword: '' }}
      enableReinitialize
      validationSchema={formState === 'register' ? registerSchema : loginSchema}
      onSubmit={async (values) => {
        if (formState === 'register') {
          await handleRegister(values.name, values.email, values.password);
        } else {
          await handleLogin(values.email, values.password);
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
              {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}
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
          {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={values.password}
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            secureTextEntry
          />
          {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}

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
                <Text style={styles.error}>{errors.checkPassword}</Text>
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
        onPress={() => setFormState("register")}
        style={[styles.button, { marginTop: 16 }]}
      >
        <Text style={styles.buttonText}>Registrarme</Text>
      </TouchableOpacity>
    </>
  );

  const extraHeight = formState === null ? { paddingVertical: '15%', minHeight: '35%' } : {};

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardShown && Platform.OS === 'android' ? 30 : 0}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ImageBackground source={ScreenBackground} style={styles.background}>
            <View style={[styles.container, { minHeight: '100%', paddingBottom: 0 }]}>
              <View style={[styles.form, extraHeight]}>
                {formState ? renderForm() : renderInitialButtons()}
              </View>
              {Platform.OS === 'android' && keyboardShown && <View style={{ height: 20 }} />}
            </View>
          </ImageBackground>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
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
    flexGrow: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
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
    color: '#C6DAFA',
    marginTop: 16,
    textAlign: 'center',
  },
  link: {
    color: '#91bddf',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 8,
    marginTop: -8,
    fontSize: 13,
  },
});

export default AuthScreen;
