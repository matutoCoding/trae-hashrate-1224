import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import type { Studio } from '@/types';

interface StudioCardProps {
  studio: Studio;
  compact?: boolean;
  onClick?: () => void;
}

const StudioCard: React.FC<StudioCardProps> = ({ studio, compact = false, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      Taro.navigateTo({
        url: `/pages/studio-detail/index?id=${studio.id}`
      }).catch(err => console.error('[StudioCard] navigate error:', err));
    }
  };

  return (
    <View className={compact ? styles.compactCard : styles.card} onClick={handleClick}>
      <Image
        className={compact ? styles.compactCover : styles.cover}
        src={studio.coverImage}
        mode='aspectFill'
      />
      <View className={compact ? styles.compactContent : styles.content}>
        <View className={styles.header}>
          <Text className={styles.name}>{studio.name}</Text>
          <View className={styles.rating}>
            <Text className={styles.star}>★</Text>
            <Text className={styles.ratingNum}>{studio.rating}</Text>
          </View>
        </View>
        <View className={styles.addressRow}>
          <Text className={styles.addressIcon}>📍</Text>
          <Text className={styles.address}>{studio.address}</Text>
        </View>
        <View className={styles.facilities}>
          {studio.facilities.slice(0, compact ? 2 : 4).map((f, i) => (
            <Text key={i} className={styles.facilityTag}>{f}</Text>
          ))}
          {studio.facilities.length > (compact ? 2 : 4) && (
            <Text className={styles.facilityTag}>+{studio.facilities.length - (compact ? 2 : 4)}</Text>
          )}
        </View>
        <View className={styles.footer}>
          <Text className={styles.capacity}>容纳 {studio.capacity} 人</Text>
          <Text className={styles.more}>查看详情 →</Text>
        </View>
      </View>
    </View>
  );
};

export default StudioCard;
