import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '@/constants/colors';
import Card from './Card';

interface StatItemProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, icon, color }) => {
  return (
    <View style={styles.statItem}>
      {icon && <View style={[styles.iconContainer, color && { backgroundColor: color }]}>{icon}</View>}
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
};

interface StatsCardProps {
  title?: string;
  stats: StatItemProps[];
  columns?: 2 | 3;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, stats, columns = 2 }) => {
  return (
    <Card title={title}>
      <View style={[styles.statsContainer, { flexDirection: columns === 3 ? 'row' : 'column' }]}>
        {stats.map((stat, index) => (
          <StatItem
            key={index}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    minWidth: '45%',
    marginBottom: 16,
    backgroundColor: Colors.dark.cardAlt,
    padding: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.dark.border,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 133, 162, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 133, 162, 0.3)',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
});

export default StatsCard;