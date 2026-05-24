import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useMemo, useState} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import VerdictCanvas from '../components/VerdictCanvas';
import PunchlineTile from '../components/PunchlineTile';
import {jokes} from '../data/stellarCometWits';
import type {Joke, JokeSide} from '../types/verdictModels';
import {SAVED_JOKES_STORAGE_KEY} from '../loungeKit/loungeVaultKeys';
import {shareText} from '../loungeKit/witBroadcast';
import {images} from '../assets/loungeVisuals';

type VaultLaneFilter = 'all' | JokeSide;

const comedianLaneManifest = {
  stellar: {
    title: "Host Mike's Jokes",
    eyebrow: 'HOST MIKE',
    emoji: '⭐',
    accent: '#7FA8FF',
    image: images.stellarHero1,
  },
  comet: {
    title: "Slick Rico's Jokes",
    eyebrow: 'SLICK RICO',
    emoji: '🦹',
    accent: '#C084FC',
    image: images.cometHero1,
  },
};

const WitVaultArchive = () => {
  const loungeNavigator = useNavigation();
  const [vaultLaneFilter, setVaultLaneFilter] = useState<VaultLaneFilter>('all');
  const [bookmarkedJokeKeys, setBookmarkedJokeKeys] = useState<Set<string>>(
    () => new Set(),
  );

  useFocusEffect(
    useCallback(() => {
      let screenStillMounted = true;

      const hydrateBookmarks = async () => {
        const vaultPayload = await AsyncStorage.getItem(SAVED_JOKES_STORAGE_KEY);

        if (screenStillMounted) {
          setBookmarkedJokeKeys(
            new Set(vaultPayload ? JSON.parse(vaultPayload) : []),
          );
        }
      };

      hydrateBookmarks();

      return () => {
        screenStillMounted = false;
      };
    }, []),
  );

  const vaultJokeStack = useMemo(
    () => jokes.filter(joke => bookmarkedJokeKeys.has(joke.id)),
    [bookmarkedJokeKeys],
  );

  const jokesOnDisplay = useMemo(() => {
    if (vaultLaneFilter === 'all') {
      return vaultJokeStack;
    }

    return vaultJokeStack.filter(joke => joke.side === vaultLaneFilter);
  }, [vaultLaneFilter, vaultJokeStack]);

  const stellarVaultTally = vaultJokeStack.filter(
    joke => joke.side === 'stellar',
  ).length;
  const cometVaultTally = vaultJokeStack.filter(
    joke => joke.side === 'comet',
  ).length;

  const evictBookmark = async (jokeKey: string) => {
    const nextKeys = new Set(bookmarkedJokeKeys);
    nextKeys.delete(jokeKey);
    setBookmarkedJokeKeys(nextKeys);
    await AsyncStorage.setItem(
      SAVED_JOKES_STORAGE_KEY,
      JSON.stringify([...nextKeys]),
    );
  };

  const broadcastJoke = async (joke: Joke) => {
    const laneBlueprint = comedianLaneManifest[joke.side];

    shareText(laneBlueprint.title, `${laneBlueprint.title}\n\n${joke.text}`);
  };

  return (
    <VerdictCanvas>
      <View style={vaultKeepSheet.archiveArena}>
        <Text style={vaultKeepSheet.archiveGavel}>Saved Jokes 📝</Text>
        <Text style={vaultKeepSheet.archiveTally}>
          {vaultJokeStack.length} jokes saved
        </Text>

        <View style={vaultKeepSheet.lanePickerRail}>
          <Pressable
            style={[
              vaultKeepSheet.lanePickerChip,
              vaultLaneFilter === 'all' && vaultKeepSheet.lanePickerChipLit,
            ]}
            onPress={() => setVaultLaneFilter('all')}>
            <Text
              style={[
                vaultKeepSheet.lanePickerCopy,
                vaultLaneFilter === 'all' && vaultKeepSheet.lanePickerCopyLit,
              ]}>
              📋 All
            </Text>
          </Pressable>
          <Pressable
            style={[
              vaultKeepSheet.lanePickerChip,
              vaultLaneFilter === 'stellar' && vaultKeepSheet.lanePickerChipLit,
            ]}
            onPress={() => setVaultLaneFilter('stellar')}>
            <Text
              style={[
                vaultKeepSheet.lanePickerCopy,
                vaultLaneFilter === 'stellar' &&
                  vaultKeepSheet.lanePickerCopyLit,
              ]}>
              ⭐ Stellar ({stellarVaultTally})
            </Text>
          </Pressable>
          <Pressable
            style={[
              vaultKeepSheet.lanePickerChip,
              vaultLaneFilter === 'comet' && vaultKeepSheet.lanePickerChipLit,
            ]}
            onPress={() => setVaultLaneFilter('comet')}>
            <Text
              style={[
                vaultKeepSheet.lanePickerCopy,
                vaultLaneFilter === 'comet' && vaultKeepSheet.lanePickerCopyLit,
              ]}>
              ☄️ Comet ({cometVaultTally})
            </Text>
          </Pressable>
        </View>

        {vaultJokeStack.length === 0 ? (
          <View style={vaultKeepSheet.emptyVault}>
            <Image
              source={images.savedIntro}
              style={vaultKeepSheet.emptyVaultArt}
            />
            <Text style={vaultKeepSheet.emptyVaultGavel}>No saved jokes yet</Text>
            <Text style={vaultKeepSheet.emptyVaultWhisper}>
              Head to the Jokes tab and tap Save on the ones that crack you up!
            </Text>
            <Pressable
              style={vaultKeepSheet.vaultExitCta}
              onPress={() => loungeNavigator.navigate('JokesScreen' as never)}>
              <LinearGradient
                colors={['#0745E7', '#0C1573']}
                start={{x: 0.12, y: 0}}
                end={{x: 0.9, y: 1}}
                style={vaultKeepSheet.vaultExitCtaFill}>
                <Text style={vaultKeepSheet.vaultExitCtaCopy}>Go to jokes</Text>
              </LinearGradient>
            </Pressable>
          </View>
        ) : (
          <View style={vaultKeepSheet.witStack}>
            {jokesOnDisplay.map(joke => {
              const laneBlueprint = comedianLaneManifest[joke.side];

              return (
                <PunchlineTile
                  key={joke.id}
                  author={laneBlueprint.eyebrow}
                  authorColor={laneBlueprint.accent}
                  authorImage={laneBlueprint.image}
                  text={joke.text}
                  isSaved
                  minHeight={160}
                  onShare={() => broadcastJoke(joke)}
                  onToggleSaved={() => evictBookmark(joke.id)}
                />
              );
            })}
          </View>
        )}
      </View>
    </VerdictCanvas>
  );
};

export default WitVaultArchive;

const vaultKeepSheet = StyleSheet.create({
  archiveArena: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 62,
    paddingBottom: 96,
  },
  archiveGavel: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 38,
    fontWeight: '800',
  },
  archiveTally: {
    marginTop: 6,
    color: 'rgba(255,255,255,0.55)',
    fontSize: 15,
    lineHeight: 22,
  },
  lanePickerRail: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    marginTop: 18,
    padding: 5,
    borderRadius: 18,
    backgroundColor: '#FFFFFF0D',
  },
  lanePickerChip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
    borderRadius: 14,
  },
  lanePickerChipLit: {
    borderWidth: 1,
    borderColor: '#0745E799',
    backgroundColor: '#0745E780',
  },
  lanePickerCopy: {
    color: 'rgba(255,255,255,0.48)',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
  },
  lanePickerCopyLit: {
    color: '#FFFFFF',
  },
  emptyVault: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 86,
  },
  emptyVaultArt: {
    resizeMode: 'contain',
    marginBottom: 20,
  },
  emptyVaultGavel: {
    marginTop: 26,
    color: '#FFFFFF',
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyVaultWhisper: {
    maxWidth: 340,
    marginTop: 12,
    color: '#FFFFFF73',
    fontSize: 18,
    lineHeight: 25,
    textAlign: 'center',
  },
  vaultExitCta: {
    alignSelf: 'stretch',
    marginTop: 42,
  },
  vaultExitCtaFill: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 58,
    borderWidth: 1,
    borderColor: '#FFD7004D',
    borderRadius: 16,
  },
  vaultExitCtaCopy: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
  },
  witStack: {
    paddingTop: 8,
  },
});
