import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useMemo, useState} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';

import VerdictCanvas from '../components/VerdictCanvas';
import ChronicleTeaser from '../components/ChronicleTeaser';
import {getStoryPreview, stories} from '../data/loungeChronicles';
import type {Story} from '../types/verdictModels';
import {LIKED_STORIES_STORAGE_KEY} from '../loungeKit/loungeVaultKeys';
import {shareText} from '../loungeKit/witBroadcast';
import {images} from '../assets/loungeVisuals';

const ChronicleHall = () => {
  const [openedChronicle, setOpenedChronicle] = useState<Story | null>(null);
  const [cherishedTaleKeys, setCherishedTaleKeys] = useState<Set<string>>(
    () => new Set(),
  );

  useEffect(() => {
    const hydrateCherishedTales = async () => {
      const heartVaultPayload = await AsyncStorage.getItem(
        LIKED_STORIES_STORAGE_KEY,
      );

      if (heartVaultPayload) {
        setCherishedTaleKeys(new Set(JSON.parse(heartVaultPayload)));
      }
    };

    hydrateCherishedTales();
  }, []);

  const chronicleFullScroll = useMemo(() => {
    if (!openedChronicle) {
      return '';
    }

    return openedChronicle.paragraphs.join('\n\n');
  }, [openedChronicle]);

  const flipChronicleHeart = (taleKey: string) => {
    setCherishedTaleKeys(prevKeys => {
      const nextKeys = new Set(prevKeys);

      if (nextKeys.has(taleKey)) {
        nextKeys.delete(taleKey);
      } else {
        nextKeys.add(taleKey);
      }

      AsyncStorage.setItem(
        LIKED_STORIES_STORAGE_KEY,
        JSON.stringify([...nextKeys]),
      );

      return nextKeys;
    });
  };

  const broadcastChronicle = async (chronicle: Story) => {
    shareText(
      chronicle.title,
      `${chronicle.title}\n\n${chronicle.paragraphs.join('\n\n')}`,
    );
  };

  if (openedChronicle) {
    const chronicleIsCherished = cherishedTaleKeys.has(openedChronicle.id);

    return (
      <VerdictCanvas>
        <View style={chronicleHallSheet.readerArena}>
          <View style={chronicleHallSheet.readerToolbar}>
            <Pressable
              style={chronicleHallSheet.orbitSigil}
              onPress={() => setOpenedChronicle(null)}>
              <Image source={images.backArrow} />
            </Pressable>
            <View style={chronicleHallSheet.readerToolbarRight}>
              <Pressable
                style={[
                  chronicleHallSheet.orbitSigil,
                  chronicleIsCherished && chronicleHallSheet.orbitSigilLit,
                ]}
                onPress={() => flipChronicleHeart(openedChronicle.id)}>
                <Image
                  source={
                    chronicleIsCherished ? images.storyLiked : images.storyLike
                  }
                />
              </Pressable>
              <Pressable
                style={chronicleHallSheet.orbitSigil}
                onPress={() => broadcastChronicle(openedChronicle)}>
                <Image source={images.share} />
              </Pressable>
            </View>
          </View>

          <Text style={chronicleHallSheet.readerHeadline}>
            {openedChronicle.title}
          </Text>
          <Image source={images.dividerUnder} />
          <Text style={chronicleHallSheet.readerScroll}>
            {chronicleFullScroll}
          </Text>
        </View>
      </VerdictCanvas>
    );
  }

  return (
    <VerdictCanvas>
      <View style={chronicleHallSheet.hallArena}>
        <Text style={chronicleHallSheet.hallGavel}>Funny Stories 📖</Text>
        <Text style={chronicleHallSheet.hallWhisper}>Tales from the comedy circuit</Text>

        <View style={chronicleHallSheet.teaserStack}>
          {stories.map(chronicle => {
            const chronicleIsCherished = cherishedTaleKeys.has(chronicle.id);

            return (
              <ChronicleTeaser
                key={chronicle.id}
                title={chronicle.title}
                preview={getStoryPreview(chronicle)}
                isLiked={chronicleIsCherished}
                onToggleLike={() => flipChronicleHeart(chronicle.id)}
                onRead={() => setOpenedChronicle(chronicle)}
              />
            );
          })}
        </View>
      </View>
    </VerdictCanvas>
  );
};

export default ChronicleHall;

const chronicleHallSheet = StyleSheet.create({
  hallArena: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 68,
    paddingBottom: 100,
  },
  hallGavel: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 38,
    fontWeight: '800',
  },
  hallWhisper: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.55)',
    fontSize: 15,
    lineHeight: 22,
  },
  teaserStack: {
    paddingTop: 24,
  },
  orbitSigilLit: {
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.25)',
    backgroundColor: 'rgba(255,215,0,0.16)',
  },
  readerArena: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 100,
  },
  readerToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  readerToolbarRight: {
    flexDirection: 'row',
    gap: 10,
  },
  orbitSigil: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  readerHeadline: {
    marginTop: 22,
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
    marginBottom: 10,
  },
  readerScroll: {
    marginTop: 20,
    color: 'rgba(255,255,255,0.82)',
    fontSize: 15,
    lineHeight: 27,
  },
});
