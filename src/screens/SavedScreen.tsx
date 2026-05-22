import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useMemo, useState} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Background from '../components/Background';
import JokeCard from '../components/JokeCard';
import {jokes} from '../data/jokes';
import type {Joke, JokeSide} from '../types/content';
import {SAVED_JOKES_STORAGE_KEY} from '../uttils/storage';
import {shareText} from '../uttils/share';
import {images} from '../assets/images';

type SavedFilter = 'all' | JokeSide;

const sideMeta = {
  police: {
    title: "Officer Mike's Jokes",
    eyebrow: 'OFFICER MIKE',
    emoji: '👮‍♂️',
    accent: '#7FA8FF',
    image: images.robb1,
  },
  robber: {
    title: "Slick Rico's Jokes",
    eyebrow: 'SLICK RICO',
    emoji: '🦹',
    accent: '#C084FC',
    image: images.robb2,
  },
};

const SavedScreen = () => {
  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState<SavedFilter>('all');
  const [savedIds, setSavedIds] = useState<Set<string>>(() => new Set());

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadSavedIds = async () => {
        const savedValue = await AsyncStorage.getItem(SAVED_JOKES_STORAGE_KEY);

        if (isActive) {
          setSavedIds(new Set(savedValue ? JSON.parse(savedValue) : []));
        }
      };

      loadSavedIds();

      return () => {
        isActive = false;
      };
    }, []),
  );

  const savedJokes = useMemo(
    () => jokes.filter(joke => savedIds.has(joke.id)),
    [savedIds],
  );

  const visibleJokes = useMemo(() => {
    if (activeFilter === 'all') {
      return savedJokes;
    }

    return savedJokes.filter(joke => joke.side === activeFilter);
  }, [activeFilter, savedJokes]);

  const policeCount = savedJokes.filter(joke => joke.side === 'police').length;
  const robberCount = savedJokes.filter(joke => joke.side === 'robber').length;

  const removeSaved = async (id: string) => {
    const nextSavedIds = new Set(savedIds);
    nextSavedIds.delete(id);
    setSavedIds(nextSavedIds);
    await AsyncStorage.setItem(
      SAVED_JOKES_STORAGE_KEY,
      JSON.stringify([...nextSavedIds]),
    );
  };

  const shareJoke = async (joke: Joke) => {
    const meta = sideMeta[joke.side];

    shareText(meta.title, `${meta.title}\n\n${joke.text}`);
  };

  return (
    <Background>
      <View style={styles.container}>
        <Text style={styles.title}>Saved Jokes 📝</Text>
        <Text style={styles.counter}>{savedJokes.length} jokes saved</Text>

        <View style={styles.filters}>
          <Pressable
            style={[
              styles.filterButton,
              activeFilter === 'all' && styles.activeFilter,
            ]}
            onPress={() => setActiveFilter('all')}>
            <Text
              style={[
                styles.filterText,
                activeFilter === 'all' && styles.activeFilterText,
              ]}>
              📋 All
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.filterButton,
              activeFilter === 'police' && styles.activeFilter,
            ]}
            onPress={() => setActiveFilter('police')}>
            <Text
              style={[
                styles.filterText,
                activeFilter === 'police' && styles.activeFilterText,
              ]}>
              👮‍♂️ Police ({policeCount})
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.filterButton,
              activeFilter === 'robber' && styles.activeFilter,
            ]}
            onPress={() => setActiveFilter('robber')}>
            <Text
              style={[
                styles.filterText,
                activeFilter === 'robber' && styles.activeFilterText,
              ]}>
              🦹 Robber ({robberCount})
            </Text>
          </Pressable>
        </View>

        {savedJokes.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Image
              source={images.savedIntro}
              style={styles.emptyImage}
            />
            <Text style={styles.emptyTitle}>No saved jokes yet</Text>
            <Text style={styles.emptyText}>
              Head to the Jokes tab and tap Save on the ones that crack you up!
            </Text>
            <Pressable
              style={styles.goButton}
              onPress={() => navigation.navigate('JokesScreen' as never)}>
              <LinearGradient
                colors={['#0745E7', '#0C1573']}
                start={{x: 0.12, y: 0}}
                end={{x: 0.9, y: 1}}
                style={styles.goButtonGradient}>
                <Text style={styles.goButtonText}>Go to jokes</Text>
              </LinearGradient>
            </Pressable>
          </View>
        ) : (
          <View style={styles.cardsWrap}>
            {visibleJokes.map(joke => {
              const meta = sideMeta[joke.side];

              return (
                <JokeCard
                  key={joke.id}
                  author={meta.eyebrow}
                  authorColor={meta.accent}
                  authorImage={meta.image}
                  text={joke.text}
                  isSaved
                  minHeight={160}
                  onShare={() => shareJoke(joke)}
                  onToggleSaved={() => removeSaved(joke.id)}
                />
              );
            })}
          </View>
        )}
      </View>
    </Background>
  );
};

export default SavedScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 62,
    paddingBottom: 96,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 38,
    fontWeight: '800',
  },
  counter: {
    marginTop: 6,
    color: 'rgba(255,255,255,0.55)',
    fontSize: 15,
    lineHeight: 22,
  },
  filters: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    marginTop: 18,
    padding: 5,
    borderRadius: 18,
    backgroundColor: '#FFFFFF0D',
  },
  filterButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
    borderRadius: 14,
  },
  activeFilter: {
    borderWidth: 1,
    borderColor: '#0745E799',
    backgroundColor: '#0745E780',
  },
  filterText: {
    color: 'rgba(255,255,255,0.48)',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 86,
  },
  emptyImage: {
    resizeMode: 'contain',
    marginBottom: 20,
  },
  emptyTitle: {
    marginTop: 26,
    color: '#FFFFFF',
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyText: {
    maxWidth: 340,
    marginTop: 12,
    color: '#FFFFFF73',
    fontSize: 18,
    lineHeight: 25,
    textAlign: 'center',
  },
  goButton: {
    alignSelf: 'stretch',
    marginTop: 42,
  },
  goButtonGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 58,
    borderWidth: 1,
    borderColor: '#FFD7004D',
    borderRadius: 16,
  },
  goButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
  },
  cardsWrap: {
    paddingTop: 8,
  },
});
