import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import type { QuickEntry as QuickEntryType } from '@/types';

interface QuickEntryProps {
  items: QuickEntryType[];
  columns?: number;
}

const QuickEntry: React.FC<QuickEntryProps> = ({ items, columns = 4 }) => {
  const handleClick = (item: QuickEntryType) => {
    if (item.pagePath) {
      Taro.navigateTo({ url: item.pagePath }).catch(err => {
        console.error('[QuickEntry] navigate error:', err);
      });
    }
  };

  return (
    <View className={styles.grid} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {items.map(item => (
        <View
          key={item.key}
          className={styles.item}
          onClick={() => handleClick(item)}
        >
          <View
            className={styles.iconBox}
            style={{
              background: `linear-gradient(135deg, ${item.bgColor} 0%, ${item.bgColor}80 100%)`
            }}
          >
            <Text className={styles.icon} style={{ color: item.color }}>◆</Text>
          </View>
          <Text className={styles.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
};

export default QuickEntry;
