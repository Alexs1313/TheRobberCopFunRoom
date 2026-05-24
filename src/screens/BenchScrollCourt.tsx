import {useNavigation} from '@react-navigation/native';
import React, {useMemo, useState} from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import VerdictCanvas from '../components/VerdictCanvas';
import BenchPickTile from '../components/BenchPickTile';
import {shareText} from '../loungeKit/witBroadcast';
import {images} from '../assets/loungeVisuals';

type BenchPick = 'mike' | 'rico';
type GavelStamp = 'terrible' | 'hilarious';

const benchRoster = {
  mike: {
    name: 'Host Mike',
    subtitle: 'Strict & Formal',
    image: images.stellarHero1,
    imageResult: images.terrible,
  },
  rico: {
    name: 'Slick Rico',
    subtitle: 'Wild & Unpredictable',
    image: images.cometHero1,
    imageResult: images.happyJoke,
  },
};

const BenchScrollCourt = () => {
  const loungeNavigator = useNavigation();
  const [pickedBench, setPickedBench] = useState<BenchPick>('mike');
  const [witDraft, setWitDraft] = useState('');
  const [gavelStamp, setGavelStamp] = useState<GavelStamp | null>(null);

  const trimmedWit = witDraft.trim();
  const witReadyForBench = trimmedWit.length > 0;

  const benchOutcome = useMemo(() => {
    if (!gavelStamp) {
      return null;
    }

    const landedHilarious = gavelStamp === 'hilarious';

    return {
      landedHilarious,
      ribbonCopy: landedHilarious ? '✅ HILARIOUS' : '❌ TERRIBLE',
      gavelQuote: landedHilarious
        ? '"GUILTY — of being hilarious! Case closed, counsel! 🏛️"'
        : '"GUILTY — of a terrible joke! Sentenced to joke-writing school! 🚨"',
      starTally: landedHilarious ? 4 : 1,
      panelGradient: landedHilarious
        ? ['rgba(16,185,129,0.22)', 'rgba(7,69,231,0.28)']
        : ['rgba(190,24,93,0.24)', 'rgba(12,21,115,0.34)'],
      panelBorder: landedHilarious ? '#059669' : '#BE185D',
      ribbonTint: landedHilarious ? '#10B981' : '#E43F5A',
      portrait: benchRoster[pickedBench].image,
      portraitVerdict: benchRoster[pickedBench].imageResult,
    };
  }, [pickedBench, gavelStamp]);

  const submitToBench = () => {
    if (!witReadyForBench) {
      return;
    }

    setGavelStamp(trimmedWit.length >= 12 ? 'hilarious' : 'terrible');
  };

  const clearBenchScroll = () => {
    setGavelStamp(null);
    setWitDraft('');
  };

  const broadcastBenchOutcome = async () => {
    if (!benchOutcome) {
      return;
    }

    shareText(
      'Comedy Judge Result',
      `${benchOutcome.ribbonCopy}\n${benchOutcome.gavelQuote}\n\nYour joke:\n${trimmedWit}`,
    );
  };

  if (benchOutcome) {
    return (
      <VerdictCanvas>
        <View style={benchScrollSheet.verdictArena}>
          <Text style={benchScrollSheet.verdictGavel}>Comedy Judge ⭐</Text>
          <Text style={benchScrollSheet.verdictWhisper}>
            Is your joke guilty of being funny?
          </Text>

          <LinearGradient
            colors={benchOutcome.panelGradient}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={[
              benchScrollSheet.outcomePanel,
              {borderColor: benchOutcome.panelBorder},
            ]}>
            <View style={benchScrollSheet.outcomePad}>
              <Image
                source={benchOutcome.portraitVerdict}
                style={benchScrollSheet.outcomePortrait}
              />
              <View
                style={[
                  benchScrollSheet.outcomeRibbon,
                  {
                    borderColor: benchOutcome.ribbonTint,
                    backgroundColor: `${benchOutcome.ribbonTint}26`,
                  },
                ]}>
                <Text
                  style={[
                    benchScrollSheet.outcomeRibbonCopy,
                    {color: benchOutcome.ribbonTint},
                  ]}>
                  {benchOutcome.ribbonCopy}
                </Text>
              </View>
              <Text style={benchScrollSheet.outcomeQuote}>
                {benchOutcome.gavelQuote}
              </Text>
              <Text style={benchScrollSheet.outcomeStars}>
                {'★'.repeat(benchOutcome.starTally)}
                <Text style={benchScrollSheet.outcomeStarsMuted}>
                  {'★'.repeat(5 - benchOutcome.starTally)}
                </Text>
              </Text>
            </View>
          </LinearGradient>

          <View style={benchScrollSheet.witEchoPanel}>
            <Text style={benchScrollSheet.witEchoStamp}>YOUR JOKE:</Text>
            <Text style={benchScrollSheet.witEchoCopy}>{trimmedWit}</Text>
          </View>

          <View style={benchScrollSheet.outcomeActionRail}>
            <Pressable
              style={benchScrollSheet.outcomeShareSlot}
              onPress={broadcastBenchOutcome}>
              <LinearGradient
                colors={['#0745E7', '#0C1573']}
                start={{x: 0.12, y: 0}}
                end={{x: 0.9, y: 1}}
                style={benchScrollSheet.outcomeShareFill}>
                <Image source={images.shareIcon} />
                <Text style={benchScrollSheet.outcomeShareCopy}>
                  Share Result
                </Text>
              </LinearGradient>
            </Pressable>
            <Pressable
              style={benchScrollSheet.outcomeHomeSigil}
              onPress={() => loungeNavigator.navigate('JokesScreen' as never)}>
              <Image source={images.homeIcon} />
            </Pressable>
          </View>

          <Pressable onPress={clearBenchScroll}>
            <Text style={benchScrollSheet.retryWhisper}>Try another joke</Text>
          </Pressable>
        </View>
      </VerdictCanvas>
    );
  }

  return (
    <VerdictCanvas>
      <View style={benchScrollSheet.verdictArena}>
        <Text style={benchScrollSheet.verdictGavel}>Comedy Judge ⭐</Text>
        <Text style={benchScrollSheet.verdictWhisper}>
          Is your joke guilty of being funny?
        </Text>

        <Text style={benchScrollSheet.verdictStamp}>CHOOSE YOUR JUDGE</Text>
        <View style={benchScrollSheet.benchPickRail}>
          {(['mike', 'rico'] as BenchPick[]).map(benchKey => {
            const benchBlueprint = benchRoster[benchKey];
            const benchIsPicked = pickedBench === benchKey;

            return (
              <BenchPickTile
                key={benchKey}
                name={benchBlueprint.name}
                subtitle={benchBlueprint.subtitle}
                image={benchBlueprint.image}
                selected={benchIsPicked}
                subtitleColor={benchKey === 'rico' ? '#C084FC' : '#AFC6FF'}
                onPress={() => setPickedBench(benchKey)}
              />
            );
          })}
        </View>

        <Text style={benchScrollSheet.verdictStamp}>YOUR JOKE</Text>
        <View style={benchScrollSheet.witInkwell}>
          <TextInput
            value={witDraft}
            onChangeText={setWitDraft}
            placeholder="Tell your joke, citizen. The court is listening..."
            placeholderTextColor="#FFFFFF80"
            multiline
            maxLength={180}
            textAlignVertical="top"
            style={benchScrollSheet.witInkField}
          />
          <Text style={benchScrollSheet.witInkTally}>
            {witDraft.length} chars
          </Text>
        </View>

        <Pressable
          disabled={!witReadyForBench}
          onPress={submitToBench}
          style={benchScrollSheet.benchSubmitPress}>
          <LinearGradient
            colors={
              witReadyForBench
                ? ['#0745E7', '#0C1573']
                : ['rgba(255,255,255,0.11)', 'rgba(255,255,255,0.08)']
            }
            start={{x: 0.12, y: 0}}
            end={{x: 0.9, y: 1}}
            style={[
              benchScrollSheet.benchSubmitCta,
              !witReadyForBench && benchScrollSheet.benchSubmitCtaMuted,
            ]}>
            <Image
              source={images.submitIcon}
              tintColor={!witReadyForBench ? '#FFFFFF80' : '#FFFFFF'}
            />
            <Text
              style={[
                benchScrollSheet.benchSubmitCopy,
                !witReadyForBench && benchScrollSheet.benchSubmitCopyMuted,
              ]}>
              Submit to Court
            </Text>
          </LinearGradient>
        </Pressable>
        <Text style={benchScrollSheet.benchFootnote}>
          The judge decides based on their mysterious criteria...
        </Text>
      </View>
    </VerdictCanvas>
  );
};

export default BenchScrollCourt;

const benchScrollSheet = StyleSheet.create({
  verdictArena: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 62,
    paddingBottom: 106,
  },
  verdictGavel: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 38,
    fontWeight: '800',
  },
  verdictWhisper: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.55)',
    fontSize: 15,
    lineHeight: 22,
  },
  verdictStamp: {
    marginTop: 26,
    color: 'rgba(255,255,255,0.62)',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },
  benchPickRail: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  witInkwell: {
    minHeight: 188,
    marginTop: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#0745E766',
    borderRadius: 14,
    backgroundColor: '#0745E71A',
  },
  witInkField: {
    minHeight: 128,
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    padding: 0,
  },
  witInkTally: {
    marginTop: 8,
    color: '#FFFFFF80',
    fontSize: 13,
    lineHeight: 18,
  },
  benchSubmitPress: {
    marginTop: 70,
  },
  benchSubmitCta: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 58,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
    borderRadius: 16,
  },
  benchSubmitCtaMuted: {
    borderColor: 'rgba(255,255,255,0.08)',
  },
  benchSubmitCopy: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
  },
  benchSubmitCopyMuted: {
    color: 'rgba(255,255,255,0.35)',
  },
  benchFootnote: {
    marginTop: 16,
    color: 'rgba(255,255,255,0.24)',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  outcomePanel: {
    alignItems: 'center',
    minHeight: 358,
    marginTop: 28,
    borderWidth: 1,
    borderRadius: 22,
    overflow: 'hidden',
  },
  outcomePad: {
    alignItems: 'center',
    padding: 20,
    paddingHorizontal: 26.5,
  },
  outcomePortrait: {
    width: 112,
    height: 148,
    resizeMode: 'contain',
  },
  outcomeRibbon: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 999,
  },
  outcomeRibbonCopy: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  outcomeQuote: {
    marginTop: 18,
    color: '#FFFFFF',
    fontSize: 17,
    lineHeight: 25,
    fontWeight: '600',
    textAlign: 'center',
  },
  outcomeStars: {
    marginTop: 18,
    color: '#FFD700',
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: 2,
  },
  outcomeStarsMuted: {
    color: 'rgba(255,255,255,0.22)',
  },
  witEchoPanel: {
    minHeight: 80,
    marginTop: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(127,168,255,0.2)',
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  witEchoStamp: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6,
  },
  witEchoCopy: {
    marginTop: 12,
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 22,
  },
  outcomeActionRail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  outcomeShareSlot: {
    flex: 1,
    marginRight: 12,
  },
  outcomeShareFill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
    borderRadius: 14,
  },
  outcomeShareCopy: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
  },
  outcomeHomeSigil: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFFFFF14',
    borderWidth: 1,
    borderColor: '#FFFFFF1F',
  },
  retryWhisper: {
    marginTop: 18,
    color: 'rgba(255,255,255,0.36)',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
});
