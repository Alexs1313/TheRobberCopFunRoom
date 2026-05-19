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

import Background from '../components/Background';
import JudgeCard from '../components/JudgeCard';
import {shareText} from '../uttils/share';

type Judge = 'mike' | 'rico';
type Verdict = 'terrible' | 'hilarious';

const judgeMeta = {
  mike: {
    name: 'Officer Mike',
    subtitle: 'Strict & Formal',
    image: require('../../rmmassets/rmmimgs/robb1.png'),
    imageResult: require('../../rmmassets/rmmimgs/terrible.png'),
  },
  rico: {
    name: 'Slick Rico',
    subtitle: 'Wild & Unpredictable',
    image: require('../../rmmassets/rmmimgs/robb2.png'),
    imageResult: require('../../rmmassets/rmmimgs/happyjoke.png'),
  },
};

const RateJokeScreen = () => {
  const navigation = useNavigation();
  const [selectedJudge, setSelectedJudge] = useState<Judge>('mike');
  const [joke, setJoke] = useState('');
  const [verdict, setVerdict] = useState<Verdict | null>(null);

  const trimmedJoke = joke.trim();
  const canSubmit = trimmedJoke.length > 0;

  const result = useMemo(() => {
    if (!verdict) {
      return null;
    }

    const isGood = verdict === 'hilarious';

    return {
      isGood,
      badge: isGood ? '✅ HILARIOUS' : '❌ TERRIBLE',
      quote: isGood
        ? '"GUILTY — of being hilarious! Case closed, counsel! 🏛️"'
        : '"GUILTY — of a terrible joke! Sentenced to joke-writing school! 🚨"',
      stars: isGood ? 4 : 1,
      colors: isGood
        ? ['rgba(16,185,129,0.22)', 'rgba(7,69,231,0.28)']
        : ['rgba(190,24,93,0.24)', 'rgba(12,21,115,0.34)'],
      borderColor: isGood ? '#059669' : '#BE185D',
      badgeColor: isGood ? '#10B981' : '#E43F5A',
      image: judgeMeta[selectedJudge].image,
      imageResult: judgeMeta[selectedJudge].imageResult,
    };
  }, [selectedJudge, verdict]);

  const submitJoke = () => {
    if (!canSubmit) {
      return;
    }

    setVerdict(trimmedJoke.length >= 12 ? 'hilarious' : 'terrible');
  };

  const resetForm = () => {
    setVerdict(null);
    setJoke('');
  };

  const shareResult = async () => {
    if (!result) {
      return;
    }

    shareText(
      'Comedy Judge Result',
      `${result.badge}\n${result.quote}\n\nYour joke:\n${trimmedJoke}`,
    );
  };

  if (result) {
    return (
      <Background>
        <View style={styles.container}>
          <Text style={styles.title}>Comedy Judge ⭐</Text>
          <Text style={styles.subtitle}>
            Is your joke guilty of being funny?
          </Text>

          <LinearGradient
            colors={result.colors}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={[styles.resultCard, {borderColor: result.borderColor}]}>
            <View style={styles.resultCardInner}>
              <Image source={result.imageResult} style={styles.resultImage} />
              <View
                style={[
                  styles.verdictBadge,
                  {
                    borderColor: result.badgeColor,
                    backgroundColor: `${result.badgeColor}26`,
                  },
                ]}>
                <Text style={[styles.verdictText, {color: result.badgeColor}]}>
                  {result.badge}
                </Text>
              </View>
              <Text style={styles.resultQuote}>{result.quote}</Text>
              <Text style={styles.stars}>
                {'★'.repeat(result.stars)}
                <Text style={styles.emptyStars}>
                  {'★'.repeat(5 - result.stars)}
                </Text>
              </Text>
            </View>
          </LinearGradient>

          <View style={styles.jokePreview}>
            <Text style={styles.previewLabel}>YOUR JOKE:</Text>
            <Text style={styles.previewText}>{trimmedJoke}</Text>
          </View>

          <View style={styles.resultActions}>
            <Pressable style={styles.shareButton} onPress={shareResult}>
              <LinearGradient
                colors={['#0745E7', '#0C1573']}
                start={{x: 0.12, y: 0}}
                end={{x: 0.9, y: 1}}
                style={styles.shareGradient}>
                <Image
                  source={require('../../rmmassets/rmmimgs/shareicon.png')}
                />
                <Text style={styles.shareText}>Share Result</Text>
              </LinearGradient>
            </Pressable>
            <Pressable
              style={styles.homeButton}
              onPress={() => navigation.navigate('JokesScreen' as never)}>
              <Image source={require('../../rmmassets/rmmimgs/homeicon.png')} />
            </Pressable>
          </View>

          <Pressable onPress={resetForm}>
            <Text style={styles.tryAgainText}>Try another joke</Text>
          </Pressable>
        </View>
      </Background>
    );
  }

  return (
    <Background>
      <View style={styles.container}>
        <Text style={styles.title}>Comedy Judge ⭐</Text>
        <Text style={styles.subtitle}>Is your joke guilty of being funny?</Text>

        <Text style={styles.sectionLabel}>CHOOSE YOUR JUDGE</Text>
        <View style={styles.judgeRow}>
          {(['mike', 'rico'] as Judge[]).map(judge => {
            const meta = judgeMeta[judge];
            const isSelected = selectedJudge === judge;

            return (
              <JudgeCard
                key={judge}
                name={meta.name}
                subtitle={meta.subtitle}
                image={meta.image}
                selected={isSelected}
                subtitleColor={judge === 'rico' ? '#C084FC' : '#AFC6FF'}
                onPress={() => setSelectedJudge(judge)}
              />
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>YOUR JOKE</Text>
        <View style={styles.inputWrap}>
          <TextInput
            value={joke}
            onChangeText={setJoke}
            placeholder="Tell your joke, citizen. The court is listening..."
            placeholderTextColor="#FFFFFF80"
            multiline
            maxLength={180}
            textAlignVertical="top"
            style={styles.input}
          />
          <Text style={styles.charCount}>{joke.length} chars</Text>
        </View>

        <Pressable
          disabled={!canSubmit}
          onPress={submitJoke}
          style={styles.submitPressable}>
          <LinearGradient
            colors={
              canSubmit
                ? ['#0745E7', '#0C1573']
                : ['rgba(255,255,255,0.11)', 'rgba(255,255,255,0.08)']
            }
            start={{x: 0.12, y: 0}}
            end={{x: 0.9, y: 1}}
            style={[
              styles.submitButton,
              !canSubmit && styles.disabledSubmitButton,
            ]}>
            <Image
              source={require('../../rmmassets/rmmimgs/submiticon.png')}
              tintColor={!canSubmit ? '#FFFFFF80' : '#FFFFFF'}
            />
            <Text
              style={[
                styles.submitText,
                !canSubmit && styles.disabledSubmitText,
              ]}>
              Submit to Court
            </Text>
          </LinearGradient>
        </Pressable>
        <Text style={styles.noteText}>
          The judge decides based on their mysterious criteria...
        </Text>
      </View>
    </Background>
  );
};

export default RateJokeScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 62,
    paddingBottom: 106,
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
  sectionLabel: {
    marginTop: 26,
    color: 'rgba(255,255,255,0.62)',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },
  judgeRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  inputWrap: {
    minHeight: 188,
    marginTop: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#0745E766',
    borderRadius: 14,
    backgroundColor: '#0745E71A',
  },
  input: {
    minHeight: 128,
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    padding: 0,
  },
  charCount: {
    marginTop: 8,
    color: '#FFFFFF80',
    fontSize: 13,
    lineHeight: 18,
  },
  submitPressable: {
    marginTop: 70,
  },
  submitButton: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 58,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
    borderRadius: 16,
  },
  disabledSubmitButton: {
    borderColor: 'rgba(255,255,255,0.08)',
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
  },
  disabledSubmitText: {
    color: 'rgba(255,255,255,0.35)',
  },
  noteText: {
    marginTop: 16,
    color: 'rgba(255,255,255,0.24)',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  resultCard: {
    alignItems: 'center',
    minHeight: 358,
    marginTop: 28,
    borderWidth: 1,
    borderRadius: 22,
    overflow: 'hidden',
  },
  resultCardInner: {
    alignItems: 'center',
    padding: 20,
    paddingHorizontal: 26.5,
  },
  resultImage: {
    width: 112,
    height: 148,
    resizeMode: 'contain',
  },
  verdictBadge: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 999,
  },
  verdictText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  resultQuote: {
    marginTop: 18,
    color: '#FFFFFF',
    fontSize: 17,
    lineHeight: 25,
    fontWeight: '600',
    textAlign: 'center',
  },
  stars: {
    marginTop: 18,
    color: '#FFD700',
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: 2,
  },
  emptyStars: {
    color: 'rgba(255,255,255,0.22)',
  },
  jokePreview: {
    minHeight: 80,
    marginTop: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(127,168,255,0.2)',
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  previewLabel: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6,
  },
  previewText: {
    marginTop: 12,
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 22,
  },
  resultActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  shareButton: {
    flex: 1,
    marginRight: 12,
  },
  shareGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
    borderRadius: 14,
  },
  shareText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
  },
  homeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFFFFF14',
    borderWidth: 1,
    borderColor: '#FFFFFF1F',
  },
  homeIcon: {
    color: '#FFFFFF',
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '800',
  },
  tryAgainText: {
    marginTop: 18,
    color: 'rgba(255,255,255,0.36)',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
});
