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
    borderRadius: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(250, 250, 250, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
  },
});

export default StatsCard;