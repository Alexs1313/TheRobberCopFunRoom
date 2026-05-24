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

import VerdictCanvas from '../components/VerdictCanvas';
import {hostGameJokes, guestGameJokes} from '../data/duelMicPunchlines';
import type {GameComedian, GameRole} from '../types/verdictModels';
import {shareText} from '../loungeKit/witBroadcast';
import {images} from '../assets/loungeVisuals';

type TrialPhase =
  | 'curtain'
  | 'roster'
  | 'spotlight'
  | 'mic'
  | 'bell'
  | 'ballot'
  | 'crown';

const duelSideManifest = {
  host: {
    label: 'Host',
    emoji: '⭐',
    image: images.stellarHero1,
    readyTitle: 'Host — Lead with Comedy!',
    timeupText: 'Great job, Host! Now let Slick Rico have a turn.',
    turnImage: images.hostTurn1,
  },
  guest: {
    label: 'Guest',
    emoji: '☄️',
    image: images.cometHero1,
    readyTitle: 'Guest — Surprise with Comedy!',
    timeupText: 'Great job, Guest! Now let Host Mike have a turn.',
    turnImage: images.guestTurn1,
  },
};

const DuelTrialArena = () => {
  const [trialPhase, setTrialPhase] = useState<TrialPhase>('curtain');
  const [rosterLeadName, setRosterLeadName] = useState('');
  const [rosterRivalName, setRosterRivalName] = useState('');
  const [rosterLeadRole, setRosterLeadRole] = useState<GameRole>('host');
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [punchlineIndex, setPunchlineIndex] = useState(0);
  const [timer, setTimer] = useState(30);
  const [ballotTallies, setBallotTallies] = useState([0, 0]);

  const duelRoster = useMemo<GameComedian[]>(() => {
    const comedianTwoRole: GameRole =
      rosterLeadRole === 'host' ? 'guest' : 'host';

    return [
      {name: rosterLeadName.trim() || 'Comedian 1', role: rosterLeadRole},
      {name: rosterRivalName.trim() || 'Comedian 2', role: comedianTwoRole},
    ];
  }, [rosterLeadName, rosterLeadRole, rosterRivalName]);

  const spotlightComedian = duelRoster[spotlightIndex];
  const spotlightPunchlines =
    spotlightComedian.role === 'host' ? hostGameJokes : guestGameJokes;
  const rosterReady =
    rosterLeadName.trim().length > 0 && rosterRivalName.trim().length > 0;
  const phaseProgress = trialPhase === 'ballot' ? timer / 20 : timer / 30;
  const crownIndex =
    ballotTallies[0] === ballotTallies[1]
      ? 0
      : ballotTallies[0] > ballotTallies[1]
      ? 0
      : 1;
  const crownComedian = duelRoster[crownIndex];

  useEffect(() => {
    if (trialPhase !== 'mic' && trialPhase !== 'ballot') {
      return;
    }

    const interval = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          setTrialPhase(trialPhase === 'mic' ? 'bell' : 'crown');
          return 0;
        }

        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [trialPhase]);

  const openDuel = () => {
    if (!rosterReady) {
      return;
    }

    setSpotlightIndex(0);
    setPunchlineIndex(0);
    setTimer(30);
    setBallotTallies([0, 0]);
    setTrialPhase('spotlight');
  };

  const raiseCurtain = () => {
    setPunchlineIndex(0);
    setTimer(30);
    setTrialPhase('mic');
  };

  const ringBell = () => {
    if (spotlightIndex === 0) {
      setSpotlightIndex(1);
      setPunchlineIndex(0);
      setTimer(30);
      setTrialPhase('spotlight');
      return;
    }

    setTimer(20);
    setTrialPhase('ballot');
  };

  const castBallot = (index: number) => {
    setBallotTallies(prevVotes => {
      const nextVotes = [...prevVotes];
      nextVotes[index] += 1;
      return nextVotes;
    });
  };

  const broadcastVerdict = async () => {
    shareText(
      'The Comedy Trial Verdict',
      `🏆 Champion: ${crownComedian.name}\n\nFinal score:\n${duelRoster[0].name}: ${ballotTallies[0]}\n${duelRoster[1].name}: ${ballotTallies[1]}`,
    );
  };

  const resetDuel = () => {
    setTrialPhase('curtain');
    setSpotlightIndex(0);
    setPunchlineIndex(0);
    setTimer(30);
    setBallotTallies([0, 0]);
  };

  if (trialPhase === 'curtain') {
    return (
      <VerdictCanvas>
        <View style={duelTrialSheet.curtainArena}>
          <Image
            source={images.comedyIntro}
            style={duelTrialSheet.curtainArt}
          />
          <Text style={duelTrialSheet.curtainGavel}>The Comedy Trial</Text>
          <Text style={duelTrialSheet.curtainWhisper}>2-side Showdown</Text>

          <LinearGradient
            colors={['#0745E733', 'rgba(12,21,115,0.3)']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={duelTrialSheet.rulesPanel}>
            <View style={duelTrialSheet.panelPad}>
              <Text style={duelTrialSheet.goldStamp}>HOW IT WORKS</Text>
              {[
                ['⭐', 'Officer Mike tries to SENTENCE the thief'],
                ['☄️', 'Slick Rico tries to ESCAPE justice'],
                ['🎤', 'Each side gets 30 seconds to tell jokes'],
                ['👥', 'The crowd votes on who was funniest'],
                ['⚖️', 'The jury decides the verdict!'],
              ].map(([icon, text]) => (
                <View key={text} style={duelTrialSheet.rulesRow}>
                  <View style={duelTrialSheet.rulesSigil}>
                    <Text style={duelTrialSheet.rulesSigilGlyph}>{icon}</Text>
                  </View>
                  <Text style={duelTrialSheet.rulesCopy}>{text}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>

          <Pressable
            onPress={() => setTrialPhase('roster')}
            style={duelTrialSheet.spanStretch}>
            <LinearGradient
              colors={['#0745E7', '#0C1573']}
              start={{x: 0.12, y: 0}}
              end={{x: 0.9, y: 1}}
              style={duelTrialSheet.verdictCta}>
              <Image source={images.buttonIcon} />
              <Text style={duelTrialSheet.verdictCtaCopy}>Pick Your Side</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </VerdictCanvas>
    );
  }

  if (trialPhase === 'roster') {
    const comedianTwoRole = duelRoster[1].role;

    return (
      <VerdictCanvas>
        <View style={duelTrialSheet.trialArena}>
          <Text style={duelTrialSheet.phaseGavel}>Set Up Sides</Text>
          <Text style={duelTrialSheet.phaseWhisper}>
            Enter names and choose sides
          </Text>

          <Text style={duelTrialSheet.goldStamp}>SIDE 1</Text>
          <LinearGradient
            colors={['#0745E733', 'rgba(12,21,115,0.3)']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={duelTrialSheet.rosterPanel}>
            <View style={duelTrialSheet.panelPad}>
              <TextInput
                value={rosterLeadName}
                onChangeText={setRosterLeadName}
                placeholder="Enter name..."
                placeholderTextColor="rgba(255,255,255,0.45)"
                style={duelTrialSheet.rosterNameField}
              />
              <Text style={duelTrialSheet.rosterPickHint}>Choose role:</Text>
              <View style={duelTrialSheet.rosterRoleRail}>
                {(['host', 'guest'] as GameRole[]).map(role => {
                  const selected = rosterLeadRole === role;

                  return (
                    <Pressable
                      key={role}
                      style={[
                        duelTrialSheet.rosterRoleTile,
                        selected && duelTrialSheet.rosterRoleTileLit,
                      ]}
                      onPress={() => setRosterLeadRole(role)}>
                      <View style={duelTrialSheet.rosterRoleSeal}>
                        <Image
                          source={duelSideManifest[role].image}
                          style={duelTrialSheet.rosterRolePortrait}
                        />
                      </View>
                      <Text style={duelTrialSheet.rosterRoleTag}>
                        {duelSideManifest[role].label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </LinearGradient>

          <Text style={duelTrialSheet.goldStamp}>SIDE 2</Text>
          <LinearGradient
            colors={['rgba(126,34,206,0.35)', 'rgba(26,5,53,0.4)']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={[duelTrialSheet.rosterPanel, duelTrialSheet.rosterPanelAlt]}>
            <View style={duelTrialSheet.panelPad}>
              <TextInput
                value={rosterRivalName}
                onChangeText={setRosterRivalName}
                placeholder="Enter name..."
                placeholderTextColor="rgba(255,255,255,0.45)"
                style={duelTrialSheet.rosterNameField}
              />
              <View style={duelTrialSheet.rosterAssigned}>
                <View style={duelTrialSheet.rosterRoleSeal}>
                  <Image
                    source={duelSideManifest[comedianTwoRole].image}
                    style={duelTrialSheet.rosterRolePortrait}
                  />
                </View>
                <View>
                  <Text style={duelTrialSheet.rosterRoleTag}>
                    {duelSideManifest[comedianTwoRole].label}
                  </Text>
                  <Text style={duelTrialSheet.rosterAssignedHint}>
                    Assigned automatically
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>

          {rosterReady && (
            <LinearGradient
              colors={['rgba(255,255,255,0.1)', 'rgba(255,215,0,0.08)']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={duelTrialSheet.rosterPreview}>
              <View style={duelTrialSheet.rosterPreviewPad}>
                <View style={duelTrialSheet.rosterPreviewSide}>
                  <View style={duelTrialSheet.rosterPreviewHostSeal}>
                    <Image
                      source={duelSideManifest[duelRoster[0].role].image}
                      style={duelTrialSheet.rosterPreviewPortrait}
                    />
                  </View>
                  <Text style={duelTrialSheet.rosterPreviewName}>
                    {duelRoster[0].name}
                  </Text>
                </View>
                <Text style={duelTrialSheet.rosterScaleGlyph}>⚖️</Text>
                <View style={duelTrialSheet.rosterPreviewSide}>
                  <View style={duelTrialSheet.rosterPreviewGuestSeal}>
                    <Image
                      source={duelSideManifest[duelRoster[1].role].image}
                      style={duelTrialSheet.rosterPreviewPortrait}
                    />
                  </View>
                  <Text style={duelTrialSheet.rosterPreviewName}>
                    {duelRoster[1].name}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          )}

          <Pressable
            disabled={!rosterReady}
            onPress={openDuel}
            style={duelTrialSheet.rosterLaunch}>
            <LinearGradient
              colors={
                rosterReady
                  ? ['#0745E7', '#0C1573']
                  : ['rgba(255,255,255,0.11)', 'rgba(255,255,255,0.08)']
              }
              start={{x: 0.12, y: 0}}
              end={{x: 0.9, y: 1}}
              style={duelTrialSheet.verdictCta}>
              <Text
                style={[
                  duelTrialSheet.verdictCtaCopy,
                  !rosterReady && duelTrialSheet.verdictCtaMuted,
                ]}>
                🏛 Start the Trial!
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </VerdictCanvas>
    );
  }

  if (trialPhase === 'spotlight') {
    const meta = duelSideManifest[spotlightComedian.role];

    return (
      <VerdictCanvas>
        <View style={duelTrialSheet.spotlightArena}>
          <Image source={meta.turnImage} style={duelTrialSheet.spotlightArt} />
          <Text style={duelTrialSheet.spotlightGavel}>
            {spotlightComedian.name}'s Turn!
          </Text>
          <Text
            style={[
              duelTrialSheet.spotlightWhisper,
              spotlightComedian.role === 'host'
                ? duelTrialSheet.spotlightWhisperHost
                : duelTrialSheet.spotlightWhisperGuest,
            ]}>
            {meta.readyTitle}
          </Text>
          <Text style={duelTrialSheet.spotlightHint}>
            You'll have 30 seconds to read jokes. Pass the phone to{' '}
            {spotlightComedian.name}!
          </Text>
          <View style={duelTrialSheet.spotlightTip}>
            <Text style={duelTrialSheet.spotlightTipCopy}>
              📖 Read jokes aloud to the group • Swipe through with Next • You
              can skip any joke
            </Text>
          </View>
          <Pressable onPress={raiseCurtain} style={duelTrialSheet.spanStretch}>
            <LinearGradient
              colors={
                spotlightComedian.role === 'host'
                  ? ['#0745E7', '#0C1573']
                  : ['#A855F7', '#581C87']
              }
              start={{x: 0.12, y: 0}}
              end={{x: 0.9, y: 1}}
              style={duelTrialSheet.verdictCta}>
              <Text style={duelTrialSheet.verdictCtaCopy}>
                I'm Ready — Start! ⏱
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </VerdictCanvas>
    );
  }

  if (trialPhase === 'mic') {
    return (
      <VerdictCanvas>
        <View style={duelTrialSheet.micArena}>
          <View style={duelTrialSheet.micCrest}>
            <View style={duelTrialSheet.micComedianCrest}>
              <Text style={duelTrialSheet.micComedianEmoji}>
                {duelSideManifest[spotlightComedian.role].emoji}
              </Text>
              <View>
                <Text style={duelTrialSheet.micComedianName}>
                  {spotlightComedian.name}
                </Text>
                <Text style={duelTrialSheet.micPunchlineTally}>
                  {punchlineIndex + 1} of {spotlightPunchlines.length}
                </Text>
              </View>
            </View>
            <View style={duelTrialSheet.micTimerRing}>
              <Text style={duelTrialSheet.micTimerGlyph}>{timer}</Text>
            </View>
          </View>
          <View style={duelTrialSheet.micProgressRail}>
            <View
              style={[
                duelTrialSheet.micProgressFill,
                {width: `${Math.max(phaseProgress, 0) * 100}%`},
              ]}
            />
          </View>

          <LinearGradient
            colors={['#0745E733', 'rgba(12,21,115,0.3)']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={duelTrialSheet.micPunchlinePanel}>
            <View style={duelTrialSheet.panelPad}>
              <Text style={duelTrialSheet.micPunchlineCopy}>
                {spotlightPunchlines[punchlineIndex]}
              </Text>
            </View>
          </LinearGradient>

          <View style={duelTrialSheet.micPunchlineDots}>
            {spotlightPunchlines.map((_, index) => (
              <View
                key={index}
                style={[
                  duelTrialSheet.micPunchlineDot,
                  index === punchlineIndex && duelTrialSheet.micPunchlineDotLit,
                ]}
              />
            ))}
          </View>

          <View style={duelTrialSheet.micPunchlineActions}>
            <Pressable
              style={duelTrialSheet.micRetreatSigil}
              onPress={() =>
                setPunchlineIndex(prevIndex => Math.max(prevIndex - 1, 0))
              }>
              <Image source={images.backArrowWide} />
            </Pressable>
            <Pressable
              style={duelTrialSheet.micAdvanceCta}
              onPress={() =>
                setPunchlineIndex(prevIndex =>
                  Math.min(prevIndex + 1, spotlightPunchlines.length - 1),
                )
              }>
              <LinearGradient
                colors={['#0745E766', '#0745E766']}
                start={{x: 0.12, y: 0}}
                end={{x: 0.9, y: 1}}
                style={duelTrialSheet.micAdvanceCtaFill}>
                <Text style={duelTrialSheet.verdictCtaCopy}>Next Joke</Text>
                <Image source={images.arrowRight} />
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </VerdictCanvas>
    );
  }

  if (trialPhase === 'bell') {
    return (
      <VerdictCanvas>
        <View style={duelTrialSheet.bellArena}>
          <View style={duelTrialSheet.micCrest}>
            <View style={duelTrialSheet.micComedianCrest}>
              <Text style={duelTrialSheet.micComedianEmoji}>
                {duelSideManifest[spotlightComedian.role].emoji}
              </Text>
              <View>
                <Text style={duelTrialSheet.micComedianName}>
                  {spotlightComedian.name}
                </Text>
                <Text style={duelTrialSheet.micPunchlineTally}>
                  {spotlightPunchlines.length} of {spotlightPunchlines.length}
                </Text>
              </View>
            </View>
            <View
              style={[
                duelTrialSheet.micTimerRing,
                duelTrialSheet.micTimerRingDone,
              ]}>
              <Text style={duelTrialSheet.micTimerGlyphDone}>0</Text>
            </View>
          </View>
          <View style={duelTrialSheet.micProgressRail}>
            <View
              style={[
                duelTrialSheet.micProgressFill,
                duelTrialSheet.micProgressEmpty,
              ]}
            />
          </View>

          <View style={duelTrialSheet.bellAlarm}>
            <Text style={duelTrialSheet.bellAlarmGlyph}>⏰</Text>
            <Text style={duelTrialSheet.bellGavel}>Time's Up!</Text>
            <Text style={duelTrialSheet.bellWhisper}>
              {duelSideManifest[spotlightComedian.role].timeupText}
            </Text>
          </View>

          <Pressable onPress={ringBell}>
            <LinearGradient
              colors={['#0745E7', '#0C1573']}
              start={{x: 0.12, y: 0}}
              end={{x: 0.9, y: 1}}
              style={duelTrialSheet.verdictCta}>
              <Text style={duelTrialSheet.verdictCtaCopy}>
                {spotlightIndex === 0
                  ? `${duelSideManifest[duelRoster[1].role].label}'s Turn →`
                  : 'Start Jury Votes →'}
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </VerdictCanvas>
    );
  }

  if (trialPhase === 'ballot') {
    return (
      <VerdictCanvas>
        <View style={duelTrialSheet.ballotArena}>
          <View style={duelTrialSheet.ballotCrest}>
            <Text style={duelTrialSheet.phaseGavel}>🗳 Jury Votes!</Text>
            <View style={duelTrialSheet.ballotTimerRing}>
              <Text style={duelTrialSheet.ballotTimerGlyph}>{timer}</Text>
            </View>
          </View>
          <Text style={duelTrialSheet.phaseWhisper}>
            Tap the card for who made you laugh more!
          </Text>
          <View style={duelTrialSheet.micProgressRail}>
            <View
              style={[
                duelTrialSheet.ballotProgressFill,
                {width: `${Math.max(phaseProgress, 0) * 100}%`},
              ]}
            />
          </View>

          {duelRoster.map((comedian, index) => {
            const meta = duelSideManifest[comedian.role];

            return (
              <Pressable key={comedian.role} onPress={() => castBallot(index)}>
                <LinearGradient
                  colors={
                    comedian.role === 'host'
                      ? ['#0745E733', 'rgba(12,21,115,0.3)']
                      : ['rgba(126,34,206,0.35)', 'rgba(26,5,53,0.4)']
                  }
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={duelTrialSheet.ballotSidePanel}>
                  <View style={duelTrialSheet.ballotSidePad}>
                    <Image
                      source={meta.turnImage}
                      style={duelTrialSheet.ballotSideArt}
                    />

                    <Text style={duelTrialSheet.ballotSideName}>
                      {comedian.name}
                    </Text>
                    <Text style={duelTrialSheet.ballotSideRole}>
                      {meta.label}
                    </Text>
                    <View style={duelTrialSheet.ballotTallyPill}>
                      <Text style={duelTrialSheet.ballotTallyScore}>
                        {ballotTallies[index]}
                      </Text>
                      <Text style={duelTrialSheet.ballotTallySuffix}>
                        {' '}
                        ballotTallies
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
                {index === 0 && (
                  <View style={duelTrialSheet.ballotVersus}>
                    <View style={duelTrialSheet.ballotVersusLine} />
                    <Text style={duelTrialSheet.ballotVersusGlyph}>VS</Text>
                    <View style={duelTrialSheet.ballotVersusLine} />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </VerdictCanvas>
    );
  }

  return (
    <VerdictCanvas>
      <View style={duelTrialSheet.crownArena}>
        <Text style={duelTrialSheet.crownGavel}>⚖️ The Verdict</Text>
        <Text style={duelTrialSheet.phaseWhisperCenter}>
          Court is adjourned
        </Text>

        <LinearGradient
          colors={['#0745E733', 'rgba(12,21,115,0.3)']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={duelTrialSheet.crownChampionPanel}>
          <View style={duelTrialSheet.crownChampionPad}>
            <View style={duelTrialSheet.crownChampionSeal}>
              <Image
                source={duelSideManifest[crownComedian.role].image}
                style={duelTrialSheet.crownChampionPortrait}
              />
            </View>
            <View style={duelTrialSheet.crownChampionRibbon}>
              <Text style={duelTrialSheet.crownChampionRibbonCopy}>
                🏆 CHAMPION
              </Text>
            </View>
            <Text style={duelTrialSheet.crownChampionName}>
              {crownComedian.name}
            </Text>
            <Text style={duelTrialSheet.crownChampionWhisper}>
              {crownComedian.role === 'host'
                ? 'The host takes the spotlight! Stellar side owns the night ⭐'
                : 'The guest steals the show! Comet side shines brightest ☄️'}
            </Text>
          </View>
        </LinearGradient>

        <View style={duelTrialSheet.crownScorePanel}>
          <Text style={duelTrialSheet.goldStamp}>FINAL SCORE</Text>
          {duelRoster.map((comedian, index) => {
            const maxVotes = Math.max(...ballotTallies, 1);
            const width = `${
              (ballotTallies[index] / maxVotes) * 100
            }%` as `${number}%`;

            return (
              <View key={comedian.role} style={duelTrialSheet.crownScoreRow}>
                <View style={duelTrialSheet.crownScoreNameRail}>
                  <Text style={duelTrialSheet.crownScoreName}>
                    {duelSideManifest[comedian.role].emoji} {comedian.name}
                  </Text>
                  <Text
                    style={[
                      duelTrialSheet.crownScoreValue,
                      comedian.role === 'guest' &&
                        duelTrialSheet.crownGuestScoreValue,
                    ]}>
                    {ballotTallies[index]}
                  </Text>
                </View>
                <View style={duelTrialSheet.crownScoreRail}>
                  <View
                    style={[
                      duelTrialSheet.crownScoreFill,
                      comedian.role === 'guest' &&
                        duelTrialSheet.crownGuestScoreFill,
                      {width},
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>

        <View style={duelTrialSheet.crownActionRail}>
          <Pressable
            style={duelTrialSheet.crownActionSlot}
            onPress={broadcastVerdict}>
            <LinearGradient
              colors={['#0745E7', '#0C1573']}
              start={{x: 0.12, y: 0}}
              end={{x: 0.9, y: 1}}
              style={duelTrialSheet.crownActionCtaFill}>
              <Image source={images.shareIcon} />
              <Text style={duelTrialSheet.verdictCtaCopy}>Share</Text>
            </LinearGradient>
          </Pressable>
          <Pressable style={duelTrialSheet.crownActionSlot} onPress={resetDuel}>
            <View style={duelTrialSheet.crownRetreatCta}>
              <Text style={duelTrialSheet.verdictCtaCopy}>Back</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </VerdictCanvas>
  );
};

export default DuelTrialArena;

const duelTrialSheet = StyleSheet.create({
  trialArena: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 62,
    paddingBottom: 106,
  },
  curtainArena: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 88,
    paddingBottom: 106,
  },
  curtainArt: {
    resizeMode: 'contain',
  },
  curtainGavel: {
    marginTop: 24,
    color: '#FFE96A',
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '800',
    textAlign: 'center',
  },
  curtainWhisper: {
    marginTop: 10,
    color: '#FFD700',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  phaseGavel: {
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '800',
  },
  phaseWhisper: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.55)',
    fontSize: 15,
    lineHeight: 22,
  },
  phaseWhisperCenter: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.55)',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  goldStamp: {
    marginTop: 14,
    color: '#FFD700',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  rulesPanel: {
    alignSelf: 'stretch',
    marginTop: 31.3,
    borderWidth: 1,
    borderColor: 'rgba(127,168,255,0.25)',
    borderRadius: 16,
  },
  panelPad: {
    padding: 20,
  },
  spanStretch: {
    width: '100%',
  },
  rulesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  rulesSigil: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    marginRight: 14,
    borderRadius: 16,
    backgroundColor: '#0745E766',
  },
  rulesSigilGlyph: {
    fontSize: 17,
    lineHeight: 21,
  },
  rulesCopy: {
    flex: 1,
    color: 'rgba(255,255,255,0.76)',
    fontSize: 15,
    lineHeight: 22,
  },
  verdictCta: {
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
  verdictCtaCopy: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  verdictCtaMuted: {
    color: 'rgba(255,255,255,0.35)',
  },
  rosterPanel: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: 'rgba(127,168,255,0.25)',
    borderRadius: 14,
  },
  rosterPanelAlt: {
    borderColor: 'rgba(217,70,239,0.35)',
  },
  rosterNameField: {
    height: 44,
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 22,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.16)',
    padding: 0,
  },
  rosterPickHint: {
    marginTop: 14,
    color: 'rgba(255,255,255,0.62)',
    fontSize: 13,
    lineHeight: 18,
  },
  rosterRoleRail: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  rosterRoleTile: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  rosterRoleTileLit: {
    borderColor: '#3B82F6',
    backgroundColor: '#0745E766',
  },
  rosterRoleSeal: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    overflow: 'hidden',
    borderRadius: 22,
    backgroundColor: 'rgba(127,168,255,0.28)',
  },
  rosterRolePortrait: {
    width: 28,
    height: 46,
    top: 5,
    resizeMode: 'contain',
  },
  rosterRoleTag: {
    marginTop: 6,
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900',
  },
  rosterAssigned: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    padding: 14,
    gap: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(126,34,206,0.32)',
  },
  rosterAssignedHint: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    lineHeight: 16,
  },
  rosterPreview: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.32)',
    borderRadius: 14,
  },
  rosterPreviewPad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    padding: 14,
  },
  rosterPreviewSide: {
    alignItems: 'center',
  },
  rosterPreviewHostSeal: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 43,
    height: 43,
    overflow: 'hidden',
    borderRadius: 100,
    backgroundColor: '#7FA8FF40',
  },
  rosterPreviewGuestSeal: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 43,
    height: 43,
    overflow: 'hidden',
    borderRadius: 100,
    backgroundColor: '#C084FC33',
  },
  rosterPreviewPortrait: {
    width: 40,
    height: 44,
    top: 2,
    resizeMode: 'contain',
  },
  rosterPreviewName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  rosterScaleGlyph: {
    color: 'rgba(255,255,255,0.52)',
    fontSize: 26,
  },
  rosterLaunch: {
    marginTop: -4,
  },
  spotlightArena: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 90,
    paddingBottom: 106,
  },
  spotlightArt: {
    width: 170,
    height: 220,
    resizeMode: 'contain',
  },
  spotlightGavel: {
    marginTop: 28,
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700',
    textAlign: 'center',
  },
  spotlightWhisper: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  spotlightWhisperHost: {
    color: '#7FA8FF',
  },
  spotlightWhisperGuest: {
    color: '#D8B4FE',
  },
  spotlightHint: {
    marginTop: 10,
    color: 'rgba(255,255,255,0.48)',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  spotlightTip: {
    marginTop: 34,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  spotlightTipCopy: {
    color: 'rgba(255,255,255,0.58)',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  micArena: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 106,
  },
  micCrest: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  micComedianCrest: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  micComedianEmoji: {
    marginRight: 10,
    fontSize: 22,
  },
  micComedianName: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '900',
  },
  micPunchlineTally: {
    color: '#7FA8FF',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
  },
  micTimerRing: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 56,
    borderWidth: 1,
    borderColor: '#22C55E',
    backgroundColor: '#4ADE8020',
    borderRadius: 28,
  },
  micTimerGlyph: {
    color: '#4ADE80',
    fontSize: 22,
    fontWeight: '900',
  },
  micTimerRingDone: {
    borderColor: '#FB7185',
    backgroundColor: '#F8717120',
  },
  micTimerGlyphDone: {
    color: '#FB7185',
    fontSize: 22,
    fontWeight: '900',
  },
  micProgressRail: {
    height: 6,
    marginTop: 18,
    overflow: 'hidden',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  micProgressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#4ADE80',
  },
  micProgressEmpty: {
    width: '0%',
    backgroundColor: '#FB7185',
  },
  micPunchlinePanel: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 178,
    marginTop: 170,
    borderWidth: 1,
    borderColor: 'rgba(127,168,255,0.25)',
    borderRadius: 20,
  },
  micPunchlineCopy: {
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 31,
    textAlign: 'center',
  },
  micPunchlineDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  micPunchlineDot: {
    width: 5,
    height: 5,
    marginHorizontal: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  micPunchlineDotLit: {
    width: 16,
    backgroundColor: '#7FA8FF',
  },
  micPunchlineActions: {
    flexDirection: 'row',
    marginTop: 118,
  },
  micRetreatSigil: {
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
  micAdvanceCta: {
    flex: 1,
  },
  micAdvanceCtaFill: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
    borderRadius: 14,
  },
  bellArena: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 106,
  },
  bellAlarm: {
    alignItems: 'center',
    marginTop: 210,
    marginBottom: 34,
  },
  bellAlarmGlyph: {
    fontSize: 70,
    lineHeight: 78,
  },
  bellGavel: {
    marginTop: 10,
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '900',
  },
  bellWhisper: {
    marginTop: 12,
    color: 'rgba(255,255,255,0.55)',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  ballotArena: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 58,
    paddingBottom: 106,
  },
  ballotCrest: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ballotTimerRing: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 58,
    height: 58,
    borderWidth: 1,
    borderColor: '#22C55E',
    borderRadius: 29,
  },
  ballotTimerGlyph: {
    color: '#4ADE80',
    fontSize: 22,
    fontWeight: '900',
  },
  ballotProgressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#4ADE80',
  },
  ballotSidePanel: {
    alignItems: 'center',
    minHeight: 358,
    marginTop: 36,

    borderWidth: 1,
    borderColor: 'rgba(127,168,255,0.25)',
    borderRadius: 20,
  },
  ballotSidePad: {
    alignItems: 'center',
    padding: 10,
  },
  ballotSideArt: {
    width: 160,
    height: 190,
    resizeMode: 'contain',
  },
  ballotSideName: {
    marginTop: 6,
    color: '#FFFFFF',
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '900',
  },
  ballotSideRole: {
    marginTop: 4,
    color: '#AFC6FF',
    fontSize: 15,
    lineHeight: 22,
  },
  ballotTallyPill: {
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
  ballotTallyScore: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
  },
  ballotTallySuffix: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },
  ballotVersus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 26,
  },
  ballotVersusLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,215,0,0.25)',
  },
  ballotVersusGlyph: {
    marginHorizontal: 14,
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '900',
  },
  crownArena: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 106,
  },
  crownGavel: {
    color: '#FFE96A',
    fontSize: 28,
    lineHeight: 38,
    fontWeight: '700',
    textAlign: 'center',
  },
  crownChampionPanel: {
    alignItems: 'center',
    marginTop: 26,

    borderWidth: 1,
    borderColor: 'rgba(127,168,255,0.3)',
    borderRadius: 20,
  },
  crownChampionPad: {
    alignItems: 'center',
    padding: 20,
  },
  crownChampionSeal: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 74,
    height: 74,
    overflow: 'hidden',
    borderRadius: 37,
    backgroundColor: 'rgba(127,168,255,0.25)',
  },
  crownChampionPortrait: {
    width: 50,
    height: 80,
    top: 8,
    resizeMode: 'contain',
  },
  crownChampionRibbon: {
    marginTop: 14,
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.6)',
    borderRadius: 999,
    backgroundColor: 'rgba(255,215,0,0.14)',
  },
  crownChampionRibbonCopy: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  crownChampionName: {
    marginTop: 14,
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
  },
  crownChampionWhisper: {
    marginTop: 8,
    color: '#7FA8FF',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
  crownScorePanel: {
    marginTop: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(127,168,255,0.18)',
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  crownScoreRow: {
    marginTop: 18,
  },
  crownScoreNameRail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  crownScoreName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  crownScoreValue: {
    color: '#AFC6FF',
    fontSize: 18,
    fontWeight: '600',
  },
  crownGuestScoreValue: {
    color: '#D8B4FE',
  },
  crownScoreRail: {
    height: 8,
    marginTop: 10,
    overflow: 'hidden',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  crownScoreFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#3B82F6',
  },
  crownGuestScoreFill: {
    backgroundColor: '#A855F7',
  },
  crownActionRail: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  crownActionSlot: {
    flex: 1,
  },
  crownActionCtaFill: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
    borderRadius: 14,
  },
  crownRetreatCta: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    borderRadius: 14,
    backgroundColor: '#FFFFFF14',
  },
});
