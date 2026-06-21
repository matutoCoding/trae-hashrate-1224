import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import StudioCard from '@/components/StudioCard';
import ScheduleItem from '@/components/ScheduleItem';
import EmptyState from '@/components/EmptyState';
import { cycleRuleList } from '@/data/schedules';
import { studioList } from '@/data/studios';
import { WEEKDAY_NAMES, generateScheduleDates } from '@/utils/date';
import { getCourseTypeName } from '@/utils/score';
import { useAppStore } from '@/store';
import type { CycleRule, CourseType, Schedule } from '@/types';

const typeColorMap: Record<string, { bg: string; color: string }> = {
  sketch: { bg: '#EEF1FF', color: '#4F6CF5' },
  watercolor: { bg: '#FFF4EC', color: '#FF8C42' },
  oil: { bg: '#FFF0F0', color: '#FF6B6B' },
  chinese: { bg: '#F0FFF4', color: '#34C759' },
  creative: { bg: '#FFF8E1', color: '#FFB800' },
  digital: { bg: '#F3E8FF', color: '#9333EA' }
};

const tabs = [
  { key: 'rules', label: '周期规则' },
  { key: 'schedule', label: '课程排期' },
  { key: 'studios', label: '画室档案' }
];

const courseFilters: { key: string; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'sketch', label: '素描' },
  { key: 'watercolor', label: '水彩' },
  { key: 'oil', label: '油画' },
  { key: 'chinese', label: '国画' },
  { key: 'creative', label: '创意' },
  { key: 'digital', label: '数字' }
];

const SchedulePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('rules');
  const [filterType, setFilterType] = useState('all');
  const [showCancelled, setShowCancelled] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const schedules = useAppStore(s => s.schedules);
  const addSchedules = useAppStore(s => s.addSchedules);
  const scheduleIdSeq = useAppStore(s => s.scheduleIdSeq);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const visibleSchedules = useMemo(() => {
    if (showCancelled) return schedules;
    return schedules.filter(s => s.status !== 'cancelled');
  }, [schedules, showCancelled]);

  const filteredSchedules = filterType === 'all'
    ? visibleSchedules
    : visibleSchedules.filter(s => s.courseType === filterType);

  const handleGenerate = (rule: CycleRule) => {
    const dates = generateScheduleDates(rule.startDate, rule.weekdays, rule.weeksCount);
    const existingSet = new Set(schedules.map(s => `${s.date}-${s.startTime}-${s.endTime}-${s.studioId}`));
    const skipped = dates.filter(d =>
      schedules.some(s =>
        s.date === d &&
        s.studioId === rule.studioId &&
        s.status !== 'cancelled' &&
        ((s.startTime <= rule.startTime && s.endTime > rule.startTime) ||
          (s.startTime < rule.endTime && s.endTime >= rule.endTime))
      )
    ).length;
    const expected = dates.length - skipped;

    let content = `📋 计划生成：${dates.length} 节`;
    if (skipped > 0) {
      content += `\n⛔ 跳过冲突：${skipped} 节`;
    }
    content += `\n✅ 实际新增：${expected} 节`;

    Taro.showModal({
      title: '批量生成排期',
      content,
      confirmText: '确认生成',
      success: (res) => {
        if (res.confirm) {
          Taro.showLoading({ title: '生成中...' });
          setTimeout(() => {
            const nonConflictDates = dates.filter(d =>
              !schedules.some(s =>
                s.date === d &&
                s.studioId === rule.studioId &&
                s.status !== 'cancelled' &&
                ((s.startTime <= rule.startTime && s.endTime > rule.startTime) ||
                  (s.startTime < rule.endTime && s.endTime >= rule.endTime))
              )
            );
            const newSchedules: Schedule[] = nonConflictDates.map((dateStr, idx) => {
              const seqNum = scheduleIdSeq + idx + 1;
              return {
                id: `sch${String(seqNum).padStart(3, '0')}`,
                title: rule.name.split('·')[0] || getCourseTypeName(rule.courseType) + '课',
                date: dateStr,
                startTime: rule.startTime,
                endTime: rule.endTime,
                courseType: rule.courseType,
                studioId: rule.studioId,
                studioName: rule.studioName,
                teacherId: 't001',
                teacherName: '李明远',
                studentIds: [],
                studentCount: 0,
                maxCapacity: 10,
                level: rule.courseType === 'oil' ? 'intermediate' : 'beginner',
                maxStudents: 10,
                enrolledCount: 0,
                enrolledStudentIds: [],
                status: 'open',
                cycleRuleId: rule.id
              } as Schedule;
            });
            const added = addSchedules(newSchedules);
            Taro.hideLoading();
            Taro.showToast({
              title: `✅ 实际新增 ${added} 节`,
              icon: 'success'
            });
            setActiveTab('schedule');
          }, 800);
        }
      }
    }).catch(err => console.error('[Schedule] modal error:', err));
  };

  const goToConfig = () => {
    Taro.navigateTo({ url: '/pages/cycle-config/index' })
      .catch(err => console.error('[Schedule] navigate error:', err));
  };

  return (
    <ScrollView
      className={styles.page}
      scrollY
      refresherEnabled
      refresherTriggered={refreshing}
      onRefresherRefresh={onRefresh}
    >
      <View className={styles.tabs}>
        {tabs.map(tab => (
          <Text
            key={tab.key}
            className={classnames(styles.tab, activeTab === tab.key && styles.tabActive)}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </Text>
        ))}
      </View>

      <View className={styles.content}>
        {activeTab === 'rules' && (
          <>
            <View className={styles.sectionTitleRow}>
              <Text className={styles.sectionTitle}>
                <Text className={styles.titleIcon}>📋</Text>
                周期规则
              </Text>
              <View className={styles.addBtn} onClick={goToConfig}>
                <Text className={styles.addBtnText}>+ 新增规则</Text>
              </View>
            </View>
            {cycleRuleList.length > 0 ? (
              cycleRuleList.map(rule => {
                const typeStyle = typeColorMap[rule.courseType] || typeColorMap.sketch;
                return (
                  <View key={rule.id} className={styles.ruleCard}>
                    <View className={styles.ruleHeader}>
                      <Text className={styles.ruleTitle}>{rule.name}</Text>
                      <Text
                        className={styles.courseTypeTag}
                        style={{ background: typeStyle.bg, color: typeStyle.color }}
                      >
                        {getCourseTypeName(rule.courseType)}
                      </Text>
                    </View>
                    <View className={styles.weekdayTags} style={{ marginBottom: '16rpx' }}>
                      {rule.weekdays.map(wd => (
                        <Text key={wd} className={styles.weekdayTag}>{WEEKDAY_NAMES[wd]}</Text>
                      ))}
                      <Text className={styles.weekdayTag}>{rule.startTime} - {rule.endTime}</Text>
                    </View>
                    <View className={styles.ruleInfo}>
                      <View className={styles.ruleInfoItem}>
                        <Text className={styles.ruleInfoLabel}>适用画室</Text>
                        <Text className={styles.ruleInfoValue}>{rule.studioName}</Text>
                      </View>
                      <View className={styles.ruleInfoItem}>
                        <Text className={styles.ruleInfoLabel}>生成周期</Text>
                        <Text className={styles.ruleInfoValue}>{rule.weeksCount} 周</Text>
                      </View>
                      <View className={styles.ruleInfoItem}>
                        <Text className={styles.ruleInfoLabel}>起始日期</Text>
                        <Text className={styles.ruleInfoValue}>{rule.startDate}</Text>
                      </View>
                      <View className={styles.ruleInfoItem}>
                        <Text className={styles.ruleInfoLabel}>预计课次</Text>
                        <Text className={styles.ruleInfoValue}>
                          {rule.weekdays.length * rule.weeksCount} 节
                        </Text>
                      </View>
                    </View>
                    <View className={styles.ruleFooter}>
                      <View className={styles.ruleStatus}>
                        <View className={styles.ruleStatusDot} />
                        <Text className={styles.ruleStatusText}>规则启用中</Text>
                      </View>
                      <View className={styles.generateBtn} onClick={() => handleGenerate(rule)}>
                        <Text className={styles.generateBtnText}>⚡ 批量生成</Text>
                      </View>
                    </View>
                  </View>
                );
              })
            ) : (
              <EmptyState
                icon='📋'
                title='暂无周期规则'
                description='创建周期规则，可自动按周批量生成课程排期'
                actionText='创建规则'
                onAction={goToConfig}
              />
            )}
          </>
        )}

        {activeTab === 'schedule' && (
          <>
            <View className={styles.sectionTitleRow}>
              <Text className={styles.sectionTitle}>
                <Text className={styles.titleIcon}>📅</Text>
                课程排期
              </Text>
              <View
                style={{
                  padding: '8rpx 20rpx',
                  borderRadius: '48rpx',
                  background: showCancelled ? '#FFF0F0' : '#F2F3F5',
                  display: 'flex',
                  alignItems: 'center'
                }}
                onClick={() => setShowCancelled(!showCancelled)}
              >
                <Text style={{ fontSize: 22, color: showCancelled ? '#FF3B30' : '#86909C' }}>
                  {showCancelled ? '隐藏已取消' : '显示已取消'}
                </Text>
              </View>
            </View>
            <ScrollView className={styles.filterBar} scrollX enhanced showScrollbar={false}>
              {courseFilters.map(f => (
                <Text
                  key={f.key}
                  className={classnames(styles.filterChip, filterType === f.key && styles.filterChipActive)}
                  onClick={() => setFilterType(f.key)}
                >
                  {f.label}
                </Text>
              ))}
            </ScrollView>
            <View className={styles.scheduleList}>
              {filteredSchedules.length > 0 ? (
                filteredSchedules.map(s => (
                  <ScheduleItem key={s.id} schedule={s} />
                ))
              ) : (
                <EmptyState
                  icon='📅'
                  title='暂无课程排期'
                  description='先创建周期规则，然后批量生成排期吧'
                  actionText='去创建规则'
                  onAction={() => setActiveTab('rules')}
                />
              )}
            </View>
          </>
        )}

        {activeTab === 'studios' && (
          <View className={styles.studioSection}>
            <View className={styles.sectionTitleRow}>
              <Text className={styles.sectionTitle}>
                <Text className={styles.titleIcon}>🏫</Text>
                画室档案
              </Text>
            </View>
            <View className={styles.studioList}>
              {studioList.length > 0 ? (
                studioList.map(studio => (
                  <StudioCard key={studio.id} studio={studio} compact />
                ))
              ) : (
                <EmptyState
                  icon='🏫'
                  title='暂无画室档案'
                  description='添加画室信息以便排课使用'
                />
              )}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default SchedulePage;
