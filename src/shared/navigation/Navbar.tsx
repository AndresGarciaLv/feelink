import React from 'react';
import { View, Text, StyleSheet, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NavbarProps {
  doctorName?: string;
  hospitalName?: string;
  profileImage?: any;
}

const Navbar: React.FC<NavbarProps> = ({
  doctorName = 'Dr. Ricardo Chi',
  hospitalName = 'Hospital Sunrise',
  profileImage,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.profileContainer}>
          <View style={styles.profileImageWrapper}>
            {profileImage ? (
              <Image source={profileImage} style={styles.profileImage} />
            ) : (
              <View style={styles.defaultProfileImage}>
                <View style={styles.avatarFace}>
                <Ionicons name="person" size={35} color="black" />
                </View>
              </View>
            )}
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.welcomeText}>Bienvenido a FeeLink :)</Text>
            <Text style={styles.doctorName}>{doctorName}</Text>
          </View>
        </View>

        <View style={styles.hospitalContainer}>
          <Text style={styles.hospitalText}>{hospitalName}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#b7d4ec', // Color base que parece en el degradado
    paddingTop: Platform.OS === 'android' ? 50 : 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  content: {
    flex: 1,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageWrapper: {
    marginRight: 12,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  defaultProfileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#9BC4E0',
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 2,
    // borderColor: '#C2E1F5',
  },
  avatarFace: {
    width: 52,
    height: 52,
    borderRadius: 30,
    backgroundColor: '#d88ea9',
        justifyContent: 'center',
    alignItems: 'center',
      borderWidth: 1.5,
    borderColor: 'white'
  },

   patientAvatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F0FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  doctorName: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  hospitalContainer: {
    backgroundColor: '#9bc4e0', // color muy similar al de la referencia
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  hospitalText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Navbar;
