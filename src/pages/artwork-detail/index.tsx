import React, { useMemo, useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { artworkList } from '@/data/artworks';
import { studentList } from '@/data/students';
import { teacherList } from '@/data/teachers';
import { getCourseTypeName, getLevelName } from '@/utils/score';
import dayjs from 'dayjs';

interface CommentMock {
  id: string;
  userName: string;
  avatar: string;
  time: string;
  content: string;
}

const mockComments: CommentMock[] = [
  {
    id: 'c1',
    userName: '陈丹青',
    avatar: 'https://picsum.photos/id/1003/200/200',
    time: '2小时前',
    content: '色彩运用很大胆，笔触有张力！建议在远景部分可以稍微弱化一些对比，让空间层次更加深远。'
  },
  {
    id: 'c2',
    userName: '李明远',
    avatar: 'https://picsum.photos/id/1005/200/200',
    time: '昨天',
    content: '这张作品的光影处理非常出色，水面的倒影尤其传神，继续保持！'
  }
];

const ArtworkDetailPage: React.FC = () => {
  const router = useRouter();
  const id = router.params.id || 'art001';
  const artwork = useMemo(() => artworkList.find(a => a.id === id) || artworkList[0], [id]);
  const student = useMemo(() => studentList.find(s => s.id === artwork.studentId), [artwork]);
  const teacher = useMemo(() => teacherList.find(t => t.id === artwork.teacherId), [artwork]);

  const [liked, setLiked] = useState(false);
  const [collected, setCollected] = useState(false);

  const onBack = () => {
    const pages = Taro.getCurrentPages();
    if (pages.length > 1) {
      Taro.navigateBack().catch(() => Taro.switchTab({ url: '/pages/gallery/index' }));
    } else {
      Taro.switchTab({ url: '/pages/gallery/index' });
    }
  };

  const onShare = () => {
    Taro.showShareMenu({ withShareTicket: true });
    Taro.showToast({ title: '分享菜单已唤起', icon: 'none' });
  };

  const onMore = () => {
    Taro.showActionSheet({
      itemList: ['保存图片', '举报作品', '查看创作过程'],
      success: (res) => {
        const labels = ['保存图片', '举报作品', '查看创作过程'];
        Taro.showToast({ title: labels[res.tapIndex] + '功能开发中', icon: 'none' });
      }
    }).catch(err => console.error('[ArtworkDetail] more error:', err));
  };

  const toggleLike = () => {
    setLiked(!liked);
    Taro.showToast({ title: liked ? '已取消点赞' : '❤️ 点赞成功', icon: 'none' });
  };

  const toggleCollect = () => {
    setCollected(!collected);
    Taro.showToast({ title: collected ? '已取消收藏' : '⭐ 收藏成功', icon: 'none' });
  };

  const openComment = () => {
    Taro.showToast({ title: '评论功能开发中', icon: 'none' });
  };

  return (
    <View className={styles.page}>
      <View className={styles.heroImage}>
        <Text className={styles.heroArtIcon}>🎨</Text>
        <View className={styles.backBtn} onClick={onBack}>
          <Text className={styles.backText}>‹</Text>
        </View>
        <View className={styles.actionGroup}>
          <View className={styles.actionIcon} onClick={onShare}>
            <Text>↗️</Text>
          </View>
          <View className={styles.actionIcon} onClick={onMore}>
            <Text>⋯</Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.infoCard}>
          <View className={styles.titleRow}>
            <Text className={styles.artworkTitle}>{artwork.title}</Text>
            <Text className={styles.courseTag}>{getCourseTypeName(artwork.courseType)}</Text>
          </View>

          <View className={styles.artistRow}>
            <Image
              className={styles.artistAvatar}
              src={student?.avatar || 'https://picsum.photos/id/1062/200/200'}
              mode='aspectFill'
            />
            <View className={styles.artistInfo}>
              <Text className={styles.artistName}>{student?.name || '匿名作者'}</Text>
              <View className={styles.artistMeta}>
                <Text>{getLevelName(student?.level || 'beginner')}学员</Text>
                <Text className={styles.metaDot} />
                <Text>指导老师：{teacher?.name || '-'}</Text>
                <Text className={styles.metaDot} />
                <Text>{dayjs(artwork.createdAt).format('YYYY.MM.DD')}</Text>
              </View>
            </View>
          </View>

          <View className={styles.statsRow}>
            <View className={styles.statCard}>
              <Text className={styles.statValue}>{(artwork.likes + (liked ? 1 : 0)).toLocaleString()}</Text>
              <Text className={styles.statLabel}>点赞</Text>
            </View>
            <View className={styles.statCard}>
              <Text className={styles.statValue} style={{ color: '#4F6CF5' }}>{artwork.comments.length}</Text>
              <Text className={styles.statLabel}>评论</Text>
            </View>
            <View className={styles.statCard}>
              <Text className={styles.statValue} style={{ color: '#9333EA' }}>{(artwork.views || 0).toLocaleString()}</Text>
              <Text className={styles.statLabel}>浏览</Text>
            </View>
          </View>
        </View>

        <View className={styles.descSection}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>📝</Text>
            创作心得
          </Text>
          <Text className={styles.descText}>
            {artwork.description || '这幅作品是作者在课程学习过程中的阶段性成果，通过对色彩、构图和技法的不断探索，展现出独特的艺术表达。'}
          </Text>
          {artwork.tags && artwork.tags.length > 0 && (
            <View className={styles.tagsWrap}>
              {artwork.tags.map(tag => (
                <Text key={tag} className={styles.tagChip}>#{tag}</Text>
              ))}
            </View>
          )}
        </View>

        <View className={styles.commentsSection}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.titleIcon}>💬</Text>
            老师点评 ({mockComments.length})
          </Text>
          {mockComments.map(c => (
            <View key={c.id} className={styles.commentItem}>
              <Image
                className={styles.commentAvatar}
                src={c.avatar}
                mode='aspectFill'
              />
              <View className={styles.commentContent}>
                <View className={styles.commentHeader}>
                  <Text className={styles.commentName}>{c.userName}</Text>
                  <Text className={styles.commentTime}>{c.time}</Text>
                </View>
                <Text className={styles.commentText}>{c.content}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.actionBar}>
        <View className={styles.inputWrap} onClick={openComment}>
          <Text className={styles.inputPlaceholder}>留下你的鼓励...</Text>
        </View>
        <View
          className={classnames(styles.iconBtn, liked && styles.iconBtnActive)}
          onClick={toggleLike}
        >
          <Text className={styles.iconBtnEmoji}>{liked ? '❤️' : '🤍'}</Text>
          <Text className={styles.iconBtnLabel}>{artwork.likes + (liked ? 1 : 0)}</Text>
        </View>
        <View
          className={classnames(styles.iconBtn, collected && styles.iconBtnActive)}
          onClick={toggleCollect}
        >
          <Text className={styles.iconBtnEmoji}>{collected ? '⭐' : '☆'}</Text>
          <Text className={styles.iconBtnLabel}>{collected ? '已藏' : '收藏'}</Text>
        </View>
      </View>
    </View>
  );
};

export default ArtworkDetailPage;
