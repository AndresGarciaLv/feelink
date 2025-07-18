import React from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface NavbarProps {
  doctorName?: string;
  hospitalName?: string;
  profileImage?: any;
  onBackPress?: () => void;
}

const 
Navbar: React.FC<NavbarProps> = ({
  doctorName = 'Dr. Ricardo Chi',
  hospitalName = 'Hospital Sunrise',
  profileImage,
  onBackPress,
}) => {
  return (
    <LinearGradient
      colors={['#9bc4e0', '#cbe0f4']} 
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.topRow}>
          {onBackPress && (
            <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
          )}
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
        </View>
        
        <LinearGradient
          colors={['#7ba8d1', '#9bc4e0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.hospitalContainer}
        >
          <Text style={styles.hospitalText}>{hospitalName}</Text>
        </LinearGradient>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
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
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 12,
    padding: 8,
    alignSelf: 'flex-start',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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