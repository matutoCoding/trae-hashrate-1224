import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import ArtworkItem from '@/components/ArtworkItem';
import EmptyState from '@/components/EmptyState';
import { useAppStore } from '@/store';
import type { CourseType } from '@/types';
import dayjs from 'dayjs';

const typeFilters: { key: string; label: string }[] = [
  { key: 'all', label: '全部作品' },
  { key: 'sketch', label: '素描' },
  { key: 'watercolor', label: '水彩' },
  { key: 'oil', label: '油画' },
  { key: 'chinese', label: '国画' },
  { key: 'creative', label: '创意' },
  { key: 'digital', label: '数字绘画' }
];

const courseTypeOptions = ['sketch', 'watercolor', 'oil', 'chinese', 'creative', 'digital'] as CourseType[];
const courseTypeLabels = ['素描', '水彩', '油画', '国画', '创意', '数字绘画'];
const sampleImages = [
  'https://picsum.photos/id/1025/600/800',
  'https://picsum.photos/id/1040/800/600',
  'https://picsum.photos/id/1028/500/700',
  'https://picsum.photos/id/106/600/750',
  'https://picsum.photos/id/1074/700/600',
  'https://picsum.photos/id/1027/500/650'
];
const studentNames = ['沈语桐', '苏念慈', '陈逸飞', '林梦琪', '赵浩然', '周雅诗'];
const teacherNames = ['李明远', '王思雨', '陈丹青', '张艺涵', '林小晴'];

const GalleryPage: React.FC = () => {
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState<'latest' | 'likes'>('latest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [refreshing, setRefreshing] = useState(false);

  const artworks = useAppStore(s => s.artworks);
  const getArtworkStats = useAppStore(s => s.getArtworkStats);
  const addArtwork = useAppStore(s => s.addArtwork);

  const stats = getArtworkStats();

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const filteredArtworks = useMemo(() => {
    let result = [...artworks];
    if (filterType !== 'all') {
      result = result.filter(a => a.courseType === filterType);
    }
    if (sortBy === 'likes') {
      result.sort((a, b) => b.likes - a.likes);
    } else {
      result.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    }
    return result;
  }, [artworks, filterType, sortBy]);

  const handleUpload = () => {
    Taro.showActionSheet({
      itemList: ['拍照上传', '从相册选择', '快速添加示例作品'],
      success: (res) => {
        if (res.tapIndex === 2) {
          const titleList = ['夏日花园', '城市印象', '童趣涂鸦', '静谧湖畔', '古风少女', '梦幻星空'];
          const idx = Math.floor(Math.random() * sampleImages.length);
          const typeIdx = Math.floor(Math.random() * courseTypeOptions.length);
          const sIdx = Math.floor(Math.random() * studentNames.length);
          const tIdx = Math.floor(Math.random() * teacherNames.length);
          const newArtwork = addArtwork({
            title: titleList[idx] + ' · 新作',
            image: sampleImages[idx],
            studentId: `stu${String(sIdx + 1).padStart(3, '0')}`,
            studentName: studentNames[sIdx],
            studentAvatar: `https://picsum.photos/id/${1000 + sIdx}/200/200`,
            courseType: courseTypeOptions[typeIdx],
            teacherId: `t${String(tIdx + 1).padStart(3, '0')}`,
            teacherName: teacherNames[tIdx],
            description: `这是我今天的练习作品，尝试了${courseTypeLabels[typeIdx]}的新技法。老师给了很多宝贵建议，再接再厉！`,
            tags: [courseTypeLabels[typeIdx], '练习', '新作'],
            createdAt: dayjs().format('YYYY-MM-DD')
          });
          Taro.showToast({ title: '上传成功！', icon: 'success' });
          setTimeout(() => {
            Taro.navigateTo({
              url: `/pages/artwork-detail/index?id=${newArtwork.id}`
            }).catch(() => {});
          }, 800);
        } else {
          Taro.showToast({
            title: '上传成功，已添加示例作品',
            icon: 'none'
          });
          setTimeout(() => handleUpload(), 300);
        }
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
