import React, { useMemo } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { buildAllMatches } from '@/data/matches';
import { teacherList } from '@/data/teachers';
import { studentList } from '@/data/students';
import {
  calculateMatchScore,
  getCourseTypeName,
  getLevelName,
  getScoreColor,
  getScoreLabel
} from '@/utils/score';
import type { MatchResult } from '@/types';

const dimConfig = [
  { key: 'course', name: '课程类型', icon: '🎨', color: '#4F6CF5', bg: 'rgba(79, 108, 245, 0.08)', weight: 30 },
  { key: 'time', name: '时间匹配', icon: '⏰', color: '#FF8C42', bg: 'rgba(255, 140, 66, 0.08)', weight: 25 },
  { key: 'level', name: '等级匹配', icon: '📊', color: '#06D6A0', bg: 'rgba(6, 214, 160, 0.08)', weight: 20 },
  { key: 'exp', name: '经验匹配', icon: '👨‍🏫', color: '#FFB547', bg: 'rgba(255, 181, 71, 0.08)', weight: 15 },
  { key: 'rating', name: '综合评分', icon: '⭐', color: '#9333EA', bg: 'rgba(147, 51, 234, 0.08)', weight: 10 }
];

const MatchDetailPage: React.FC = () => {
  const router = useRouter();
  const teacherId = router.params.teacherId || 't001';
  const studentId = router.params.studentId || 'stu001';

  const teacher = useMemo(() => teacherList.find(t => t.id === teacherId), [teacherId]);
  const student = useMemo(() => studentList.find(s => s.id === studentId), [studentId]);
  const allMatches = useMemo(() => buildAllMatches(), []);
  const match = useMemo<MatchResult | undefined>(() =>
    allMatches.find(m => m.teacherId === teacherId && m.studentId === studentId),
    [allMatches, teacherId, studentId]
  );

  const scores = useMemo(() => {
    if (!teacher || !student) return null;
    return calculateMatchScore(student, teacher);
  }, [teacher, student]);

  const scoreColor = match ? getScoreColor(match.score) : '#999';
  const scoreLabel = match ? getScoreLabel(match.score) : '-';

  const handleChat = () => {
    Taro.showToast({ title: '私信功能开发中', icon: 'none' });
  };

  const handleConfirm = () => {
    if (match?.mutual) {
      Taro.showModal({
        title: '确认成交？',
        content: `与${teacher?.name}老师确认互选关系后，将开始安排试听课。`,
        confirmColor: '#4CAF50',
        success: (res) => {
          if (res.confirm) {
            Taro.showToast({ title: '已确认，静待佳音！', icon: 'success' });
          }
        }
      });
    } else {
      Taro.showModal({
        title: '确认意向？',
        content: `对${teacher?.name}老师送出"心意💗"，等待对方确认。`,
        confirmColor: '#4F6CF5',
        success: (res) => {
          if (res.confirm) {
            Taro.showToast({ title: '心意已送出 💗', icon: 'success' });
          }
        }
      });
    }
  };

  const handleReject = () => {
    Taro.showModal({
      title: '放弃匹配？',
      content: `取消本次匹配意向，后续可重新选择。`,
      confirmColor: '#E8453C',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '已取消匹配', icon: 'none' });
        }
      }
    });
  };

  if (!teacher || !student || !match || !scores) {
    return (
      <View className={styles.page} style={{ padding: 100, textAlign: 'center' }}>
        <Text style={{ fontSize: 28, color: '#999' }}>匹配数据不存在</Text>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <View className={styles.matchHeader}>
        <View className={styles.scoreDisplay}>
          <View className={styles.scoreRing}>
            <View className={styles.ringOuter}>
              <View className={styles.ringInner}>
                <Text className={styles.scoreValue} style={{ color: scoreColor }}>{match.score}</Text>
                <Text className={styles.scoreLabel}>契合度</Text>
              </View>
            </View>
          </View>
          <Text className={styles.scoreLabelMain}>{scoreLabel}</Text>
          <View className={styles.statusRow}>
            <Text className={styles.statusIcon}>{match.mutual ? '💞' : '💗'}</Text>
            <Text className={styles.statusText}>
              {match.mutual ? '双向互选成功' : match.studentInterested ? '等待老师回应' : '待确认意愿'}
            </Text>
          </View>
        </View>
      </View>

      <View className={styles.peopleCard}>
        <View className={styles.personRow}>
          <Image
            className={styles.personAvatar}
            src={student.avatar || 'https://picsum.photos/id/1062/200/200'}
            mode='aspectFill'
          />
          <View className={styles.personInfo}>
            <View className={styles.personName}>
              {student.name}
              <Text className={styles.personRole}>学员</Text>
            </View>
            <Text className={styles.personDesc}>
              {getLevelName(student.level)} · 意向：{student.targetCourseTypes.slice(0, 2).map(t => getCourseTypeName(t)).join('/')}
            </Text>
          </View>
          <View className={styles.interestIndicator}>
            <Text className={styles.heartIcon}>{match.studentInterested ? '❤️' : '🤍'}</Text>
            <Text className={styles.heartLabel}>{match.studentInterested ? '已选' : '未选'}</Text>
          </View>
        </View>

        <View className={styles.vsConnector}>
          <View className={styles.vsLine} />
          <Text className={styles.vsLabel}>双向匹配</Text>
          <View className={styles.vsLine} />
        </View>

        <View className={styles.personRow}>
          <Image
            className={styles.personAvatar}
            src={teacher.avatar || 'https://picsum.photos/id/1005/200/200'}
            mode='aspectFill'
            style={{ borderColor: 'rgba(255, 140, 66, 0.15)' }}
          />
          <View className={styles.personInfo}>
            <View className={styles.personName}>
              {teacher.name}
              <Text className={classnames(styles.personRole, styles.personRoleTeacher)}>老师</Text>
            </View>
            <Text className={styles.personDesc}>
              教龄{teacher.experienceYears}年 · ⭐{teacher.rating.toFixed(1)}
            </Text>
          </View>
          <View className={styles.interestIndicator}>
            <Text className={styles.heartIcon}>{match.teacherInterested ? '❤️' : '🤍'}</Text>
            <Text className={styles.heartLabel}>{match.teacherInterested ? '已选' : '未选'}</Text>
          </View>
        </View>
      </View>

      <View className={styles.scoreSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionIcon}>📐</Text>
          <Text className={styles.sectionTitle}>契合度分析</Text>
        </View>

        {dimConfig.map(dim => {
          const dimScore = (scores as any)[`${dim.key}Score`] || 0;
          const dimDesc = (scores as any)[`${dim.key}Desc`] || '';
          return (
            <View key={dim.key} className={styles.dimItem}>
              <View className={styles.dimIcon} style={{ background: dim.bg }}>
                <Text>{dim.icon}</Text>
              </View>
              <View className={styles.dimInfo}>
                <View className={styles.dimHeader}>
                  <Text className={styles.dimName}>{dim.name}</Text>
                  <Text className={styles.dimScore}>
                    <Text style={{ color: dim.color }}>{dimScore}</Text>
                    <Text className={styles.dimWeight}>/100 · {dim.weight}%</Text>
                  </Text>
                </View>
                <View className={styles.dimBar}>
                  <View className={styles.dimFill} style={{
                    width: `${dimScore}%`,
                    background: `linear-gradient(90deg, ${dim.color}88 0%, ${dim.color} 100%)`
                  }} />
                </View>
                {dimDesc && <Text className={styles.dimDesc}>{dimDesc}</Text>}
              </View>
            </View>
          );
        })}
      </View>

      <View className={styles.actionBar}>
        <View className={styles.ghostBtn} onClick={handleChat}>
          <Text className={styles.ghostBtnText}>私信沟通</Text>
        </View>
        <View className={styles.ghostBtn} onClick={handleReject}>
          <Text className={styles.ghostBtnText}>暂不考虑</Text>
        </View>
        <View className={match.mutual ? styles.successBtn : styles.primaryBtn} onClick={handleConfirm}>
          <Text className={match.mutual ? styles.successBtnText : styles.primaryBtnText}>
            {match.mutual ? '🎉 确认成交' : '💗 送出心意'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default MatchDetailPage;
