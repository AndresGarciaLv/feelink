import React from 'react';
import { View, Text, StyleSheet, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface NavbarProps {
  tutorName?: string;
  centerName?: string;
  specialistName?: string;
  profileImage?: any;
}

const HeaderTutor: React.FC<NavbarProps> = ({
  tutorName = 'Andres Garcia',
  centerName = 'Astra, AB',
  specialistName = 'Dr. Ricardo Chi',
  profileImage,
}) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
      <View style={styles.content}>
        {/* SECCIÓN SUPERIOR - Perfil del tutor con mensaje de bienvenida */}
        <View style={styles.profileContainer}>
          <View style={styles.profileImageWrapper}>
            {profileImage ? (
              <Image source={profileImage} style={styles.profileImage} />
            ) : (
              <View style={styles.defaultProfileImage}>
                <View style={styles.avatarFace}>
                  <Ionicons name="person" size={35} color="#2C3E50" />
                </View>
              </View>
            )}
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.welcomeText}>Bienvenido a FeeLink :)</Text>
            <Text style={styles.tutorName}>{tutorName}</Text>
          </View>
        </View>

        {/* SECCIÓN INFERIOR - Cards separadas para Centro de atención y Especialista */}
        <View style={styles.cardsContainer}>
          {/* CARD IZQUIERDA - Centro de atención */}
          <View style={[styles.infoCard, styles.leftCard]}>
            <Text style={styles.cardTitle}>Centro de atención</Text>
            <Text style={styles.cardSubtitle}>{centerName}</Text>
          </View>

          {/* CARD DERECHA - Especialista */}
          <View style={[styles.infoCard, styles.rightCard]}>
            <Text style={styles.cardTitle}>Especialista</Text>
            <Text style={styles.cardSubtitle}>{specialistName}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // CONTENEDOR PRINCIPAL - Fondo con degradado azul-rosa
  container: {
    backgroundColor: '#A8C8E8', // Color base azul suave
    paddingBottom: 20,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
    marginHorizontal:0 ,
  },
  
  // CONTENIDO PRINCIPAL
  content: {
    flex: 1,
  },

  // CONTENEDOR DEL PERFIL - Sección superior con avatar y texto de bienvenida
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  // WRAPPER DE LA IMAGEN DE PERFIL
  profileImageWrapper: {
    marginRight: 12,
  },

  // IMAGEN DE PERFIL PERSONALIZADA
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },

  // IMAGEN DE PERFIL POR DEFECTO - Cuando no se proporciona imagen
  defaultProfileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },

  // CARA DEL AVATAR - Círculo interno con color de piel
  avatarFace: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#D88EA9', // Color rosa para simular tono de piel
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  // CONTENEDOR DE TEXTO - Información del tutor
  textContainer: {
    flex: 1,
  },

  // TEXTO DE BIENVENIDA - Mensaje principal
  welcomeText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 2,
  },

  // NOMBRE DEL TUTOR - Subtítulo con el nombre
  tutorName: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '500',
  },

  // CONTENEDOR DE CARDS - Sección inferior con las dos cards
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12, // Espacio entre las cards
  },

  // ESTILOS BASE PARA LAS CARDS DE INFORMACIÓN
  infoCard: {
    flex: 1, // Ocupa el mismo espacio disponible
    backgroundColor: 'rgba(255, 255, 255, 0.25)', // Fondo semi-transparente
    borderRadius: 15,
    paddingVertical: 16,
    paddingHorizontal: 12,
    justifyContent: 'center',
    minHeight: 70,
    // Efecto de cristal/blur
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  // CARD IZQUIERDA - Centro de atención
  leftCard: {
    marginRight: 6,
  },

  // CARD DERECHA - Especialista
  rightCard: {
    marginLeft: 6,
  },

  // TÍTULO DE LAS CARDS - Texto superior de cada card
  cardTitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    marginBottom: 4,
    textAlign: 'left',
  },

  // SUBTÍTULO DE LAS CARDS - Información principal de cada card
  cardSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'left',
  },
});

export default HeaderTutor;