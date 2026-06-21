import React, { useState, useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { WEEKDAY_NAMES, generateScheduleDates } from '@/utils/date';
import { studioList } from '@/data/studios';
import { teacherList } from '@/data/teachers';
import { scheduleList } from '@/data/schedules';
import { getCourseTypeName } from '@/utils/score';
import type { CourseType, Weekday } from '@/types';
import dayjs from 'dayjs';

const WEEKDAY_SHORT = ['一', '二', '三', '四', '五', '六', '日'];

const courseTypeOptions: { key: CourseType; name: string; emoji: string }[] = [
  { key: 'sketch', name: '素描', emoji: '✏️' },
  { key: 'watercolor', name: '水彩', emoji: '🎨' },
  { key: 'oil', name: '油画', emoji: '🖼️' },
  { key: 'chinese', name: '国画', emoji: '🏮' },
  { key: 'creative', name: '创意', emoji: '💡' },
  { key: 'digital', name: '数字绘画', emoji: '💻' }
];

const CycleConfigPage: React.FC = () => {
  const [selectedWeekdays, setSelectedWeekdays] = useState<Weekday[]>([1, 3, 5]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:30');
  const [weeksCount, setWeeksCount] = useState(8);
  const [maxStudents, setMaxStudents] = useState(12);
  const [courseType, setCourseType] = useState<CourseType>('sketch');
  const [selectedStudioId, setSelectedStudioId] = useState<string>('');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');

  const startDate = useMemo(() => dayjs().format('YYYY-MM-DD'), []);
  const generatedDates = useMemo(() =>
    generateScheduleDates(startDate, selectedWeekdays, weeksCount),
    [startDate, selectedWeekdays, weeksCount]
  );

  const conflictDates = useMemo(() => {
    const result: string[] = [];
    generatedDates.forEach(dateStr => {
      const conflict = scheduleList.some(s =>
        s.date === dateStr &&
        s.studioId === selectedStudioId &&
        ((s.startTime <= startTime && s.endTime > startTime) ||
          (s.startTime < endTime && s.endTime >= endTime))
      );
      if (conflict) result.push(dateStr);
    });
    return result;
  }, [generatedDates, selectedStudioId, startTime, endTime]);

  const toggleWeekday = (day: Weekday) => {
    setSelectedWeekdays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day].sort((a, b) => a - b)
    );
  };

  const openTimePicker = (which: 'start' | 'end') => {
    const current = which === 'start' ? startTime : endTime;
    void current;
    Taro.showActionSheet({
      itemList: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '18:00', '19:00', '20:00'],
      success: (res) => {
        const newTime = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '18:00', '19:00', '20:00'][res.tapIndex];
        if (which === 'start') {
          setStartTime(newTime);
        } else {
          setEndTime(newTime);
        }
      }
    }).catch(() => {});
  };

  const openStudioPicker = () => {
    Taro.showActionSheet({
      itemList: studioList.map(s => `${s.name}（${s.location}）`),
      success: (res) => {
        setSelectedStudioId(studioList[res.tapIndex].id);
      }
    }).catch(() => {});
  };

  const openTeacherPicker = () => {
    Taro.showActionSheet({
      itemList: teacherList.map(t => `${t.name} · ${(t as any).擅长领域?.slice(0, 2).join('/') || '专业教学'}`),
      success: (res) => {
        setSelectedTeacherId(teacherList[res.tapIndex].id);
      }
    }).catch(() => {});
  };

  const stepWeeks = (delta: number) => {
    setWeeksCount(prev => Math.max(1, Math.min(52, prev + delta)));
  };

  const stepStudents = (delta: number) => {
    setMaxStudents(prev => Math.max(1, Math.min(50, prev + delta)));
  };

  const handlePreview = () => {
    if (selectedWeekdays.length === 0) {
      Taro.showToast({ title: '请选择上课周几', icon: 'none' });
      return;
    }
    Taro.showToast({ title: `将生成 ${generatedDates.length} 节课程`, icon: 'none', duration: 2000 });
  };

  const handleGenerate = () => {
    if (selectedWeekdays.length === 0) {
      Taro.showToast({ title: '请选择上课周几', icon: 'none' });
      return;
    }
    if (!selectedStudioId) {
      Taro.showToast({ title: '请选择授课画室', icon: 'none' });
      return;
    }
    if (!selectedTeacherId) {
      Taro.showToast({ title: '请选择授课老师', icon: 'none' });
      return;
    }

    const content = `即将生成 ${generatedDates.length} 节${getCourseTypeName(courseType)}课程，${conflictDates.length} 个时间冲突。` +
      (conflictDates.length > 0 ? '\n冲突的日期将跳过生成。是否确认？' : '');

    Taro.showModal({
      title: '确认批量生成？',
      content,
      confirmColor: '#4F6CF5',
      success: (res) => {
        if (res.confirm) {
          Taro.showLoading({ title: '生成中...' });
          setTimeout(() => {
            Taro.hideLoading();
            Taro.showToast({
              title: `成功生成 ${generatedDates.length - conflictDates.length} 节排课`,
              icon: 'success',
              duration: 2000
            });
            setTimeout(() => {
              Taro.switchTab({ url: '/pages/schedule/index' });
            }, 1500);
          }, 1200);
        }
      }
    });
  };

  const selectedStudio = studioList.find(s => s.id === selectedStudioId);
  const selectedTeacher = teacherList.find(t => t.id === selectedTeacherId);

  return (
    <View className={styles.page}>
      <View className={styles.hero}>
        <Text className={styles.heroTitle}>🔄 周期批量排课</Text>
        <Text className={styles.heroDesc}>配置规则后一键生成未来周期课程</Text>
      </View>

      <View className={styles.content}>
        <View className={styles.card}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>📅</Text>
            上课周期
          </Text>
          <View className={styles.labelRow}>
            <Text className={styles.label}>
              <Text className={styles.requiredStar}>*</Text>每周上课日
            </Text>
            <Text className={styles.valueChip}>{selectedWeekdays.length}天/周</Text>
          </View>
          <View className={styles.weekdayGrid}>
            {(WEEKDAY_SHORT.map((_short, i) => i as Weekday)).map(day => (
              <View
                key={day}
                className={classnames(styles.weekdayChip, selectedWeekdays.includes(day) && styles.weekdayChipActive)}
                onClick={() => toggleWeekday(day)}
              >
                <Text className={styles.weekdayName}>{WEEKDAY_NAMES[day].slice(0, 2)}</Text>
                <Text className={styles.weekdayShort}>{WEEKDAY_SHORT[day]}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.card}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>⏰</Text>
            时间与时长
          </Text>
          <View className={styles.labelRow}>
            <Text className={styles.label}>
              <Text className={styles.requiredStar}>*</Text>上课时段
            </Text>
            <Text className={styles.valueChip}>2.5小时</Text>
          </View>
          <View className={styles.timePickerRow}>
            <View className={styles.timeBox} onClick={() => openTimePicker('start')}>
              <Text className={styles.timeText}>{startTime}</Text>
            </View>
            <Text className={styles.timeSep}>—</Text>
            <View className={styles.timeBox} onClick={() => openTimePicker('end')}>
              <Text className={styles.timeText}>{endTime}</Text>
            </View>
          </View>
        </View>

        <View className={styles.card}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>🔢</Text>
            生成数量
          </Text>
          <View className={styles.stepperRow}>
            <Text className={styles.stepperLabel}>
              <Text className={styles.requiredStar}>*</Text>生成周数
            </Text>
            <View className={styles.stepper}>
              <View className={styles.stepBtn} onClick={() => stepWeeks(-1)}>
                <Text className={styles.stepBtnText}>−</Text>
              </View>
              <Text className={styles.stepValue}>
                {weeksCount}<Text className={styles.stepUnit}>周</Text>
              </Text>
              <View className={styles.stepBtn} onClick={() => stepWeeks(1)}>
                <Text className={styles.stepBtnText}>+</Text>
              </View>
            </View>
          </View>
          <View className={styles.divider} />
          <View className={styles.stepperRow}>
            <Text className={styles.stepperLabel}>
              <Text className={styles.requiredStar}>*</Text>每班人数上限
            </Text>
            <View className={styles.stepper}>
              <View className={styles.stepBtn} onClick={() => stepStudents(-1)}>
                <Text className={styles.stepBtnText}>−</Text>
              </View>
              <Text className={styles.stepValue}>
                {maxStudents}<Text className={styles.stepUnit}>人</Text>
              </Text>
              <View className={styles.stepBtn} onClick={() => stepStudents(1)}>
                <Text className={styles.stepBtnText}>+</Text>
              </View>
            </View>
          </View>
        </View>

        <View className={styles.card}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>🎨</Text>
            课程与师资
          </Text>
          <View className={styles.labelRow}>
            <Text className={styles.label}>
              <Text className={styles.requiredStar}>*</Text>课程类型
            </Text>
          </View>
          <View className={styles.typeGrid}>
            {courseTypeOptions.map(opt => (
              <View
                key={opt.key}
                className={classnames(styles.typeChip, courseType === opt.key && styles.typeChipActive)}
                onClick={() => setCourseType(opt.key)}
              >
                <Text className={styles.typeEmoji}>{opt.emoji}</Text>
                <Text className={styles.typeName}>{opt.name}</Text>
              </View>
            ))}
          </View>
          <View className={styles.divider} />
          <View className={styles.labelRow}>
            <Text className={styles.label}>
              <Text className={styles.requiredStar}>*</Text>授课画室
            </Text>
          </View>
          <View className={styles.selectBox} onClick={openStudioPicker}>
            <Text className={classnames(styles.selectText, !selectedStudio && styles.selectPlaceholder)}>
              {selectedStudio ? `${selectedStudio.name} · 容纳${selectedStudio.capacity}人` : '请选择画室'}
            </Text>
            <Text className={styles.selectArrow}>›</Text>
          </View>
          <View className={styles.divider} />
          <View className={styles.labelRow}>
            <Text className={styles.label}>
              <Text className={styles.requiredStar}>*</Text>授课老师
            </Text>
          </View>
          <View className={styles.selectBox} onClick={openTeacherPicker}>
            <Text className={classnames(styles.selectText, !selectedTeacher && styles.selectPlaceholder)}>
              {selectedTeacher ? selectedTeacher.name : '请选择授课老师'}
            </Text>
            <Text className={styles.selectArrow}>›</Text>
          </View>
        </View>

        {conflictDates.length > 0 && (
          <View className={styles.notice}>
            <Text className={styles.noticeIcon}>⚠️</Text>
            <Text className={styles.noticeText}>
              检测到 {conflictDates.length} 个日期与画室已有排课冲突，生成时将自动跳过冲突日期。
            </Text>
          </View>
        )}

        {generatedDates.length > 0 && (
          <View className={styles.previewSection}>
            <View className={styles.previewHeader}>
              <Text className={styles.previewTitle}>
                <Text className={styles.titleIcon}>📋</Text>生成预览
              </Text>
              <Text className={styles.previewCount}>共 {generatedDates.length} 节</Text>
            </View>
            <View className={styles.previewDates}>
              {generatedDates.slice(0, 8).map((dateStr, idx) => {
                const d = dayjs(dateStr);
                const weekdayIdx = (d.day() + 6) % 7;
                const hasConflict = conflictDates.includes(dateStr);
                return (
                  <View key={idx} className={styles.previewDateItem}>
                    <View className={styles.previewDateLeft}>
                      <Text className={styles.previewEmoji}>📖</Text>
                      <Text className={styles.previewDateText}>
                        {d.format('MM月DD日')} {WEEKDAY_NAMES[weekdayIdx]} {startTime}-{endTime}
                      </Text>
                    </View>
                    <Text className={classnames(styles.previewTag, hasConflict && styles.conflictBadge)}>
                      {hasConflict ? '⛔冲突' : '✅正常'}
                    </Text>
                  </View>
                );
              })}
              {generatedDates.length > 8 && (
                <Text style={{ textAlign: 'center', fontSize: 22, color: '#9094AB', padding: 8 }}>
                  ... 还有 {generatedDates.length - 8} 条待生成
                </Text>
              )}
            </View>
          </View>
        )}
      </View>

      <View className={styles.actionBar}>
        <View className={styles.ghostBtn} onClick={handlePreview}>
          <Text className={styles.ghostBtnText}>预览</Text>
        </View>
        <View
          className={classnames(styles.primaryBtn,
            selectedWeekdays.length === 0 && styles.primaryBtnDisabled)}
          onClick={handleGenerate}
        >
          <Text className={styles.primaryBtnText}>
            一键生成 {generatedDates.length} 节排课
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CycleConfigPage;
