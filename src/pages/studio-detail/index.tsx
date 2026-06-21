import React, { useMemo } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { studioList } from '@/data/studios';
import { scheduleList } from '@/data/schedules';
import dayjs from 'dayjs';

const facilityMap: Record<string, { icon: string; name: string }> = {
  画架: { icon: '🎨', name: '画架' },
  画板: { icon: '📋', name: '画板' },
  静物台: { icon: '🏺', name: '静物台' },
  模特台: { icon: '🪑', name: '模特台' },
  投影仪: { icon: '📽️', name: '投影' },
  空调: { icon: '❄️', name: '空调' },
  储物柜: { icon: '🗄️', name: '储物柜' },
  休息区: { icon: '🛋️', name: '休息区' }
};

const StudioDetailPage: React.FC = () => {
  const router = useRouter();
  const id = router.params.id || 'stu001';
  const studio = useMemo(() => studioList.find(s => s.id === id) || studioList[0], [id]);
  const studioSchedules = scheduleList.filter(s => s.studioId === studio.id);
  const todayCount = studioSchedules.filter(s => dayjs(s.date).isSame(dayjs(), 'day')).length;

  const onBack = () => {
    const pages = Taro.getCurrentPages();
    if (pages.length > 1) {
      Taro.navigateBack().catch(() => Taro.switchTab({ url: '/pages/schedule/index' }));
    } else {
      Taro.switchTab({ url: '/pages/schedule/index' });
    }
  };

  const onBook = () => {
    Taro.showActionSheet({
      itemList: ['预约今日课程', '查看排期表', '设置周期规则'],
      success: (res) => {
        if (res.tapIndex === 0 || res.tapIndex === 1) {
          Taro.switchTab({ url: '/pages/schedule/index' });
        } else {
          Taro.navigateTo({ url: '/pages/cycle-config/index' });
        }
      }
    }).catch(err => console.error('[StudioDetail] actionSheet error:', err));
  };

  return (
    <View className={styles.page}>
      <View className={styles.heroImage}>
        <Text className={styles.heroIcon}>🏛️</Text>
        <View className={styles.backBtn} onClick={onBack}>
          <Text className={styles.backText}>‹</Text>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.infoCard}>
          <View className={styles.nameRow}>
            <View className={styles.nameLeft}>
              <Text className={styles.name}>{studio.name}</Text>
              <View className={styles.ratingRow}>
                <Text className={styles.stars}>★★★★★</Text>
                <Text className={styles.ratingValue}>{studio.rating.toFixed(1)}</Text>
                <Text className={styles.ratingCount}>({studio.reviewCount}评价)</Text>
              </View>
            </View>
          </View>

          <View className={styles.tags}>
            {studio.typeTags.map(t => (
              <Text key={t} className={styles.tag}>{t}</Text>
            ))}
          </View>

          <View className={styles.divider} />

          <View className={styles.infoGrid}>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>📍 位置</Text>
              <Text className={styles.infoValue}>{studio.location}</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>👥 容纳人数</Text>
              <Text className={styles.infoValue}>{studio.capacity}人</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>📅 今日排课</Text>
              <Text className={styles.infoValue}>{todayCount}节</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>⏰ 开放时间</Text>
              <Text className={styles.infoValue}>09:00-21:00</Text>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>📖</Text>
            画室介绍
          </Text>
          <Text className={styles.descText}>
            {studio.name}是艺绘学堂旗下的专业美术培训画室，配备全套专业绘画设备，适合开展素描、水彩、油画、国画等多种课程。画室采用自然光+专业补光设计，为学员提供最佳创作环境。
          </Text>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>🛠️</Text>
            设施设备
          </Text>
          <View className={styles.facilities}>
            {studio.facilities.map(f => {
              const info = facilityMap[f] || { icon: '✨', name: f };
              return (
                <View key={f} className={styles.facility}>
                  <View className={styles.facilityIcon}>
                    <Text>{info.icon}</Text>
                  </View>
                  <Text className={styles.facilityName}>{info.name}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      <View className={styles.bookingBar}>
        <View className={styles.priceBox}>
          <Text className={styles.priceLabel}>课程均价</Text>
          <Text className={styles.priceValue}>
            ¥{studio.pricePerHour}<Text className={styles.priceUnit}>/课时</Text>
          </Text>
        </View>
        <View className={styles.bookBtn} onClick={onBook}>
          <Text className={styles.bookBtnText}>预约使用</Text>
        </View>
      </View>
    </View>
  );
};

export default StudioDetailPage;
