import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import classnames from 'classnames';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
  bgGradient?: string;
  icon?: string;
  className?: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  unit,
  color = '#4F6CF5',
  bgGradient,
  icon,
  className,
  onClick
}) => {
  return (
    <View
      className={classnames(styles.card, className)}
      style={{
        background: bgGradient || `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`
      }}
      onClick={onClick}
    >
      {icon && <Text className={styles.icon}>{icon}</Text>}
      <View className={styles.content}>
        <View className={styles.valueRow}>
          <Text className={styles.value} style={{ color }}>{value}</Text>
          {unit && <Text className={styles.unit}>{unit}</Text>}
        </View>
        <Text className={styles.label}>{label}</Text>
      </View>
    </View>
  );
};

export default StatCard;
