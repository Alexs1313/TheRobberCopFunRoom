import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useMemo, useState} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';

import Background from '../components/Background';
import StoryPreviewCard from '../components/StoryPreviewCard';
import {getStoryPreview, stories} from '../data/stories';
import type {Story} from '../types/content';
import {LIKED_STORIES_STORAGE_KEY} from '../uttils/storage';
import {shareText} from '../uttils/share';
import {images} from '../assets/images';

const StoriesScreen = () => {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [likedIds, setLikedIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    const loadLikedStories = async () => {
      const likedValue = await AsyncStorage.getItem(LIKED_STORIES_STORAGE_KEY);

      if (likedValue) {
        setLikedIds(new Set(JSON.parse(likedValue)));
      }
    };

    loadLikedStories();
  }, []);

  const selectedStoryText = useMemo(() => {
    if (!selectedStory) {
      return '';
    }

    return selectedStory.paragraphs.join('\n\n');
  }, [selectedStory]);

  const toggleLike = (id: string) => {
    setLikedIds(prevLikedIds => {
      const nextLikedIds = new Set(prevLikedIds);

      if (nextLikedIds.has(id)) {
        nextLikedIds.delete(id);
      } else {
        nextLikedIds.add(id);
      }

      AsyncStorage.setItem(
        LIKED_STORIES_STORAGE_KEY,
        JSON.stringify([...nextLikedIds]),
      );

      return nextLikedIds;
    });
  };

  const shareStory = async (story: Story) => {
    shareText(
      story.title,
      `${story.title}\n\n${story.paragraphs.join('\n\n')}`,
    );
  };

  if (selectedStory) {
    const isLiked = likedIds.has(selectedStory.id);

    return (
      <Background>
        <View style={styles.detailContainer}>
          <View style={styles.detailActions}>
            <Pressable
              style={styles.circleButton}
              onPress={() => setSelectedStory(null)}>
              <Image source={images.backArrow} />
            </Pressable>
            <View style={styles.detailRightActions}>
              <Pressable
                style={[styles.circleButton, isLiked && styles.likedButton]}
                onPress={() => toggleLike(selectedStory.id)}>
                <Image
                  source={isLiked ? images.storyLiked : images.storyLike}
                />
              </Pressable>
              <Pressable
                style={styles.circleButton}
                onPress={() => shareStory(selectedStory)}>
                <Image source={images.share} />
              </Pressable>
            </View>
          </View>

          <Text style={styles.detailTitle}>{selectedStory.title}</Text>
          <Image source={images.dividerUnder} />
          <Text style={styles.storyFullText}>{selectedStoryText}</Text>
        </View>
      </Background>
    );
  }

  return (
    <Background>
      <View style={styles.container}>
        <Text style={styles.title}>Funny Stories 📖</Text>
        <Text style={styles.subtitle}>Tales from the crime world</Text>

        <View style={styles.cardsWrap}>
          {stories.map(story => {
            const isLiked = likedIds.has(story.id);

            return (
              <StoryPreviewCard
                key={story.id}
                title={story.title}
                preview={getStoryPreview(story)}
                isLiked={isLiked}
                onToggleLike={() => toggleLike(story.id)}
                onRead={() => setSelectedStory(story)}
              />
            );
          })}
        </View>
      </View>
    </Background>
  );
};

export default StoriesScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 68,
    paddingBottom: 100,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 38,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.55)',
    fontSize: 15,
    lineHeight: 22,
  },
  cardsWrap: {
    paddingTop: 24,
  },
  likedButton: {
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.25)',
    backgroundColor: 'rgba(255,215,0,0.16)',
  },
  detailContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 100,
  },
  detailActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailRightActions: {
    flexDirection: 'row',
    gap: 10,
  },
  circleButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  detailTitle: {
    marginTop: 22,
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
    marginBottom: 10,
  },
  detailUnderline: {
    width: 48,
    height: 2,
    marginTop: 14,
    backgroundColor: '#0745E7',
  },
  storyFullText: {
    marginTop: 20,
    color: 'rgba(255,255,255,0.82)',
    fontSize: 15,
    lineHeight: 27,
  },
});
