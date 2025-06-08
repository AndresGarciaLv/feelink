import React from 'react';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions, View, Text } from 'react-native';
import { ResumenEstados } from '../../../core/types/common/PatientChart';

const screenWidth = Dimensions.get('window').width;

interface Props {
    resumen: ResumenEstados;
}

const SummaryChart: React.FC<Props> = ({ resumen }) => {
    const safeResumen = {
        estable: resumen.estable || 0,
        ansioso: resumen.ansioso || 0,
        crisis: resumen.crisis || 0,
    };

    const total = safeResumen.estable + safeResumen.ansioso + safeResumen.crisis;

    const COLORS = {
        green: 'rgba(137, 197, 139, 0.5)', // Estable
        yellow: 'rgba(216, 219, 86, 0.5)', // Ansioso
        red: ' rgba(210, 115, 115, 0.5)', // Crisis
    };


    const pieData = [
        {
            name: `Estable`,
            population: safeResumen.estable,
            color: COLORS.green,
            legendFontColor: '#2E3A59',
            legendFontSize: 13,
        },
        {
            name: `Ansioso`,
            population: safeResumen.ansioso,
            color: COLORS.yellow,
            legendFontColor: '#2E3A59',
            legendFontSize: 13,
        },
        {
            name: `Crisis`,
            population: safeResumen.crisis,
            color: COLORS.red,
            legendFontColor: '#2E3A59',
            legendFontSize: 13,
        },
    ];

    return (
        <View style={{ padding: 16 }}>
            <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>
                Distribución de Estados Emocionales
            </Text>            

            <PieChart
                data={pieData}
                width={screenWidth - 32}
                height={240}
                chartConfig={{
                    backgroundColor: '#fff',
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="20"
            />

            {total === 0 && (
                <Text style={{ textAlign: 'center', marginTop: 10, color: 'gray' }}>
                    No hay datos suficientes para mostrar el gráfico.
                </Text>
            )}
        </View>
    );
};

export default SummaryChart;
