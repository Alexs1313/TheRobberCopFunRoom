import type {Joke} from '../types/verdictModels';

export const stellarJokes = [
  'I brought a gavel to open mic night. The crowd said I was already guilty of good timing.',
  'My calendar is full of court dates — comedy court dates, thankfully.',
  'A heckler told me to sit down. I said the bench was reserved for punchlines.',
  'I tried to order silence in the room. The waiter brought croutons instead.',
  'My opening joke was so clean the janitor asked for royalties.',
  'I rehearsed in front of a mirror. It laughed, then billed me for overtime.',
  'The spotlight followed me home. Now it helps me find my keys.',
  'I told a joke about paperwork. The audience filed it under “loud.”',
  'My mic stand wobbled. I called it a suspense subplot.',
  'I ended the set with a bow. The curtain took it personally.',
];

export const cometJokes = [
  'I entered the stage backward for dramatic effect. Tripped into a standing ovation.',
  'My punchlines travel faster than my wifi — barely.',
  'I wore sunglasses indoors. The room assumed I was famous or lost.',
  'I asked for a drumroll. Someone rolled an actual bagel across the floor.',
  'My timing is so sharp it once cut through a awkward pause.',
  'I told a joke about elevators. It had ups and downs.',
  'The crowd said I was unpredictable. I thanked my alarm clock.',
  'I brought props. The prop was confidence. It left early.',
  'I whispered the punchline. The back row filed a noise complaint.',
  'I bowed so low I found a spare joke under the stage.',
];

export const jokes: Joke[] = [
  ...stellarJokes.map((text, index) => ({
    id: `stellar-${index}`,
    side: 'stellar' as const,
    text,
  })),
  ...cometJokes.map((text, index) => ({
    id: `comet-${index}`,
    side: 'comet' as const,
    text,
  })),
];
