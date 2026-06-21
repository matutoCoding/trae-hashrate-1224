import React, { useState } from 'react';
import { View, Text, Image, Input, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { studentList } from '@/data/students';
import { teacherList } from '@/data/teachers';
import { useAppStore } from '@/store';
import { getCourseTypeName } from '@/utils/score';
import type { CourseType } from '@/types';
import dayjs from 'dayjs';

const courseTypeOptions: { key: CourseType; name: string }[] = [
  { key: 'sketch', name: '素描' },
  { key: 'watercolor', name: '水彩' },
  { key: 'oil', name: '油画' },
  { key: 'chinese', name: '国画' },
  { key: 'creative', name: '创意' },
  { key: 'digital', name: '数字绘画' }
];

const sampleImages = [
  'https://picsum.photos/id/1025/600/800',
  'https://picsum.photos/id/1040/800/600',
  'https://picsum.photos/id/1028/500/700',
  'https://picsum.photos/id/106/600/750',
  'https://picsum.photos/id/1074/700/600',
  'https://picsum.photos/id/1027/500/650',
  'https://picsum.photos/id/1005/500/650',
  'https://picsum.photos/id/1043/800/550'
];

const ArtworkUploadPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [courseType, setCourseType] = useState<CourseType>('sketch');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [selectedScheduleId, setSelectedScheduleId] = useState('');
  const [description, setDescription] = useState('');
  const [imageIdx] = useState(() => Math.floor(Math.random() * sampleImages.length));

  const addArtwork = useAppStore(s => s.addArtwork);
  const schedules = useAppStore(s => s.schedules);

  const availableSchedules = schedules.filter(s =>
    s.status !== 'cancelled' && s.courseType === courseType
  );

  const handleSubmit = () => {
    if (!title.trim()) {
      Taro.showToast({ title: '请填写作品标题', icon: 'none' });
      return;
    }
    if (!selectedStudentId) {
      Taro.showToast({ title: '请选择作者', icon: 'none' });
      return;
    }

    const student = studentList.find(s => s.id === selectedStudentId);
    const teacher = selectedTeacherId
      ? teacherList.find(t => t.id === selectedTeacherId)
      : null;
    const schedule = selectedScheduleId
      ? schedules.find(s => s.id === selectedScheduleId)
      : null;

    if (!student) return;

    const newArtwork = addArtwork({
      title: title.trim(),
      image: sampleImages[imageIdx],
      studentId: student.id,
      studentName: student.name,
      studentAvatar: student.avatar,
      courseType,
      teacherId: teacher?.id || '',
      teacherName: teacher?.name || '',
      scheduleId: selectedScheduleId || '',
      description: description.trim() || `${student.name}的${getCourseTypeName(courseType)}作品`,
      tags: [getCourseTypeName(courseType), '新作', dayjs().format('YYYY年')],
      createdAt: dayjs().format('YYYY-MM-DD')
    });

    Taro.showToast({ title: '🎉 上传成功！', icon: 'success' });
    setTimeout(() => {
      Taro.redirectTo({
        url: `/pages/artwork-detail/index?id=${newArtwork.id}`
      }).catch(() => {
        Taro.switchTab({ url: '/pages/gallery/index' });
      });
    }, 1000);
  };

  const canSubmit = title.trim() && selectedStudentId;

  return (
    <View className={styles.page}>
      <View className={styles.hero}>
        <Text className={styles.heroTitle}>🎨 上传作品</Text>
        <Text className={styles.heroDesc}>记录每一次进步，展示你的创作</Text>
      </View>

      <View className={styles.content}>
        <View className={styles.card}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>🖼️</Text>
            基本信息
          </Text>

          <View className={styles.formGroup}>
            <Text className={styles.label}>
              <Text className={styles.requiredStar}>*</Text>作品标题
            </Text>
            <Input
              className={styles.input}
              placeholder='给作品起个名字吧'
              value={title}
              onInput={e => setTitle(e.detail.value)}
              maxlength={30}
            />
          </View>

          <View className={styles.formGroup}>
            <Text className={styles.label}>
              <Text className={styles.requiredStar}>*</Text>画种
            </Text>
            <View className={styles.typeGrid}>
              {courseTypeOptions.map(opt => (
                <Text
                  key={opt.key}
                  className={classnames(styles.typeChip, courseType === opt.key && styles.typeChipActive)}
                  onClick={() => {
                    setCourseType(opt.key);
                    setSelectedScheduleId('');
                  }}
                >
                  {opt.name}
                </Text>
              ))}
            </View>
          </View>
        </View>

        <View className={styles.card}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>👤</Text>
            作者与课程
          </Text>

          <View className={styles.formGroup}>
            <Text className={styles.label}>
              <Text className={styles.requiredStar}>*</Text>作者（学员）
            </Text>
            <View
              className={styles.selectBox}
              onClick={() => {
                Taro.showActionSheet({
                  itemList: studentList.slice(0, 10).map(s => `${s.name} · ${s.age}岁`),
                  success: (res) => {
                    setSelectedStudentId(studentList[res.tapIndex].id);
                  }
                }).catch(() => {});
              }}
            >
              <Text className={classnames(styles.selectText, !selectedStudentId && styles.selectPlaceholder)}>
                {selectedStudentId
                  ? studentList.find(s => s.id === selectedStudentId)?.name
                  : '请选择作者'}
              </Text>
              <Text className={styles.selectArrow}>›</Text>
            </View>
          </View>

          <View className={styles.formGroup}>
            <Text className={styles.label}>指导老师</Text>
            <View
              className={styles.selectBox}
              onClick={() => {
                Taro.showActionSheet({
                  itemList: ['不指定', ...teacherList.map(t => t.name)],
                  success: (res) => {
                    if (res.tapIndex === 0) {
                      setSelectedTeacherId('');
                    } else {
                      setSelectedTeacherId(teacherList[res.tapIndex - 1].id);
                    }
                  }
                }).catch(() => {});
              }}
            >
              <Text className={classnames(styles.selectText, !selectedTeacherId && styles.selectPlaceholder)}>
                {selectedTeacherId
                  ? teacherList.find(t => t.id === selectedTeacherId)?.name
                  : '请选择老师（可选）'}
              </Text>
              <Text className={styles.selectArrow}>›</Text>
            </View>
          </View>

          <View className={styles.formGroup}>
            <Text className={styles.label}>关联课程</Text>
            <View
              className={styles.selectBox}
              onClick={() => {
                if (availableSchedules.length === 0) {
                  Taro.showToast({ title: '该画种暂无可用课程', icon: 'none' });
                  return;
                }
                Taro.showActionSheet({
                  itemList: ['不关联', ...availableSchedules.map(s =>
                    `${s.date} ${s.startTime}-${s.endTime} ${s.title}`
                  )],
                  success: (res) => {
                    if (res.tapIndex === 0) {
                      setSelectedScheduleId('');
                    } else {
                      setSelectedScheduleId(availableSchedules[res.tapIndex - 1].id);
                    }
                  }
                }).catch(() => {});
              }}
            >
              <Text className={classnames(styles.selectText, !selectedScheduleId && styles.selectPlaceholder)}>
                {selectedScheduleId
                  ? (() => {
                      const s = schedules.find(s2 => s2.id === selectedScheduleId);
                      return s ? `${s.date} ${s.title}` : '请选择课程';
                    })()
                  : '请选择关联课程（可选）'}
              </Text>
              <Text className={styles.selectArrow}>›</Text>
            </View>
          </View>
        </View>

        <View className={styles.card}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>📝</Text>
            创作心得（可选）
          </Text>
          <View className={styles.formGroup}>
            <Textarea
              className={styles.textarea}
              placeholder='分享你的创作灵感和心得...'
              value={description}
              onInput={e => setDescription(e.detail.value)}
              maxlength={200}
            />
          </View>

          <View className={styles.imagePreview}>
            <Image
              className={styles.previewImage}
              src={sampleImages[imageIdx]}
              mode='aspectFill'
            />
          </View>
        </View>
      </View>

      <View className={styles.actionBar}>
        <View
          className={classnames(styles.submitBtn, !canSubmit && styles.submitBtnDisabled)}
          onClick={canSubmit ? handleSubmit : () => Taro.showToast({ title: '请先填写必填项', icon: 'none' })}
        >
          <Text className={styles.submitBtnText}>提交上传</Text>
        </View>
      </View>
    </View>
  );
};

export default ArtworkUploadPage;
