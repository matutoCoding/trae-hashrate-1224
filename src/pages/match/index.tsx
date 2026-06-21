import React, { useState } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import MatchCard from '@/components/MatchCard';
import EmptyState from '@/components/EmptyState';
import { teacherList } from '@/data/teachers';
import { studentList } from '@/data/students';
import { getCourseTypeName, getLevelName } from '@/utils/score';
import { useAppStore } from '@/store';

const tabs = [
  { key: 'matched', label: '互选成功' },
  { key: 'pending', label: '待撮合' },
  { key: 'intent', label: '意愿登记' }
];

const MatchPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('matched');
  const [intentRole, setIntentRole] = useState<'student' | 'teacher'>('student');
  const [selectedPersonId, setSelectedPersonId] = useState('');
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const matches = useAppStore(s => s.matches);
  const getMatchStats = useAppStore(s => s.getMatchStats);
  const setStudentTargets = useAppStore(s => s.setStudentTargets);
  const setTeacherTargets = useAppStore(s => s.setTeacherTargets);
  const students = useAppStore(s => s.students);
  const teachers = useAppStore(s => s.teachers);

  const matchStats = getMatchStats();
  const mutualMatches = matches.filter(m => m.mutual);
  const pendingMatches = matches.filter(m => !m.mutual && m.status !== 'rejected');

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const toggleTeacher = (id: string) => {
    setSelectedTeachers(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const toggleStudent = (id: string) => {
    setSelectedStudents(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const submitIntent = () => {
    if (!selectedPersonId) {
      Taro.showToast({ title: '请先选择登记人', icon: 'none' });
      return;
    }
    const count = intentRole === 'student' ? selectedTeachers.length : selectedStudents.length;
    if (count === 0) {
      Taro.showToast({ title: '请先选择意向对象', icon: 'none' });
      return;
    }

    const personName = intentRole === 'student'
      ? students.find(s => s.id === selectedPersonId)?.name
      : teachers.find(t => t.id === selectedPersonId)?.name;

    Taro.showModal({
      title: '提交意愿',
      content: `${personName}已选择 ${count} 位${intentRole === 'student' ? '老师' : '学员'}作为意向对象，提交后将重建匹配列表。是否确认？`,
      confirmText: '确认提交',
      success: (res) => {
        if (res.confirm) {
          if (intentRole === 'student') {
            setStudentTargets(selectedPersonId, selectedTeachers);
          } else {
            setTeacherTargets(selectedPersonId, selectedStudents);
          }
          Taro.showToast({ title: '意愿提交成功', icon: 'success' });
          setTimeout(() => setActiveTab('matched'), 600);
        }
      }
    }).catch(err => console.error('[Match] modal error:', err));
  };

  return (
    <ScrollView
      className={styles.page}
      scrollY
      refresherEnabled
      refresherTriggered={refreshing}
      onRefresherRefresh={onRefresh}
    >
      <View className={styles.statsHeader}>
        <Text style={{ fontSize: '40rpx', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
          双向撮合中心
        </Text>
        <Text style={{ fontSize: '24rpx', color: 'rgba(255,255,255,0.85)', marginTop: '8rpx', display: 'block' }}>
          学员和老师互相选择，双方有意向即可撮合
        </Text>
        <View className={styles.statsGrid}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{matchStats.total}</Text>
            <Text className={styles.statLabel}>总匹配</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{matchStats.mutual}</Text>
            <Text className={styles.statLabel}>互选成功</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{matchStats.pending}</Text>
            <Text className={styles.statLabel}>待撮合</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{matchStats.avgScore}</Text>
            <Text className={styles.statLabel}>平均契合</Text>
          </View>
        </View>
      </View>

      <View className={styles.tabs}>
        {tabs.map(tab => (
          <Text
            key={tab.key}
            className={classnames(styles.tab, activeTab === tab.key && styles.tabActive)}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            {tab.key === 'matched' && mutualMatches.length > 0 && (
              <Text className={styles.badgeCount}>{mutualMatches.length}</Text>
            )}
          </Text>
        ))}
      </View>

      <View className={styles.content}>
        {activeTab === 'matched' && (
          <>
            <View className={styles.sectionHeader}>
              <Text className={styles.sectionTitle}>
                <Text className={styles.titleIcon}>🤝</Text>
                互选成功
              </Text>
              <Text style={{ fontSize: '24rpx', color: '#9094AB' }}>按契合度排序</Text>
            </View>
            <View className={styles.matchList}>
              {mutualMatches.length > 0 ? (
                mutualMatches.map(match => (
                  <MatchCard key={match.id} match={match} />
                ))
              ) : (
                <EmptyState
                  icon='🤝'
                  title='暂无互选成功'
                  description='互相表达意愿后即可撮合成功，快去登记你的意向吧'
                  actionText='去登记意愿'
                  onAction={() => setActiveTab('intent')}
                />
              )}
            </View>
          </>
        )}

        {activeTab === 'pending' && (
          <>
            <View className={styles.sectionHeader}>
              <Text className={styles.sectionTitle}>
                <Text className={styles.titleIcon}>⏳</Text>
                待撮合列表
              </Text>
              <Text style={{ fontSize: '24rpx', color: '#9094AB' }}>等待对方回应</Text>
            </View>
            <View className={styles.matchList}>
              {pendingMatches.length > 0 ? (
                pendingMatches.slice(0, 10).map(match => (
                  <MatchCard key={match.id} match={match} />
                ))
              ) : (
                <EmptyState
                  icon='💭'
                  title='暂无待撮合'
                  description='去意愿登记页选择你心仪的对象吧'
                  actionText='去登记'
                  onAction={() => setActiveTab('intent')}
                />
              )}
            </View>
          </>
        )}

        {activeTab === 'intent' && (
          <>
            <View className={styles.sectionHeader}>
              <Text className={styles.sectionTitle}>
                <Text className={styles.titleIcon}>💗</Text>
                意愿登记
              </Text>
              <View
                style={{
                  padding: '8rpx 24rpx',
                  background: 'linear-gradient(135deg, #4F6CF5 0%, #7B91FF 100%)',
                  borderRadius: '48rpx'
                }}
                onClick={submitIntent}
              >
                <Text style={{ fontSize: '26rpx', color: '#fff', fontWeight: 600 }}>
                  提交意愿
                </Text>
              </View>
            </View>

            <View className={styles.intentCard}>
              <View className={styles.intentHeader}>
                <Text className={styles.intentTitle}>
                  选择身份登记
                </Text>
                <View className={styles.intentSwitch}>
                  <Text
                    className={classnames(styles.switchOption, intentRole === 'student' && styles.switchOptionActive)}
                    onClick={() => { setIntentRole('student'); setSelectedPersonId(''); setSelectedTeachers([]); setSelectedStudents([]); }}
                  >
                    我是学员
                  </Text>
                  <Text
                    className={classnames(styles.switchOption, intentRole === 'teacher' && styles.switchOptionActive)}
                    onClick={() => { setIntentRole('teacher'); setSelectedPersonId(''); setSelectedTeachers([]); setSelectedStudents([]); }}
                  >
                    我是老师
                  </Text>
                </View>
              </View>

              <View style={{ marginBottom: 24 }}>
                <Text style={{ fontSize: 26, color: '#5A607F', fontWeight: 600, display: 'block', marginBottom: 12 }}>
                  <Text style={{ color: '#FF3B30' }}>*</Text>
                  {intentRole === 'student' ? '选择登记的学员' : '选择登记的老师'}
                </Text>
                <View style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  {(intentRole === 'student' ? studentList.slice(0, 8) : teacherList).map(person => {
                    const isSelected = selectedPersonId === person.id;
                    return (
                      <View
                        key={person.id}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '8rpx 20rpx', borderRadius: 48,
                          background: isSelected ? 'rgba(79,108,245,0.1)' : '#F7F8FC',
                          border: isSelected ? '2rpx solid #4F6CF5' : '2rpx solid transparent'
                        }}
                        onClick={() => setSelectedPersonId(person.id)}
                      >
                        <Image src={person.avatar} mode='aspectFill' style={{ width: 40, height: 40, borderRadius: 20 }} />
                        <Text style={{ fontSize: 24, color: isSelected ? '#4F6CF5' : '#5A607F', fontWeight: isSelected ? 600 : 400 }}>
                          {person.name}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>

              {!selectedPersonId ? (
                <View style={{ padding: 32, textAlign: 'center' }}>
                  <Text style={{ fontSize: 26, color: '#9094AB' }}>👆 请先选择登记人，再选择意向对象</Text>
                </View>
              ) : (
                <View className={styles.personList}>
                  {intentRole === 'student' ? (
                  teacherList.map(teacher => {
                    const isSelected = selectedTeachers.includes(teacher.id);
                    return (
                      <View key={teacher.id} className={styles.personRow}>
                        <Image className={styles.personAvatar} src={teacher.avatar} mode='aspectFill' />
                        <View className={styles.personInfo}>
                          <Text className={styles.personName}>
                            {teacher.name} · {teacher.yearsExperience}年教龄
                          </Text>
                          <Text className={styles.personDesc}>{teacher.bio}</Text>
                          <View className={styles.personTags}>
                            {teacher.擅长领域.slice(0, 3).map(t => (
                              <Text key={t} className={styles.personTag}>
                                {getCourseTypeName(t)}
                              </Text>
                            ))}
                            <Text className={styles.personTag}>⭐ {teacher.rating}</Text>
                            <Text className={styles.personTag}>
                              💰 {teacher.pricePerHour}/小时
                            </Text>
                          </View>
                        </View>
                        <View
                          className={classnames(styles.selectBtn, isSelected && styles.selectBtnSelected)}
                          onClick={() => toggleTeacher(teacher.id)}
                        >
                          <Text className={classnames(
                            styles.selectBtnText,
                            isSelected && styles.selectBtnTextSelected
                          )}>
                            {isSelected ? '✓ 已选' : '选择'}
                          </Text>
                        </View>
                      </View>
                    );
                  })
                ) : (
                  studentList.slice(0, 8).map(student => {
                    const isSelected = selectedStudents.includes(student.id);
                    return (
                      <View key={student.id} className={styles.personRow}>
                        <Image className={styles.personAvatar} src={student.avatar} mode='aspectFill' />
                        <View className={styles.personInfo}>
                          <Text className={styles.personName}>
                            {student.name} · {student.age}岁 · {getLevelName(student.level)}
                          </Text>
                          <Text className={styles.personDesc}>{student.bio}</Text>
                          <View className={styles.personTags}>
                            {student.preferredTypes.slice(0, 3).map(t => (
                              <Text key={t} className={styles.personTag}>
                                {getCourseTypeName(t)}
                              </Text>
                            ))}
                            <Text className={styles.personTag}>⭐ {student.rating}</Text>
                          </View>
                        </View>
                        <View
                          className={classnames(styles.selectBtn, isSelected && styles.selectBtnSelected)}
                          onClick={() => toggleStudent(student.id)}
                        >
                          <Text className={classnames(
                            styles.selectBtnText,
                            isSelected && styles.selectBtnTextSelected
                          )}>
                            {isSelected ? '✓ 已选' : '选择'}
                          </Text>
                        </View>
                      </View>
                    );
                  })
                )}
              </View>
              )}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default MatchPage;
