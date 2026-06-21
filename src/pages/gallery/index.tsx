import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import ArtworkItem from '@/components/ArtworkItem';
import EmptyState from '@/components/EmptyState';
import { artworkList, getArtworkStats } from '@/data/artworks';

const typeFilters: { key: string; label: string }[] = [
  { key: 'all', label: '全部作品' },
  { key: 'sketch', label: '素描' },
  { key: 'watercolor', label: '水彩' },
  { key: 'oil', label: '油画' },
  { key: 'chinese', label: '国画' },
  { key: 'creative', label: '创意' },
  { key: 'digital', label: '数字绘画' }
];

const GalleryPage: React.FC = () => {
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState<'latest' | 'likes'>('latest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [refreshing, setRefreshing] = useState(false);

  const stats = getArtworkStats();

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const filteredArtworks = useMemo(() => {
    let result = [...artworkList];
    if (filterType !== 'all') {
      result = result.filter(a => a.courseType === filterType);
    }
    if (sortBy === 'likes') {
      result.sort((a, b) => b.likes - a.likes);
    } else {
      result.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    }
    return result;
  }, [filterType, sortBy]);

  const handleUpload = () => {
    Taro.showActionSheet({
      itemList: ['拍照上传', '从相册选择', '关联课程上传'],
      success: (res) => {
        Taro.showToast({
          title: `选择了：${['拍照上传', '从相册选择', '关联课程上传'][res.tapIndex]}`,
          icon: 'none'
        });
      }
    }).catch(err => console.error('[Gallery] actionSheet error:', err));
  };

  return (
    <ScrollView
      className={styles.page}
      scrollY
      refresherEnabled
      refresherTriggered={refreshing}
      onRefresherRefresh={onRefresh}
    >
      <View className={styles.hero}>
        <Text className={styles.heroTitle}>🎨 画廊展览</Text>
        <Text className={styles.heroSubtitle}>展示学员作品，记录每一次进步</Text>
        <View className={styles.statsRow}>
          <View className={styles.statCard}>
            <Text className={styles.statValue}>{stats.total}</Text>
            <Text className={styles.statLabel}>作品总数</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statValue}>{stats.totalLikes.toLocaleString()}</Text>
            <Text className={styles.statLabel}>累计点赞</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statValue}>{stats.typeCount}</Text>
            <Text className={styles.statLabel}>画种分类</Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>🖼️</Text>
            全部作品
          </Text>
          <View className={styles.uploadBtn} onClick={handleUpload}>
            <Text className={styles.uploadBtnText}>+ 上传作品</Text>
          </View>
        </View>

        <ScrollView className={styles.filterBar} scrollX enhanced showScrollbar={false}>
          {typeFilters.map(f => (
            <Text
              key={f.key}
              className={classnames(styles.filterChip, filterType === f.key && styles.filterChipActive)}
              onClick={() => setFilterType(f.key)}
            >
              {f.label}
            </Text>
          ))}
        </ScrollView>

        <View className={styles.sortRow}>
          <Text
            className={classnames(styles.sortOption, sortBy === 'latest' && styles.sortOptionActive)}
            onClick={() => setSortBy('latest')}
          >
            最新上传
          </Text>
          <Text
            className={classnames(styles.sortOption, sortBy === 'likes' && styles.sortOptionActive)}
            onClick={() => setSortBy('likes')}
          >
            🔥 最热
          </Text>
          <View className={styles.viewToggle}>
            <Text
              className={classnames(styles.viewBtn, viewMode === 'grid' && styles.viewBtnActive)}
              onClick={() => setViewMode('grid')}
            >
              网格
            </Text>
            <Text
              className={classnames(styles.viewBtn, viewMode === 'list' && styles.viewBtnActive)}
              onClick={() => setViewMode('list')}
            >
              列表
            </Text>
          </View>
        </View>

        {filteredArtworks.length > 0 ? (
          viewMode === 'grid' ? (
            <View className={styles.galleryGrid}>
              {filteredArtworks.map(art => (
                <ArtworkItem key={art.id} artwork={art} column={2} />
              ))}
            </View>
          ) : (
            <View className={styles.galleryList}>
              {filteredArtworks.map(art => (
                <ArtworkItem key={art.id} artwork={art} column={1} />
              ))}
            </View>
          )
        ) : (
          <EmptyState
            icon='🎨'
            title='暂无作品'
            description='上传你的第一幅画作吧！'
            actionText='上传作品'
            onAction={handleUpload}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default GalleryPage;
