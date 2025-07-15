import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { extractRoleFromToken } from '../../core/composables/authComposables';
import type { RootStackParamList } from '../../core/types/common/navigation';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootState } from '../../core/stores/store';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

const RoleBasedScreen: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  const { accessToken } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (accessToken) {
      const role = extractRoleFromToken(accessToken);

      switch (role) {
        case 'SuperAdmin':
        case 'ClinicAdmin':
          navigation.replace('Dashboard');
          break;
        case 'Tutor':
          navigation.replace('HomeTutor');
          break;
        default:
          navigation.replace('Auth');
          break;
      }
    } else {
      navigation.replace('Auth');
    }
  }, [accessToken, navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#91bddf" />
    </View>
  );
};

export default RoleBasedScreen;
