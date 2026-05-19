import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useMemo, useState} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Background from '../components/Background';
import JokeCard from '../components/JokeCard';
import JokeCategoryCard from '../components/JokeCategoryCard';
import {jokes} from '../data/jokes';
import type {Joke, JokeSide} from '../types/content';
import {SAVED_JOKES_STORAGE_KEY} from '../uttils/storage';
import {shareText} from '../uttils/share';

const sideMeta = {
  police: {
    title: "Officer Mike's Jokes",
    eyebrow: 'OFFICER MIKE',
    emoji: '👮‍♂️',
    badge: 'POLICE DEPT.',
    caption: '12 jokes • By the book',
    cardColors: ['#0745E7', '#0C1573'],
    borderColor: 'rgba(127,168,255,0.42)',
    accent: '#7FA8FF',
    image: require('../../rmmassets/rmmimgs/robb1.png'),
  },
  robber: {
    title: "Slick Rico's Jokes",
    eyebrow: 'SLICK RICO',
    emoji: '🦹',
    badge: 'CRIMINAL CREW',
    caption: '12 jokes • Breaking all rules',
    cardColors: ['#3B0764', '#1A0535'],
    borderColor: 'rgba(217,70,239,0.45)',
    accent: '#C084FC',
    image: require('../../rmmassets/rmmimgs/robb2.png'),
  },
};

const JokesScreen = () => {
  const [selectedSide, setSelectedSide] = useState<JokeSide | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    const loadSavedIds = async () => {
      const savedValue = await AsyncStorage.getItem(SAVED_JOKES_STORAGE_KEY);

      if (savedValue) {
        setSavedIds(new Set(JSON.parse(savedValue)));
      }
    };

    loadSavedIds();
  }, []);

  const visibleJokes = useMemo(() => {
    if (!selectedSide) {
      return [];
    }

    return jokes.filter(joke => joke.side === selectedSide);
  }, [selectedSide]);

  const toggleSaved = (id: string) => {
    setSavedIds(prevSavedIds => {
      const nextSavedIds = new Set(prevSavedIds);

      if (nextSavedIds.has(id)) {
        nextSavedIds.delete(id);
      } else {
        nextSavedIds.add(id);
      }

      AsyncStorage.setItem(
        SAVED_JOKES_STORAGE_KEY,
        JSON.stringify([...nextSavedIds]),
      );

      return nextSavedIds;
    });
  };

  const shareJoke = async (joke: Joke) => {
    const meta = sideMeta[joke.side];

    shareText(meta.title, `${meta.title}\n\n${joke.text}`);
  };

  if (selectedSide) {
    const meta = sideMeta[selectedSide];

    return (
      <Background>
        <View style={styles.detailHeader}>
          <Pressable
            style={styles.backButton}
            onPress={() => setSelectedSide(null)}>
            <Image source={require('../../rmmassets/rmmimgs/backarrw.png')} />
          </Pressable>
          <Text style={styles.headerEmoji}>{meta.emoji}</Text>
          <Text style={styles.detailTitle}>{meta.title}</Text>
        </View>

        <View style={styles.detailContent}>
          {visibleJokes.map(joke => {
            const isSaved = savedIds.has(joke.id);

            return (
              <JokeCard
                key={joke.id}
                author={meta.eyebrow}
                authorColor={meta.accent}
                authorImage={meta.image}
                text={joke.text}
                isSaved={isSaved}
                onShare={() => shareJoke(joke)}
                onToggleSaved={() => toggleSaved(joke.id)}
              />
            );
          })}
        </View>
      </Background>
    );
  }

  return (
    <Background>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>Jokes Arsenal 🎤</Text>
        <Text style={styles.menuSubtitle}>Choose your comedian</Text>

        <JokeCategoryCard
          title={sideMeta.police.title}
          badge={sideMeta.police.badge}
          caption={sideMeta.police.caption}
          image={sideMeta.police.image}
          colors={sideMeta.police.cardColors}
          borderColor={sideMeta.police.borderColor}
          badgeColor="#C7D7FF"
          badgeBackground="rgba(255,255,255,0.16)"
          onPress={() => setSelectedSide('police')}
        />

        <JokeCategoryCard
          title={sideMeta.robber.title}
          badge={sideMeta.robber.badge}
          caption={sideMeta.robber.caption}
          image={sideMeta.robber.image}
          colors={sideMeta.robber.cardColors}
          borderColor={sideMeta.robber.borderColor}
          badgeColor="#C084FC"
          badgeBackground="rgba(255,255,255,0.14)"
          marginTop={30}
          onPress={() => setSelectedSide('robber')}
        />

        <Pressable
          onPress={() =>
            setSelectedSide(Math.random() > 0.5 ? 'police' : 'robber')
          }>
          <LinearGradient
            colors={['#FFD70026', '#0745E733']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.randomCard}>
            <View style={styles.randomInner}>
              <View style={styles.randomIcon}>
                <Image
                  source={require('../../rmmassets/rmmimgs/randicon.png')}
                />
              </View>
              <View>
                <Text style={styles.randomTitle}>Random Category</Text>
                <Text style={styles.categoryCaption}>
                  Let fate decide — 24 total jokes
                </Text>
              </View>
            </View>
          </LinearGradient>
        </Pressable>
      </View>
    </Background>
  );
};

export default JokesScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  menuContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 62,
    paddingBottom: 96,
  },
  menuTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 38,
    fontWeight: '800',
  },
  menuSubtitle: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.55)',
    fontSize: 15,
    lineHeight: 22,
  },
  categoryCaption: {
    marginTop: 6,
    color: 'rgba(255,255,255,0.62)',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  randomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 98,
    marginTop: 52,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.42)',
    borderRadius: 22,
  },
  randomInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  randomIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 56,
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.5)',
    borderRadius: 16,
    backgroundColor: '#FFD70026',
  },
  randomIconText: {
    color: '#FFD700',
    fontSize: 29,
    lineHeight: 34,
    fontWeight: '700',
  },
  randomTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 116,
    paddingHorizontal: 16,
    paddingTop: 34,
    backgroundColor: 'rgba(4,8,43,0.58)',
  },
  backButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    marginRight: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 18,
    backgroundColor: '#FFFFFF14',
  },
  backIcon: {
    color: '#FFFFFF',
    fontSize: 30,
    lineHeight: 31,
    fontWeight: '300',
  },
  headerEmoji: {
    marginRight: 10,
    fontSize: 22,
    lineHeight: 30,
  },
  detailTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
  },
  detailContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 96,
  },
});
