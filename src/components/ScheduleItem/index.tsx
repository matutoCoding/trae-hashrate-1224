import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import type { Schedule } from '@/types';
import { getWeekdayName, getRelativeTime, formatDuration } from '@/utils/date';
import { getCourseTypeName } from '@/utils/score';

interface ScheduleItemProps {
  schedule: Schedule;
  showDate?: boolean;
  onClick?: () => void;
}

const typeColorMap: Record<string, { bg: string; color: string }> = {
  sketch: { bg: '#EEF1FF', color: '#4F6CF5' },
  watercolor: { bg: '#FFF4EC', color: '#FF8C42' },
  oil: { bg: '#FFF0F0', color: '#FF6B6B' },
  chinese: { bg: '#F0FFF4', color: '#34C759' },
  creative: { bg: '#FFF8E1', color: '#FFB800' },
  digital: { bg: '#F3E8FF', color: '#9333EA' }
};

const statusMap: Record<string, { text: string; bg: string; color: string }> = {
  scheduled: { text: '待开课', bg: '#EEF1FF', color: '#4F6CF5' },
  open: { text: '可报名', bg: '#F0FFF4', color: '#34C759' },
  ongoing: { text: '进行中', bg: '#F0FFF4', color: '#34C759' },
  completed: { text: '已结课', bg: '#F2F3F5', color: '#86909C' },
  full: { text: '已报满', bg: '#FFF4EC', color: '#FF8C42' },
  cancelled: { text: '已取消', bg: '#FFF0F0', color: '#FF3B30' }
};

const ScheduleItem: React.FC<ScheduleItemProps> = ({ schedule, showDate = true, onClick }) => {
  const typeStyle = typeColorMap[schedule.courseType] || typeColorMap.sketch;
  const statusStyle = statusMap[schedule.status] || statusMap.scheduled;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      Taro.navigateTo({
        url: `/pages/schedule-detail/index?id=${schedule.id}`
      }).catch(err => console.error('[ScheduleItem] navigate error:', err));
    }
  };

  const isCancelled = schedule.status === 'cancelled';

  return (
    <View className={classnames(styles.card, isCancelled && styles.cardCancelled)} onClick={handleClick}>
      <View className={styles.timeCol}>
        <Text className={styles.time}>{schedule.startTime}</Text>
        <View className={styles.timeLine} />
        <Text className={styles.time}>{schedule.endTime}</Text>
      </View>
      <View className={styles.divider} />
      <View className={styles.content}>
        <View className={styles.topRow}>
          <Text
            className={styles.typeTag}
            style={{ background: typeStyle.bg, color: typeStyle.color }}
          >
            {getCourseTypeName(schedule.courseType)}
          </Text>
          {showDate && (
            <Text className={styles.date}>
              {schedule.date} · {getWeekdayName(schedule.date)} · {getRelativeTime(schedule.date)}
            </Text>
          )}
        </View>
        <Text className={classnames(styles.title, isCancelled && styles.titleCancelled)}>{schedule.title}</Text>
        <View className={styles.infoRow}>
          <View className={styles.infoItem}>
            <Text className={styles.infoIcon}>🏫</Text>
            <Text className={styles.infoText}>{schedule.studioName}</Text>
          </View>
        </View>
        {schedule.teacherName && (
          <View className={styles.infoRow}>
            <View className={styles.infoItem}>
              <Text className={styles.infoIcon}>👨‍🎨</Text>
              <Text className={styles.infoText}>{schedule.teacherName} 老师</Text>
            </View>
          </View>
        )}
        <View className={styles.bottomRow}>
          <View className={styles.progress}>
            <View
              className={styles.progressBar}
              style={{ width: `${(schedule.studentCount / schedule.maxCapacity) * 100}%` }}
            />
          </View>
          <Text className={styles.studentCount}>
            {schedule.studentCount}/{schedule.maxCapacity} 人
          </Text>
          <Text
            className={classnames(styles.statusBadge)}
            style={{ background: statusStyle.bg, color: statusStyle.color }}
          >
            {statusStyle.text}
          </Text>
        </View>
        <View className={styles.durationRow}>
          <Text className={styles.duration}>⏱ 时长 {formatDuration(schedule.startTime, schedule.endTime)}</Text>
        </View>
      </View>
    </View>
  );
};

export default ScheduleItem;
