import * as Yup from 'yup';

const registerSchema = Yup.object().shape({
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

const loginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Debe ingresar un email válido')
        .max(150, 'Máximo 150 caracteres')
        .required('El email es requerido'),
    password: Yup.string()
        .min(8, 'Mínimo 8 caracteres')
        .required('Password es requerido'),
});

export { registerSchema, loginSchema };