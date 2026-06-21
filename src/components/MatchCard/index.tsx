import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import type { MatchResult } from '@/types';
import { getScoreColor, getScoreLabel } from '@/utils/score';

interface MatchCardProps {
  match: MatchResult;
  onClick?: () => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onClick }) => {
  const scoreColor = getScoreColor(match.totalScore);
  const scoreLabel = getScoreLabel(match.totalScore);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      Taro.navigateTo({
        url: `/pages/match-detail/index?id=${match.id}`
      }).catch(err => console.error('[MatchCard] navigate error:', err));
    }
  };

  return (
    <View className={classnames(styles.card, match.mutual && styles.mutualCard)} onClick={handleClick}>
      {match.mutual && (
        <View className={styles.mutualBadge}>
          <Text className={styles.mutualText}>🤝 互选成功</Text>
        </View>
      )}
      <View className={styles.persons}>
        <View className={styles.person}>
          <Image className={styles.avatar} src={match.studentAvatar} mode='aspectFill' />
          <View className={styles.personInfo}>
            <Text className={styles.name}>{match.studentName}</Text>
            <Text className={styles.role}>学员</Text>
          </View>
          <View className={classnames(
            styles.interestIcon,
            match.studentInterested && styles.interested
          )}>
            {match.studentInterested ? '♥' : '♡'}
          </View>
        </View>
        <View className={styles.connect}>
          <View className={styles.arrowLine} />
          <View className={styles.arrowIcon}>⇄</View>
          <View className={styles.arrowLine} />
        </View>
        <View className={styles.person}>
          <Image className={styles.avatar} src={match.teacherAvatar} mode='aspectFill' />
          <View className={styles.personInfo}>
            <Text className={styles.name}>{match.teacherName}</Text>
            <Text className={styles.role}>老师</Text>
          </View>
          <View className={classnames(
            styles.interestIcon,
            match.teacherInterested && styles.interested
          )}>
            {match.teacherInterested ? '♥' : '♡'}
          </View>
        </View>
      </View>
      <View className={styles.scoreSection}>
        <View className={styles.scoreCircle} style={{ borderColor: scoreColor }}>
          <Text className={styles.scoreNum} style={{ color: scoreColor }}>{match.totalScore}</Text>
          <Text className={styles.scoreLabel}>契合度</Text>
        </View>
        <View className={styles.scoreDetails}>
          <View className={styles.scoreTag} style={{ background: `${scoreColor}15`, color: scoreColor }}>
            {scoreLabel}
          </View>
          <View className={styles.breakdown}>
            <View className={styles.breakItem}>
              <Text className={styles.breakLabel}>课程匹配</Text>
              <View className={styles.breakBar}>
                <View className={styles.breakFill} style={{ width: `${match.scores.courseType}%`, background: scoreColor }} />
              </View>
              <Text className={styles.breakVal}>{match.scores.courseType}</Text>
            </View>
            <View className={styles.breakItem}>
              <Text className={styles.breakLabel}>时间匹配</Text>
              <View className={styles.breakBar}>
                <View className={styles.breakFill} style={{ width: `${match.scores.timeMatch}%`, background: scoreColor }} />
              </View>
              <Text className={styles.breakVal}>{match.scores.timeMatch}</Text>
            </View>
          </View>
          <Text className={styles.matchTime}>{match.createdAt}</Text>
        </View>
      </View>
    </View>
  );
};

export default MatchCard;
