import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Formik} from 'formik';
import {RootStackParamList} from "../../../core/types/common/navigation";
import {loginSchema, registerSchema} from "../../../application/auth/authSchemas";
// @ts-ignore
import ScreenBackground from "../../../shared/assets/img/Bienvenida.png"
import {useLoginMutation, useRegisterMutation} from "../../../core/http/requests/authServerApi";
import {useAppDispatch} from "../../../core/stores/store";
import {login} from "../../../core/stores/auth/authSlice";
import {buildAuthStateFromResponse} from "../../../core/composables/authComposables";

const AuthScreen: React.FC = () => {
    const [formState, setFormState] = useState<null | 'login' | 'register'>(null);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const dispatch = useAppDispatch()
    const [loginRequest] = useLoginMutation()
    const [registerRequest] = useRegisterMutation()

    const handleLogin = async (email: string, password: string) => {
        loginRequest({email, password}).unwrap()
            .then((res) => {
                const authState = buildAuthStateFromResponse(res);
                dispatch(login({
                    user: authState.userData!,
                    accessToken: authState.accessToken!,
                    role: authState.role!
                }));

                if (authState.role === "SuperAdmin" || authState.role === "ClinicAdmin") {
                    navigation.navigate("Dashboard");
                } else {
                    navigation.navigate("HomeTutor")
                }
            })
            .catch(err => {
                alert('Error al iniciar sesión. Por favor, verifica tus credenciales.');
            })
    }

    const handleRegister = async (userName: string, email: string, password: string) => {
        registerRequest({name: userName, email, password}).unwrap()
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
                alert('Error al registrarse. Por favor, verifica tus datos.');
            })
    }

    const renderForm = () => (
        <Formik
            initialValues={{name: '', email: '', password: '', checkPassword: ''}}
            enableReinitialize
            validationSchema={formState === 'register' ? registerSchema : loginSchema}
            onSubmit={async (values) => {
                if (formState === 'register') {
                    await handleRegister(values.name, values.email, values.password);
                } else {
                    await handleLogin(values.email, values.password)
                }
            }}
        >
            {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
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
                            {touched.name && errors.name && <Text style={{color: 'red'}}>{errors.name}</Text>}
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
                    {touched.email && errors.email && <Text style={{color: 'red'}}>{errors.email}</Text>}

                    <TextInput
                        style={styles.input}
                        placeholder="Contraseña"
                        value={values.password}
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        secureTextEntry
                    />
                    {touched.password && errors.password && <Text style={{color: 'red'}}>{errors.password}</Text>}

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
                                <Text style={{color: 'red'}}>{errors.checkPassword}</Text>
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
                style={[styles.button, {marginTop: 16}]}
            >
                <Text style={styles.buttonText}>Registrarme</Text>
            </TouchableOpacity>
        </>
    );

    const extraHeight = formState === null ? {paddingVertical: '15%', minHeight: '35%'} : {};

   return (
  <ImageBackground source={ScreenBackground} style={styles.background}>
    <KeyboardAvoidingView
      style={{ flex: 1, width: '100%' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={[styles.form, extraHeight]}>
            {formState ? renderForm() : renderInitialButtons()}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
        borderBottomEndRadius:35,
        borderBottomLeftRadius:35,
        padding: '10%',
        width: '100%',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: {width: 4, height: -4},
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

export default AuthScreen;