import React, {useEffect, useMemo, useState} from 'react';
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
import {officerGameJokes, robberGameJokes} from '../data/game';
import type {GameComedian, GameRole} from '../types/content';
import {shareText} from '../uttils/share';
import {images} from '../assets/images';

type ScreenState =
  | 'intro'
  | 'setup'
  | 'ready'
  | 'play'
  | 'timeup'
  | 'vote'
  | 'result';

const roleMeta = {
  officer: {
    label: 'Officer',
    emoji: '👮‍♂️',
    image: images.robb1,
    readyTitle: 'Officer — Sentence with Comedy!',
    timeupText: 'Great job, Officer! Now let Slick Rico have a turn.',
    turnImage: images.firstRobb,
  },
  robber: {
    label: 'Robber',
    emoji: '🦹',
    image: images.robb2,
    readyTitle: 'Robber — Escape with Comedy!',
    timeupText: 'Great job, Robber! Now let Officer Mike have a turn.',
    turnImage: images.secRobb,
  },
};

const GameScreen = () => {
  const [screen, setScreen] = useState<ScreenState>('intro');
  const [comedianOneName, setComedianOneName] = useState('');
  const [comedianTwoName, setComedianTwoName] = useState('');
  const [comedianOneRole, setComedianOneRole] = useState<GameRole>('officer');
  const [turnIndex, setTurnIndex] = useState(0);
  const [jokeIndex, setJokeIndex] = useState(0);
  const [timer, setTimer] = useState(30);
  const [votes, setVotes] = useState([0, 0]);

  const comedians = useMemo<GameComedian[]>(() => {
    const comedianTwoRole: GameRole =
      comedianOneRole === 'officer' ? 'robber' : 'officer';

    return [
      {name: comedianOneName.trim() || 'Comedian 1', role: comedianOneRole},
      {name: comedianTwoName.trim() || 'Comedian 2', role: comedianTwoRole},
    ];
  }, [comedianOneName, comedianOneRole, comedianTwoName]);

  const currentComedian = comedians[turnIndex];
  const currentJokes =
    currentComedian.role === 'officer' ? officerGameJokes : robberGameJokes;
  const canStart =
    comedianOneName.trim().length > 0 && comedianTwoName.trim().length > 0;
  const progress = screen === 'vote' ? timer / 20 : timer / 30;
  const championIndex = votes[0] === votes[1] ? 0 : votes[0] > votes[1] ? 0 : 1;
  const champion = comedians[championIndex];

  useEffect(() => {
    if (screen !== 'play' && screen !== 'vote') {
      return;
    }

    const interval = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          setScreen(screen === 'play' ? 'timeup' : 'result');
          return 0;
        }

        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [screen]);

  const startTrial = () => {
    if (!canStart) {
      return;
    }

    setTurnIndex(0);
    setJokeIndex(0);
    setTimer(30);
    setVotes([0, 0]);
    setScreen('ready');
  };

  const startTurn = () => {
    setJokeIndex(0);
    setTimer(30);
    setScreen('play');
  };

  const finishTimeup = () => {
    if (turnIndex === 0) {
      setTurnIndex(1);
      setJokeIndex(0);
      setTimer(30);
      setScreen('ready');
      return;
    }

    setTimer(20);
    setScreen('vote');
  };

  const addVote = (index: number) => {
    setVotes(prevVotes => {
      const nextVotes = [...prevVotes];
      nextVotes[index] += 1;
      return nextVotes;
    });
  };

  const shareResult = async () => {
    shareText(
      'The Comedy Trial Verdict',
      `🏆 Champion: ${champion.name}\n\nFinal score:\n${comedians[0].name}: ${votes[0]}\n${comedians[1].name}: ${votes[1]}`,
    );
  };

  const resetGame = () => {
    setScreen('intro');
    setTurnIndex(0);
    setJokeIndex(0);
    setTimer(30);
    setVotes([0, 0]);
  };

  if (screen === 'intro') {
    return (
      <Background>
        <View style={styles.introContainer}>
          <Image source={images.comedyIntro} style={styles.introImage} />
          <Text style={styles.introTitle}>The Comedy Trial</Text>
          <Text style={styles.introSubtitle}>2-side Showdown</Text>

          <LinearGradient
            colors={['#0745E733', 'rgba(12,21,115,0.3)']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.howCard}>
            <View style={styles.cardInner}>
              <Text style={styles.yellowLabel}>HOW IT WORKS</Text>
              {[
                ['👮‍♂️', 'Officer Mike tries to SENTENCE the robber'],
                ['🦹', 'Slick Rico tries to ESCAPE justice'],
                ['🎤', 'Each side gets 30 seconds to tell jokes'],
                ['👥', 'The crowd votes on who was funniest'],
                ['⚖️', 'The jury decides the verdict!'],
              ].map(([icon, text]) => (
                <View key={text} style={styles.howRow}>
                  <View style={styles.howIcon}>
                    <Text style={styles.howIconText}>{icon}</Text>
                  </View>
                  <Text style={styles.howText}>{text}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>

          <Pressable
            onPress={() => setScreen('setup')}
            style={styles.fullWidth}>
            <LinearGradient
              colors={['#0745E7', '#0C1573']}
              start={{x: 0.12, y: 0}}
              end={{x: 0.9, y: 1}}
              style={styles.primaryButton}>
              <Image source={images.buttonIcon} />
              <Text style={styles.primaryButtonText}>Pick Your Side</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </Background>
    );
  }

  if (screen === 'setup') {
    const comedianTwoRole = comedians[1].role;

    return (
      <Background>
        <View style={styles.container}>
          <Text style={styles.title}>Set Up Sides</Text>
          <Text style={styles.subtitle}>Enter names and choose sides</Text>

          <Text style={styles.yellowLabel}>SIDE 1</Text>
          <LinearGradient
            colors={['#0745E733', 'rgba(12,21,115,0.3)']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.setupCard}>
            <View style={styles.cardInner}>
              <TextInput
                value={comedianOneName}
                onChangeText={setComedianOneName}
                placeholder="Enter name..."
                placeholderTextColor="rgba(255,255,255,0.45)"
                style={styles.nameInput}
              />
              <Text style={styles.chooseText}>Choose role:</Text>
              <View style={styles.roleRow}>
                {(['officer', 'robber'] as GameRole[]).map(role => {
                  const selected = comedianOneRole === role;

                  return (
                    <Pressable
                      key={role}
                      style={[
                        styles.roleCard,
                        selected && styles.selectedRoleCard,
                      ]}
                      onPress={() => setComedianOneRole(role)}>
                      <View style={styles.roleAvatar}>
                        <Image
                          source={roleMeta[role].image}
                          style={styles.roleAvatarImage}
                        />
                      </View>
                      <Text style={styles.roleName}>
                        {roleMeta[role].label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </LinearGradient>

          <Text style={styles.yellowLabel}>SIDE 2</Text>
          <LinearGradient
            colors={['rgba(126,34,206,0.35)', 'rgba(26,5,53,0.4)']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={[styles.setupCard, styles.comedianTwoCard]}>
            <View style={styles.cardInner}>
              <TextInput
                value={comedianTwoName}
                onChangeText={setComedianTwoName}
                placeholder="Enter name..."
                placeholderTextColor="rgba(255,255,255,0.45)"
                style={styles.nameInput}
              />
              <View style={styles.assignedRole}>
                <View style={styles.roleAvatar}>
                  <Image
                    source={roleMeta[comedianTwoRole].image}
                    style={styles.roleAvatarImage}
                  />
                </View>
                <View>
                  <Text style={styles.roleName}>
                    {roleMeta[comedianTwoRole].label}
                  </Text>
                  <Text style={styles.assignedText}>
                    Assigned automatically
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>

          {canStart && (
            <LinearGradient
              colors={['rgba(255,255,255,0.1)', 'rgba(255,215,0,0.08)']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.comediansPreview}>
              <View style={styles.comediansPreviewInner}>
                <View style={styles.previewComedian}>
                  <View style={styles.previewAvatarOfficer}>
                    <Image
                      source={roleMeta[comedians[0].role].image}
                      style={styles.previewImage}
                    />
                  </View>
                  <Text style={styles.previewName}>{comedians[0].name}</Text>
                </View>
                <Text style={styles.scaleIcon}>⚖️</Text>
                <View style={styles.previewComedian}>
                  <View style={styles.previewAvatarRobber}>
                    <Image
                      source={roleMeta[comedians[1].role].image}
                      style={styles.previewImage}
                    />
                  </View>
                  <Text style={styles.previewName}>{comedians[1].name}</Text>
                </View>
              </View>
            </LinearGradient>
          )}

          <Pressable
            disabled={!canStart}
            onPress={startTrial}
            style={styles.setupStart}>
            <LinearGradient
              colors={
                canStart
                  ? ['#0745E7', '#0C1573']
                  : ['rgba(255,255,255,0.11)', 'rgba(255,255,255,0.08)']
              }
              start={{x: 0.12, y: 0}}
              end={{x: 0.9, y: 1}}
              style={styles.primaryButton}>
              <Text
                style={[
                  styles.primaryButtonText,
                  !canStart && styles.disabledText,
                ]}>
                🏛 Start the Trial!
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </Background>
    );
  }

  if (screen === 'ready') {
    const meta = roleMeta[currentComedian.role];

    return (
      <Background>
        <View style={styles.readyContainer}>
          <Image source={meta.turnImage} style={styles.readyImage} />
          <Text style={styles.readyTitle}>{currentComedian.name}'s Turn!</Text>
          <Text
            style={[
              styles.readySubtitle,
              currentComedian.role === 'officer'
                ? styles.readySubtitleOfficer
                : styles.readySubtitleRobber,
            ]}>
            {meta.readyTitle}
          </Text>
          <Text style={styles.readyText}>
            You'll have 30 seconds to read jokes. Pass the phone to{' '}
            {currentComedian.name}!
          </Text>
          <View style={styles.tipBox}>
            <Text style={styles.tipText}>
              📖 Read jokes aloud to the group • Swipe through with Next • You
              can skip any joke
            </Text>
          </View>
          <Pressable onPress={startTurn} style={styles.fullWidth}>
            <LinearGradient
              colors={
                currentComedian.role === 'officer'
                  ? ['#0745E7', '#0C1573']
                  : ['#A855F7', '#581C87']
              }
              start={{x: 0.12, y: 0}}
              end={{x: 0.9, y: 1}}
              style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>I'm Ready — Start! ⏱</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </Background>
    );
  }

  if (screen === 'play') {
    return (
      <Background>
        <View style={styles.playContainer}>
          <View style={styles.playHeader}>
            <View style={styles.comedianHeader}>
              <Text style={styles.comedianHeaderEmoji}>
                {roleMeta[currentComedian.role].emoji}
              </Text>
              <View>
                <Text style={styles.playName}>{currentComedian.name}</Text>
                <Text style={styles.playCount}>
                  {jokeIndex + 1} of {currentJokes.length}
                </Text>
              </View>
            </View>
            <View style={styles.timerCircle}>
              <Text style={styles.timerText}>{timer}</Text>
            </View>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {width: `${Math.max(progress, 0) * 100}%`},
              ]}
            />
          </View>

          <LinearGradient
            colors={['#0745E733', 'rgba(12,21,115,0.3)']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.jokeCard}>
            <View style={styles.cardInner}>
              <Text style={styles.currentJoke}>{currentJokes[jokeIndex]}</Text>
            </View>
          </LinearGradient>

          <View style={styles.dotsRow}>
            {currentJokes.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, index === jokeIndex && styles.activeDot]}
              />
            ))}
          </View>

          <View style={styles.playActions}>
            <Pressable
              style={styles.backSmallButton}
              onPress={() =>
                setJokeIndex(prevIndex => Math.max(prevIndex - 1, 0))
              }>
              <Image source={images.backArrowWide} />
            </Pressable>
            <Pressable
              style={styles.nextJokeButton}
              onPress={() =>
                setJokeIndex(prevIndex =>
                  Math.min(prevIndex + 1, currentJokes.length - 1),
                )
              }>
              <LinearGradient
                colors={['#0745E766', '#0745E766']}
                start={{x: 0.12, y: 0}}
                end={{x: 0.9, y: 1}}
                style={styles.nextJokeGradient}>
                <Text style={styles.primaryButtonText}>Next Joke</Text>
                <Image source={images.arrowRight} />
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </Background>
    );
  }

  if (screen === 'timeup') {
    return (
      <Background>
        <View style={styles.timeupContainer}>
          <View style={styles.playHeader}>
            <View style={styles.comedianHeader}>
              <Text style={styles.comedianHeaderEmoji}>
                {roleMeta[currentComedian.role].emoji}
              </Text>
              <View>
                <Text style={styles.playName}>{currentComedian.name}</Text>
                <Text style={styles.playCount}>
                  {currentJokes.length} of {currentJokes.length}
                </Text>
              </View>
            </View>
            <View style={[styles.timerCircle, styles.timerDone]}>
              <Text style={styles.timerDoneText}>0</Text>
            </View>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, styles.progressDone]} />
          </View>

          <View style={styles.alarmWrap}>
            <Text style={styles.alarmEmoji}>⏰</Text>
            <Text style={styles.timeupTitle}>Time's Up!</Text>
            <Text style={styles.timeupText}>
              {roleMeta[currentComedian.role].timeupText}
            </Text>
          </View>

          <Pressable onPress={finishTimeup}>
            <LinearGradient
              colors={['#0745E7', '#0C1573']}
              start={{x: 0.12, y: 0}}
              end={{x: 0.9, y: 1}}
              style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>
                {turnIndex === 0
                  ? `${roleMeta[comedians[1].role].label}'s Turn →`
                  : 'Start Jury Votes →'}
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </Background>
    );
  }

  if (screen === 'vote') {
    return (
      <Background>
        <View style={styles.voteContainer}>
          <View style={styles.voteTitleRow}>
            <Text style={styles.title}>🗳 Jury Votes!</Text>
            <View style={styles.voteTimer}>
              <Text style={styles.voteTimerText}>{timer}</Text>
            </View>
          </View>
          <Text style={styles.subtitle}>
            Tap the card for who made you laugh more!
          </Text>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.voteProgressFill,
                {width: `${Math.max(progress, 0) * 100}%`},
              ]}
            />
          </View>

          {comedians.map((comedian, index) => {
            const meta = roleMeta[comedian.role];

            return (
              <Pressable key={comedian.role} onPress={() => addVote(index)}>
                <LinearGradient
                  colors={
                    comedian.role === 'officer'
                      ? ['#0745E733', 'rgba(12,21,115,0.3)']
                      : ['rgba(126,34,206,0.35)', 'rgba(26,5,53,0.4)']
                  }
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={styles.voteCard}>
                  <View style={styles.voteCardInner}>
                    <Image source={meta.turnImage} style={styles.voteImage} />

                    <Text style={styles.voteName}>{comedian.name}</Text>
                    <Text style={styles.voteRole}>{meta.label}</Text>
                    <View style={styles.votePill}>
                      <Text style={styles.votePillScore}>{votes[index]}</Text>
                      <Text style={styles.votePillText}> votes</Text>
                    </View>
                  </View>
                </LinearGradient>
                {index === 0 && (
                  <View style={styles.vsRow}>
                    <View style={styles.vsLine} />
                    <Text style={styles.vsText}>VS</Text>
                    <View style={styles.vsLine} />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </Background>
    );
  }

  return (
    <Background>
      <View style={styles.resultContainer}>
        <Text style={styles.verdictTitle}>⚖️ The Verdict</Text>
        <Text style={styles.subtitleCenter}>Court is adjourned</Text>

        <LinearGradient
          colors={['#0745E733', 'rgba(12,21,115,0.3)']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.championCard}>
          <View style={styles.championCardInner}>
            <View style={styles.championAvatar}>
              <Image
                source={roleMeta[champion.role].image}
                style={styles.championImage}
              />
            </View>
            <View style={styles.championBadge}>
              <Text style={styles.championBadgeText}>🏆 CHAMPION</Text>
            </View>
            <Text style={styles.championName}>{champion.name}</Text>
            <Text style={styles.championText}>
              {champion.role === 'officer'
                ? 'Justice prevails! The robber goes to jail 🔒'
                : 'Comedy escapes! The robber slips away victorious 🗝'}
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.scoreCard}>
          <Text style={styles.yellowLabel}>FINAL SCORE</Text>
          {comedians.map((comedian, index) => {
            const maxVotes = Math.max(...votes, 1);
            const width = `${(votes[index] / maxVotes) * 100}%` as `${number}%`;

            return (
              <View key={comedian.role} style={styles.scoreRow}>
                <View style={styles.scoreNameRow}>
                  <Text style={styles.scoreName}>
                    {roleMeta[comedian.role].emoji} {comedian.name}
                  </Text>
                  <Text
                    style={[
                      styles.scoreValue,
                      comedian.role === 'robber' && styles.robberScoreValue,
                    ]}>
                    {votes[index]}
                  </Text>
                </View>
                <View style={styles.scoreTrack}>
                  <View
                    style={[
                      styles.scoreFill,
                      comedian.role === 'robber' && styles.robberScoreFill,
                      {width},
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.resultActions}>
          <Pressable style={styles.resultAction} onPress={shareResult}>
            <LinearGradient
              colors={['#0745E7', '#0C1573']}
              start={{x: 0.12, y: 0}}
              end={{x: 0.9, y: 1}}
              style={styles.resultActionGradient}>
              <Image source={images.shareIcon} />
              <Text style={styles.primaryButtonText}>Share</Text>
            </LinearGradient>
          </Pressable>
          <Pressable style={styles.resultAction} onPress={resetGame}>
            <View style={styles.backResultButton}>
              <Text style={styles.primaryButtonText}>Back</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </Background>
  );
};

export default GameScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 62,
    paddingBottom: 106,
  },
  introContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 88,
    paddingBottom: 106,
  },
  introImage: {
    resizeMode: 'contain',
  },
  introTitle: {
    marginTop: 24,
    color: '#FFE96A',
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '800',
    textAlign: 'center',
  },
  introSubtitle: {
    marginTop: 10,
    color: '#FFD700',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.55)',
    fontSize: 15,
    lineHeight: 22,
  },
  subtitleCenter: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.55)',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  yellowLabel: {
    marginTop: 14,
    color: '#FFD700',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  howCard: {
    alignSelf: 'stretch',
    marginTop: 31.3,
    borderWidth: 1,
    borderColor: 'rgba(127,168,255,0.25)',
    borderRadius: 16,
  },
  cardInner: {
    padding: 20,
  },
  fullWidth: {
    width: '100%',
  },
  howRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  howIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    marginRight: 14,
    borderRadius: 16,
    backgroundColor: '#0745E766',
  },
  howIconText: {
    fontSize: 17,
    lineHeight: 21,
  },
  howText: {
    flex: 1,
    color: 'rgba(255,255,255,0.76)',
    fontSize: 15,
    lineHeight: 22,
  },
  primaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'row',

    gap: 10,
    height: 58,
    marginTop: 26,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
    borderRadius: 16,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  disabledText: {
    color: 'rgba(255,255,255,0.35)',
  },
  setupCard: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: 'rgba(127,168,255,0.25)',
    borderRadius: 14,
  },
  comedianTwoCard: {
    borderColor: 'rgba(217,70,239,0.35)',
  },
  nameInput: {
    height: 44,
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 22,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.16)',
    padding: 0,
  },
  chooseText: {
    marginTop: 14,
    color: 'rgba(255,255,255,0.62)',
    fontSize: 13,
    lineHeight: 18,
  },
  roleRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  roleCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  selectedRoleCard: {
    borderColor: '#3B82F6',
    backgroundColor: '#0745E766',
  },
  roleAvatar: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    overflow: 'hidden',
    borderRadius: 22,
    backgroundColor: 'rgba(127,168,255,0.28)',
  },
  roleAvatarImage: {
    width: 28,
    height: 46,
    top: 5,
    resizeMode: 'contain',
  },
  roleName: {
    marginTop: 6,
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900',
  },
  assignedRole: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    padding: 14,
    gap: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(126,34,206,0.32)',
  },
  assignedText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    lineHeight: 16,
  },
  comediansPreview: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.32)',
    borderRadius: 14,
  },
  comediansPreviewInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    padding: 14,
  },
  previewComedian: {
    alignItems: 'center',
  },
  previewAvatarOfficer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 43,
    height: 43,
    overflow: 'hidden',
    borderRadius: 100,
    backgroundColor: '#7FA8FF40',
  },
  previewAvatarRobber: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 43,
    height: 43,
    overflow: 'hidden',
    borderRadius: 100,
    backgroundColor: '#C084FC33',
  },
  previewImage: {
    width: 40,
    height: 44,
    top: 2,
    resizeMode: 'contain',
  },
  previewName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  scaleIcon: {
    color: 'rgba(255,255,255,0.52)',
    fontSize: 26,
  },
  setupStart: {
    marginTop: -4,
  },
  readyContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 90,
    paddingBottom: 106,
  },
  readyImage: {
    width: 170,
    height: 220,
    resizeMode: 'contain',
  },
  readyTitle: {
    marginTop: 28,
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700',
    textAlign: 'center',
  },
  readySubtitle: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  readySubtitleOfficer: {
    color: '#7FA8FF',
  },
  readySubtitleRobber: {
    color: '#D8B4FE',
  },
  readyText: {
    marginTop: 10,
    color: 'rgba(255,255,255,0.48)',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  tipBox: {
    marginTop: 34,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  tipText: {
    color: 'rgba(255,255,255,0.58)',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  playContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 106,
  },
  playHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  comedianHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  comedianHeaderEmoji: {
    marginRight: 10,
    fontSize: 22,
  },
  playName: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '900',
  },
  playCount: {
    color: '#7FA8FF',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
  },
  timerCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 56,
    borderWidth: 1,
    borderColor: '#22C55E',
    backgroundColor: '#4ADE8020',
    borderRadius: 28,
  },
  timerText: {
    color: '#4ADE80',
    fontSize: 22,
    fontWeight: '900',
  },
  timerDone: {
    borderColor: '#FB7185',
    backgroundColor: '#F8717120',
  },
  timerDoneText: {
    color: '#FB7185',
    fontSize: 22,
    fontWeight: '900',
  },
  progressTrack: {
    height: 6,
    marginTop: 18,
    overflow: 'hidden',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#4ADE80',
  },
  progressDone: {
    width: '0%',
    backgroundColor: '#FB7185',
  },
  jokeCard: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 178,
    marginTop: 170,
    borderWidth: 1,
    borderColor: 'rgba(127,168,255,0.25)',
    borderRadius: 20,
  },
  currentJoke: {
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 31,
    textAlign: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  dot: {
    width: 5,
    height: 5,
    marginHorizontal: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  activeDot: {
    width: 16,
    backgroundColor: '#7FA8FF',
  },
  playActions: {
    flexDirection: 'row',
    marginTop: 118,
  },
  backSmallButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 56,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  backSmallText: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 32,
    lineHeight: 35,
  },
  nextJokeButton: {
    flex: 1,
  },
  nextJokeGradient: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
    borderRadius: 14,
  },
  timeupContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 106,
  },
  alarmWrap: {
    alignItems: 'center',
    marginTop: 210,
    marginBottom: 34,
  },
  alarmEmoji: {
    fontSize: 70,
    lineHeight: 78,
  },
  timeupTitle: {
    marginTop: 10,
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '900',
  },
  timeupText: {
    marginTop: 12,
    color: 'rgba(255,255,255,0.55)',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  voteContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 58,
    paddingBottom: 106,
  },
  voteTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  voteTimer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 58,
    height: 58,
    borderWidth: 1,
    borderColor: '#22C55E',
    borderRadius: 29,
  },
  voteTimerText: {
    color: '#4ADE80',
    fontSize: 22,
    fontWeight: '900',
  },
  voteProgressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#4ADE80',
  },
  voteCard: {
    alignItems: 'center',
    minHeight: 358,
    marginTop: 36,

    borderWidth: 1,
    borderColor: 'rgba(127,168,255,0.25)',
    borderRadius: 20,
  },
  voteCardInner: {
    alignItems: 'center',
    padding: 10,
  },
  voteImage: {
    width: 160,
    height: 190,
    resizeMode: 'contain',
  },
  voteName: {
    marginTop: 6,
    color: '#FFFFFF',
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '900',
  },
  voteRole: {
    marginTop: 4,
    color: '#AFC6FF',
    fontSize: 15,
    lineHeight: 22,
  },
  votePill: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(127,168,255,0.3)',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  votePillScore: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
  },
  votePillText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },
  vsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 26,
  },
  vsLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,215,0,0.25)',
  },
  vsText: {
    marginHorizontal: 14,
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '900',
  },
  resultContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 106,
  },
  verdictTitle: {
    color: '#FFE96A',
    fontSize: 28,
    lineHeight: 38,
    fontWeight: '700',
    textAlign: 'center',
  },
  championCard: {
    alignItems: 'center',
    marginTop: 26,

    borderWidth: 1,
    borderColor: 'rgba(127,168,255,0.3)',
    borderRadius: 20,
  },
  championCardInner: {
    alignItems: 'center',
    padding: 20,
  },
  championAvatar: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 74,
    height: 74,
    overflow: 'hidden',
    borderRadius: 37,
    backgroundColor: 'rgba(127,168,255,0.25)',
  },
  championImage: {
    width: 50,
    height: 80,
    top: 8,
    resizeMode: 'contain',
  },
  championBadge: {
    marginTop: 14,
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.6)',
    borderRadius: 999,
    backgroundColor: 'rgba(255,215,0,0.14)',
  },
  championBadgeText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  championName: {
    marginTop: 14,
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
  },
  championText: {
    marginTop: 8,
    color: '#7FA8FF',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
  scoreCard: {
    marginTop: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(127,168,255,0.18)',
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  scoreRow: {
    marginTop: 18,
  },
  scoreNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  scoreValue: {
    color: '#AFC6FF',
    fontSize: 18,
    fontWeight: '600',
  },
  robberScoreValue: {
    color: '#D8B4FE',
  },
  scoreTrack: {
    height: 8,
    marginTop: 10,
    overflow: 'hidden',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  scoreFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#3B82F6',
  },
  robberScoreFill: {
    backgroundColor: '#A855F7',
  },
  resultActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  resultAction: {
    flex: 1,
  },
  resultActionGradient: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
    borderRadius: 14,
  },
  backResultButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    borderRadius: 14,
    backgroundColor: '#FFFFFF14',
  },
});
