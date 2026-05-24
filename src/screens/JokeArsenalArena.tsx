import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useMemo, useState} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import VerdictCanvas from '../components/VerdictCanvas';
import PunchlineTile from '../components/PunchlineTile';
import ComedianLaneDoor from '../components/ComedianLaneDoor';
import {jokes} from '../data/stellarCometWits';
import type {Joke, JokeSide} from '../types/verdictModels';
import {SAVED_JOKES_STORAGE_KEY} from '../loungeKit/loungeVaultKeys';
import {shareText} from '../loungeKit/witBroadcast';
import {images} from '../assets/loungeVisuals';

const comedianLaneManifest = {
  stellar: {
    title: "Host Mike's Jokes",
    eyebrow: 'HOST MIKE',
    emoji: '⭐',
    badge: 'STELLAR CREW',
    caption: '12 jokes • By the book',
    cardColors: ['#0745E7', '#0C1573'],
    borderColor: 'rgba(127,168,255,0.42)',
    accent: '#7FA8FF',
    image: images.stellarHero1,
  },
  comet: {
    title: "Slick Rico's Jokes",
    eyebrow: 'SLICK RICO',
    emoji: '🦹',
    badge: 'COMET CREW',
    caption: '12 jokes • Breaking all rules',
    cardColors: ['#3B0764', '#1A0535'],
    borderColor: 'rgba(217,70,239,0.45)',
    accent: '#C084FC',
    image: images.cometHero1,
  },
};

const JokeArsenalArena = () => {
  const [spotlightLane, setSpotlightLane] = useState<JokeSide | null>(null);
  const [bookmarkedJokeKeys, setBookmarkedJokeKeys] = useState<Set<string>>(
    () => new Set(),
  );

  useEffect(() => {
    const hydrateBookmarks = async () => {
      const vaultPayload = await AsyncStorage.getItem(SAVED_JOKES_STORAGE_KEY);

      if (vaultPayload) {
        setBookmarkedJokeKeys(new Set(JSON.parse(vaultPayload)));
      }
    };

    hydrateBookmarks();
  }, []);

  const jokesOnSpotlight = useMemo(() => {
    if (!spotlightLane) {
      return [];
    }

    return jokes.filter(joke => joke.side === spotlightLane);
  }, [spotlightLane]);

  const flipBookmarkState = (jokeKey: string) => {
    setBookmarkedJokeKeys(prevKeys => {
      const nextKeys = new Set(prevKeys);

      if (nextKeys.has(jokeKey)) {
        nextKeys.delete(jokeKey);
      } else {
        nextKeys.add(jokeKey);
      }

      AsyncStorage.setItem(
        SAVED_JOKES_STORAGE_KEY,
        JSON.stringify([...nextKeys]),
      );

      return nextKeys;
    });
  };

  const broadcastJoke = async (joke: Joke) => {
    const laneBlueprint = comedianLaneManifest[joke.side];

    shareText(laneBlueprint.title, `${laneBlueprint.title}\n\n${joke.text}`);
  };

  if (spotlightLane) {
    const laneBlueprint = comedianLaneManifest[spotlightLane];

    return (
      <VerdictCanvas>
        <View style={arsenalSheet.spotlightCrest}>
          <Pressable
            style={arsenalSheet.retreatSigil}
            onPress={() => setSpotlightLane(null)}>
            <Image source={images.backArrow} />
          </Pressable>
          <Text style={arsenalSheet.crestEmoji}>{laneBlueprint.emoji}</Text>
          <Text style={arsenalSheet.spotlightHeadline}>{laneBlueprint.title}</Text>
        </View>

        <View style={arsenalSheet.spotlightScroll}>
          {jokesOnSpotlight.map(joke => {
            const isBookmarked = bookmarkedJokeKeys.has(joke.id);

            return (
              <PunchlineTile
                key={joke.id}
                author={laneBlueprint.eyebrow}
                authorColor={laneBlueprint.accent}
                authorImage={laneBlueprint.image}
                text={joke.text}
                isSaved={isBookmarked}
                onShare={() => broadcastJoke(joke)}
                onToggleSaved={() => flipBookmarkState(joke.id)}
              />
            );
          })}
        </View>
      </VerdictCanvas>
    );
  }

  return (
    <VerdictCanvas>
      <View style={arsenalSheet.hubArena}>
        <Text style={arsenalSheet.hubGavel}>Jokes Arsenal 🎤</Text>
        <Text style={arsenalSheet.hubWhisper}>Choose your comedian</Text>

        <ComedianLaneDoor
          title={comedianLaneManifest.stellar.title}
          badge={comedianLaneManifest.stellar.badge}
          caption={comedianLaneManifest.stellar.caption}
          image={comedianLaneManifest.stellar.image}
          colors={comedianLaneManifest.stellar.cardColors}
          borderColor={comedianLaneManifest.stellar.borderColor}
          badgeColor="#C7D7FF"
          badgeBackground="rgba(255,255,255,0.16)"
          onPress={() => setSpotlightLane('stellar')}
        />

        <ComedianLaneDoor
          title={comedianLaneManifest.comet.title}
          badge={comedianLaneManifest.comet.badge}
          caption={comedianLaneManifest.comet.caption}
          image={comedianLaneManifest.comet.image}
          colors={comedianLaneManifest.comet.cardColors}
          borderColor={comedianLaneManifest.comet.borderColor}
          badgeColor="#C084FC"
          badgeBackground="rgba(255,255,255,0.14)"
          marginTop={30}
          onPress={() => setSpotlightLane('comet')}
        />

        <Pressable
          onPress={() =>
            setSpotlightLane(Date.now() % 2 === 0 ? 'stellar' : 'comet')
          }>
          <LinearGradient
            colors={['#FFD70026', '#0745E733']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={arsenalSheet.fateWheel}>
            <View style={arsenalSheet.fateWheelPad}>
              <View style={arsenalSheet.fateWheelSigil}>
                <Image source={images.randIcon} />
              </View>
              <View>
                <Text style={arsenalSheet.fateWheelHeadline}>Shuffle Category</Text>
                <Text style={arsenalSheet.fateWheelTeaser}>
                  Let fate decide — 24 total jokes
                </Text>
              </View>
            </View>
          </LinearGradient>
        </Pressable>
      </View>
    </VerdictCanvas>
  );
};

export default JokeArsenalArena;

const arsenalSheet = StyleSheet.create({
  hubArena: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 62,
    paddingBottom: 96,
  },
  hubGavel: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 38,
    fontWeight: '800',
  },
  hubWhisper: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.55)',
    fontSize: 15,
    lineHeight: 22,
  },
  fateWheelTeaser: {
    marginTop: 6,
    color: 'rgba(255,255,255,0.62)',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  fateWheel: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 98,
    marginTop: 52,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.42)',
    borderRadius: 22,
  },
  fateWheelPad: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  fateWheelSigil: {
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
  fateWheelHeadline: {
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
  },
  spotlightCrest: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 116,
    paddingHorizontal: 16,
    paddingTop: 34,
    backgroundColor: 'rgba(4,8,43,0.58)',
  },
  retreatSigil: {
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
  crestEmoji: {
    marginRight: 10,
    fontSize: 22,
    lineHeight: 30,
  },
  spotlightHeadline: {
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
  },
  spotlightScroll: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 96,
  },
});
