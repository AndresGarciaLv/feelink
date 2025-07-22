import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from "react-native-gifted-charts";
import { ToyData, AllToysData  } from '../../../../core/types/common/toyTypes';

const { width: screenWidth } = Dimensions.get('window');

interface StressDistributionChartProps {
  allToysData: AllToysData;
}

const StressDistributionChart: React.FC<StressDistributionChartProps> = ({ allToysData }) => {
  const getStressDistributionData = () => {
    const toyIds = Object.keys(allToysData);
    const ranges = [
      { label: '0-20%', min: 0, max: 20, count: 0, color: '#2E7D57' },
      { label: '21-40%', min: 21, max: 40, count: 0, color: '#4A90E2' },
      { label: '41-60%', min: 41, max: 60, count: 0, color: '#F5A623' },
      { label: '61-80%', min: 61, max: 80, count: 0, color: '#FF8C00' },
      { label: '81-100%', min: 81, max: 100, count: 0, color: '#D0021B' }
    ];

    toyIds.forEach(toyId => {
      const toyData = allToysData[toyId];
      if (toyData && toyData.pressurePercent.length > 0) {
        const currentPressure = toyData.pressurePercent[toyData.pressurePercent.length - 1] || 0;
        const range = ranges.find(r => currentPressure >= r.min && currentPressure <= r.max);
        if (range) range.count++;
      }
    });

    return ranges.map((range, index) => ({
      value: range.count,
      label: range.label,
      frontColor: range.color,
      gradientColor: range.color,
      spacing: 8,
    }));
  };

  const stressDistributionData = getStressDistributionData();

  return (
    <View style={styles.chartCard}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>DISTRIBUCIÓN DE NIVELES DE ESTRÉS</Text>
        <Text style={styles.chartSubtitle}>Rangos de presión por paciente</Text>
      </View>
      
      <View style={styles.barChartContainer}>
        <BarChart
          data={stressDistributionData}
          width={screenWidth - 80}
          height={200}
          barWidth={35}
          spacing={20}
          roundedTop
          roundedBottom
          hideRules
          yAxisThickness={1}
          xAxisThickness={1}
          yAxisColor="#E1E8ED"
          xAxisColor="#E1E8ED"
          yAxisTextStyle={styles.axisText}
          xAxisLabelTextStyle={styles.axisLabelText}
          noOfSections={4}
          maxValue={Math.max(...stressDistributionData.map(d => d.value)) + 2}
          showGradient
          gradientColor="rgba(255,255,255,0.8)"
        />
      </View>
      
      <View style={styles.rangeDescription}>
        <Text style={styles.rangeText}>
          Rango Normal: 0-40% | Precaución: 41-60% | Crítico: 61-100%
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E1E8ED',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chartHeader: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F7FAFC',
    paddingBottom: 12,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    letterSpacing: 0.5,
  },
  chartSubtitle: {
    fontSize: 13,
    color: '#718096',
    marginTop: 4,
  },
  barChartContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  axisText: {
    fontSize: 10,
    color: '#718096',
  },
  axisLabelText: {
    fontSize: 9,
    color: '#4A5568',
    fontWeight: '500',
  },
  rangeDescription: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F7FAFC',
  },
  rangeText: {
    fontSize: 11,
    color: '#718096',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default StressDistributionChart;