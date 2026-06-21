import React, { useMemo } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import { studioList } from '@/data/studios';
import { teacherList } from '@/data/teachers';
import { studentList } from '@/data/students';
import { getCourseTypeName, getLevelName, getStatusLabel } from '@/utils/score';
import { WEEKDAY_NAMES, formatDuration } from '@/utils/date';
import { useAppStore } from '@/store';
import dayjs from 'dayjs';
import classnames from 'classnames';

const timeOptions = ['09:00', '10:00', '14:00', '15:00', '16:00', '18:30', '19:30'];

const ScheduleDetailPage: React.FC = () => {
  const router = useRouter();
  const id = router.params.id || 'sch001';
  const getScheduleById = useAppStore(s => s.getScheduleById);
  const updateSchedule = useAppStore(s => s.updateSchedule);
  const cancelSchedule = useAppStore(s => s.cancelSchedule);
  const schedules = useAppStore(s => s.schedules);

  const schedule = useMemo(() => getScheduleById(id) || schedules[0], [id, getScheduleById, schedules]);
  const studio = useMemo(() => studioList.find(s => s.id === schedule?.studioId), [schedule]);
  const teacher = useMemo(() => teacherList.find(t => t.id === schedule?.teacherId), [schedule]);
  const enrolledStudents = useMemo(() =>
    schedule ? studentList.filter(stu => schedule.enrolledStudentIds.includes(stu.id)) : [],
    [schedule]
  );

  if (!schedule) {
    return (
      <View style={{ padding: 100, textAlign: 'center' }}>
        <Text style={{ fontSize: 28, color: '#999' }}>课程不存在</Text>
      </View>
    );
  }

  const progress = Math.round((schedule.enrolledCount / schedule.maxStudents) * 100);
  const dateObj = dayjs(schedule.date);

  const handleAdjust = () => {
    Taro.showActionSheet({
      itemList: ['调整时间', '更换画室', '更换老师', '取消课程'],
      success: (res) => {
        if (res.tapIndex === 0) {
          Taro.showActionSheet({
            itemList: timeOptions,
            success: (tr) => {
              const newStart = timeOptions[tr.tapIndex];
              const endHour = Number(newStart.split(':')[0]) + 3;
              const newEnd = `${String(endHour).padStart(2, '0')}:00`;
              updateSchedule(id, { startTime: newStart, endTime: newEnd });
              Taro.showToast({ title: `时间已调整为 ${newStart}-${newEnd}`, icon: 'success' });
            }
          }).catch(() => {});
        } else if (res.tapIndex === 1) {
          Taro.showActionSheet({
            itemList: studioList.map(s => s.name),
            success: (sr) => {
              const newStudio = studioList[sr.tapIndex];
              updateSchedule(id, { studioId: newStudio.id, studioName: newStudio.name });
              Taro.showToast({ title: `画室已更换为${newStudio.name}`, icon: 'success' });
            }
          }).catch(() => {});
        } else if (res.tapIndex === 2) {
          Taro.showActionSheet({
            itemList: teacherList.map(t => t.name),
            success: (tr2) => {
              const newTeacher = teacherList[tr2.tapIndex];
              updateSchedule(id, { teacherId: newTeacher.id, teacherName: newTeacher.name });
              Taro.showToast({ title: `老师已更换为${newTeacher.name}`, icon: 'success' });
            }
          }).catch(() => {});
        } else if (res.tapIndex === 3) {
          Taro.showModal({
            title: '确认取消？',
            content: '取消课程会通知已报名的学员，是否继续？',
            confirmColor: '#E8453C',
            success: (m) => {
              if (m.confirm) {
                cancelSchedule(id);
                Taro.showToast({ title: '课程已取消', icon: 'success' });
                setTimeout(() => Taro.navigateBack().catch(() => {}), 1000);
              }
            }
          });
        }
      }
    }).catch(err => console.error('[ScheduleDetail] adjust error:', err));
  };

  const handleSignup = () => {
    if (schedule.status === 'full') {
      Taro.showModal({
        title: '课程已满',
        content: '当前课程已报满，是否加入候补名单？',
        confirmColor: '#4F6CF5',
        success: (m) => {
          if (m.confirm) {
            Taro.showToast({ title: '已加入候补', icon: 'success' });
          }
        }
      });
    } else {
      Taro.showModal({
        title: '确认报名？',
        content: `${schedule.courseType} · ${dateObj.format('MM月DD日')} ${schedule.startTime}-${schedule.endTime}`,
        confirmColor: '#4F6CF5',
        success: (m) => {
          if (m.confirm) {
            Taro.showToast({ title: '报名成功！', icon: 'success' });
          }
        }
      });
    }
  };

  return (
    <View className={styles.page}>
      {schedule.status === 'cancelled' && (
        <View style={{
          background: '#FFF0F0',
          padding: '16rpx 32rpx',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <Text style={{ fontSize: 28 }}>⚠️</Text>
          <Text style={{ fontSize: 26, color: '#FF3B30', fontWeight: 600 }}>此课程已取消</Text>
        </View>
      )}
      <View className={styles.headerCard}>
        <View className={styles.headerTop}>
          <Text className={styles.courseBadge}>🎨 {getCourseTypeName(schedule.courseType)}</Text>
          <Text className={styles.statusBadge}>
            {schedule.status === 'open' ? '✅ 可报名' :
              schedule.status === 'full' ? '🔴 已报满' :
              schedule.status === 'ongoing' ? '🎯 进行中' :
              schedule.status === 'completed' ? '✅ 已结束' : '⏸️ 已取消'}
          </Text>
        </View>
        <Text className={styles.courseName}>{getCourseTypeName(schedule.courseType)}课</Text>
        <View className={styles.dateTime}>
          <View className={styles.dateRow}>
            <Text>📅</Text>
            <Text>{dateObj.format('YYYY年MM月DD日')} {WEEKDAY_NAMES[(dateObj.day() + 6) % 7]}</Text>
          </View>
          <View className={styles.dateRow}>
            <Text>⏰</Text>
            <Text>{schedule.startTime} - {schedule.endTime} · {formatDuration(schedule.startTime, schedule.endTime)}</Text>
          </View>
        </View>
      </View>

      <View className={styles.infoSection}>
        <Text className={styles.sectionTitle}>课程信息</Text>
        <View className={styles.infoItem}>
          <View className={styles.infoItemLeft}>
            <View className={styles.infoIcon} style={{ background: 'rgba(79, 108, 245, 0.08)' }}>
              <Text>🏫</Text>
            </View>
            <Text className={styles.infoLabel}>授课画室</Text>
          </View>
          <Text className={styles.infoValue}>{studio?.name || '-'}</Text>
        </View>
        <View className={styles.divider} />
        <View className={styles.infoItem}>
          <View className={styles.infoItemLeft}>
            <View className={styles.infoIcon} style={{ background: 'rgba(255, 140, 66, 0.08)' }}>
              <Text>👨‍🏫</Text>
            </View>
            <Text className={styles.infoLabel}>授课老师</Text>
          </View>
          <Text className={styles.infoValue}>{teacher?.name || '-'}</Text>
        </View>
        <View className={styles.divider} />
        <View className={styles.infoItem}>
          <View className={styles.infoItemLeft}>
            <View className={styles.infoIcon} style={{ background: 'rgba(255, 181, 71, 0.1)' }}>
              <Text>📖</Text>
            </View>
            <Text className={styles.infoLabel}>难度等级</Text>
          </View>
          <Text className={styles.infoValue}>{getLevelName(schedule.level)}</Text>
        </View>

        <View className={styles.progressBox}>
          <View className={styles.progressHeader}>
            <Text className={styles.progressLabel}>报名进度</Text>
            <Text className={styles.progressValue}>{schedule.enrolledCount}/{schedule.maxStudents}人</Text>
          </View>
          <View className={styles.progressBar}>
            <View className={styles.progressFill} style={{ width: `${progress}%` }} />
          </View>
        </View>
      </View>

      {teacher && (
        <View className={styles.infoSection}>
          <Text className={styles.sectionTitle}>授课老师</Text>
          <View className={styles.teacherBox}>
            <Image
              className={styles.teacherAvatar}
              src={teacher.avatar || 'https://picsum.photos/id/1005/200/200'}
              mode='aspectFill'
            />
            <View className={styles.teacherInfo}>
              <Text className={styles.teacherName}>{teacher.name}</Text>
              <Text className={styles.teacherMajor}>{(teacher as any).擅长领域?.join('、') || '专业美术教学'}</Text>
              <Text className={styles.teacherRate}>⭐ {teacher.rating.toFixed(1)} · 教龄{teacher.experienceYears}年</Text>
            </View>
          </View>
        </View>
      )}

      {enrolledStudents.length > 0 && (
        <View className={styles.infoSection}>
          <Text className={styles.sectionTitle}>已报名学员</Text>
          <View className={styles.studentList}>
            {enrolledStudents.map(stu => (
              <View key={stu.id} className={styles.studentItem}>
                <Image
                  className={styles.studentAvatar}
                  src={stu.avatar || 'https://picsum.photos/id/1012/200/200'}
                  mode='aspectFill'
                />
                <View className={styles.studentInfo}>
                  <Text className={styles.studentName}>{stu.name}</Text>
                  <Text className={styles.studentLevel}>
                    {getLevelName(stu.level)} · {stu.levelDescription}
                  </Text>
                </View>
                <Text className={styles.studentTag} style={{
                  background: stu.level === 'advanced' ? 'rgba(147, 51, 234, 0.1)' :
                    stu.level === 'intermediate' ? 'rgba(79, 108, 245, 0.1)' : 'rgba(76, 175, 80, 0.1)',
                  color: stu.level === 'advanced' ? '#9333EA' :
                    stu.level === 'intermediate' ? '#4F6CF5' : '#4CAF50'
                }}>
                  {getLevelName(stu.level)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View className={styles.actionBar}>
        <View className={styles.secondaryBtn} onClick={handleAdjust}>
          <Text className={styles.secondaryBtnText}>调整排期</Text>
        </View>
        <View className={styles.primaryBtn} onClick={handleSignup}>
          <Text className={styles.primaryBtnText}>
            {schedule.status === 'full' ? '加入候补' : schedule.status === 'open' ? '立即报名' : '查看详情'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ScheduleDetailPage;
