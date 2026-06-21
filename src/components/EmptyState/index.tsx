import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📭',
  title,
  description,
  actionText,
  onAction
}) => {
  return (
    <View className={styles.wrap}>
      <Text className={styles.icon}>{icon}</Text>
      <Text className={styles.title}>{title}</Text>
      {description && <Text className={styles.desc}>{description}</Text>}
      {actionText && onAction && (
        <View className={styles.actionBtn} onClick={onAction}>
          <Text className={styles.actionText}>{actionText}</Text>
        </View>
      )}
    </View>
  );
};

export default EmptyState;
