import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../core/types/common/navigation';

interface QuickAction {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    onPress: () => void;
}

const QuickActionsSection: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const quickActions: QuickAction[] = [
        {
            title: 'Nuevo Paciente',
            icon: 'person-add',
            color: '#A8C7E5',
            onPress: () => navigation.navigate('Patients', { openAddModal: true })
        },
        {
            title: 'Perfil',
            icon: 'person',
            color: '#C7A8E5',
            onPress: () => navigation.navigate('TherapistProfile')
        }
    ];

    return (
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Acciones rápidas</Text>
            <View style={styles.quickActionsContainer}>
                {quickActions.map((action, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.quickActionButton, { backgroundColor: action.color }]}
                        onPress={action.onPress}
                    >
                        <Ionicons name={action.icon} size={24} color="white" />
                        <Text style={styles.quickActionText}>{action.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 24,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2D3748',
        marginBottom: 2,
    },
    quickActionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    quickActionButton: {
        width: '48%',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 8,
    },
    quickActionText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 8,
        textAlign: 'center',
    },
});

export default QuickActionsSection;