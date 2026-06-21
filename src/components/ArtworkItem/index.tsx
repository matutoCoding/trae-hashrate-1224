import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { getCourseTypeName } from '@/utils/score';
import type { Artwork } from '@/types';

interface ArtworkItemProps {
  artwork: Artwork;
  column?: 1 | 2;
  onClick?: () => void;
}

const ArtworkItem: React.FC<ArtworkItemProps> = ({ artwork, column = 2, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      Taro.navigateTo({
        url: `/pages/artwork-detail/index?id=${artwork.id}`
      }).catch(err => console.error('[ArtworkItem] navigate error:', err));
    }
  };

  const heights = column === 2
    ? [400, 520, 460, 500, 420, 480]
    : [500];
  const heightIdx = Math.abs(artwork.id.charCodeAt(artwork.id.length - 1)) % heights.length;
  const imgHeight = heights[heightIdx];

  return (
    <View className={column === 2 ? styles.twoColCard : styles.card} onClick={handleClick}>
      <Image
        className={styles.image}
        style={{ height: column === 2 ? `${imgHeight}rpx` : '500rpx' }}
        src={artwork.image}
        mode='aspectFill'
      />
      <View className={styles.overlay}>
        <View className={styles.tag}>
          {getCourseTypeName(artwork.courseType)}
        </View>
      </View>
      <View className={styles.content}>
        <Text className={styles.title}>{artwork.title}</Text>
        <View className={styles.author}>
          <Image className={styles.authorAvatar} src={artwork.studentAvatar} mode='aspectFill' />
          <Text className={styles.authorName}>{artwork.studentName}</Text>
        </View>
        <View className={styles.footer}>
          <View className={styles.action}>
            <Text className={styles.actionIcon}>♥</Text>
            <Text className={styles.actionCount}>{artwork.likes}</Text>
          </View>
          <View className={styles.action}>
            <Text className={styles.actionIcon}>💬</Text>
            <Text className={styles.actionCount}>{artwork.comments.length}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ArtworkItem;
