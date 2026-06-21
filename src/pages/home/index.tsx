import React, { useState } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import ScheduleItem from '@/components/ScheduleItem';
import QuickEntry from '@/components/QuickEntry';
import { useAppStore } from '@/store';
import { formatDate } from '@/utils/date';
import type { QuickEntry as QuickEntryType } from '@/types';

const quickEntries: QuickEntryType[] = [
  { key: 'schedule', label: '周期排课', color: '#4F6CF5', bgColor: '#EEF1FF', pagePath: '/pages/cycle-config/index' },
  { key: 'match', label: '意愿登记', color: '#FF8C42', bgColor: '#FFF4EC', pagePath: '/pages/match/index' },
  { key: 'studio', label: '画室管理', color: '#34C759', bgColor: '#F0FFF4', pagePath: '/pages/schedule/index' },
  { key: 'upload', label: '上传画作', color: '#9333EA', bgColor: '#F3E8FF', pagePath: '/pages/gallery/index' }
];

const HomePage: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);

  const schedules = useAppStore(s => s.schedules);
  const matches = useAppStore(s => s.matches);
  const artworks = useAppStore(s => s.artworks);
  const getMatchStats = useAppStore(s => s.getMatchStats);

  const todayStr = formatDate(new Date());
  const todaySchedules = schedules.filter(s => s.date === todayStr && s.status !== 'cancelled');
  const matchStats = getMatchStats();
  const mutualMatches = matches.filter(m => m.mutual).slice(0, 2);
  const previewArtworks = artworks.slice(0, 3);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const navigateMore = (path: string) => {
    Taro.switchTab({ url: path }).catch(() => {
      Taro.navigateTo({ url: path }).catch(err => console.error('[Home] navigate error:', err));
    });
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
        <View className={styles.heroTop}>
          <View className={styles.userInfo}>
            <Image
              className={styles.avatar}
              src='https://picsum.photos/id/1062/200/200'
              mode='aspectFill'
            />
            <View className={styles.userText}>
              <Text className={styles.greeting}>你好，语桐 ✨</Text>
              <Text className={styles.subGreeting}>今天也是美好的画画日</Text>
            </View>
          </View>
          <View className={styles.roleTag}>
            <Text className={styles.roleText}>🎨 学员身份</Text>
          </View>
        </View>
        <View className={styles.heroStats}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{schedules.filter(s => s.status !== 'cancelled').length}</Text>
            <Text className={styles.statLabel}>总课程</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{matchStats.mutual}</Text>
            <Text className={styles.statLabel}>互选成功</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{artworks.length}</Text>
            <Text className={styles.statLabel}>作品归档</Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.quickSection}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.titleIcon}>⚡</Text>
              快捷入口
            </Text>
          </View>
          <QuickEntry items={quickEntries} columns={4} />
        </View>

        <View className={styles.todaySection}>
          <View className={styles.sectionHeader}>
            <View className={styles.todayHeader}>
              <Text className={styles.sectionTitle}>
                <Text className={styles.titleIcon}>📅</Text>
                今日课程
              </Text>
              <Text className={styles.todayDate}>{todayStr} {formatDate(new Date(), 'dddd')}</Text>
            </View>
            <Text className={styles.sectionMore} onClick={() => navigateMore('/pages/schedule/index')}>
              查看全部 →
            </Text>
          </View>
          <View className={styles.todaySchedule}>
            {todaySchedules.length > 0 ? (
              todaySchedules.map(s => (
                <ScheduleItem key={s.id} schedule={s} showDate={false} />
              ))
            ) : (
              <View className={styles.emptyToday}>
                <Text className={styles.emptyIcon}>🌿</Text>
                <Text className={styles.emptyText}>今日暂无课程，享受自由创作时光</Text>
              </View>
            )}
          </View>
        </View>

        <View className={styles.matchTeaser}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.titleIcon}>🤝</Text>
              最新互选
            </Text>
            <Text className={styles.sectionMore} onClick={() => navigateMore('/pages/match/index')}>
              全部撮合 →
            </Text>
          </View>
          {mutualMatches.length > 0 ? (
            mutualMatches.map(match => (
              <View key={match.id} className={styles.matchRow}>
                <View className={styles.matchPersons}>
                  <Image className={styles.matchAvatar} src={match.studentAvatar} mode='aspectFill' />
                  <View className={styles.matchNames}>
                    <Text className={styles.matchName}>
                      {match.studentName} ⇄ {match.teacherName}
                    </Text>
                    <Text className={styles.matchDesc}>双方都表达了教学意愿</Text>
                  </View>
                </View>
                <View className={styles.matchScoreBadge}>
                  <Text className={styles.matchScore}>{match.totalScore}分</Text>
                </View>
              </View>
            ))
          ) : (
            <View className={styles.emptyToday}>
              <Text className={styles.emptyIcon}>💭</Text>
              <Text className={styles.emptyText}>暂无互选结果，去登记意愿吧</Text>
            </View>
          )}
        </View>

        <View className={styles.gallerySection}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.titleIcon}>🖼️</Text>
              精选画廊
            </Text>
            <Text className={styles.sectionMore} onClick={() => navigateMore('/pages/gallery/index')}>
              更多作品 →
            </Text>
          </View>
          <View className={styles.galleryPreview}>
            {previewArtworks.map(art => (
              <Image
                key={art.id}
                className={styles.galleryImg}
                src={art.image}
                mode='aspectFill'
                onClick={() => Taro.navigateTo({ url: `/pages/artwork-detail/index?id=${art.id}` })}
              />
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomePage;
