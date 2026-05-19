import type {Joke} from '../types/content';

export const policeJokes = [
  'I stopped a robber yesterday... mostly because he asked me where the bank was.',
  'My police dog is terrible at catching criminals. Every time he sees a robber, he rolls over for belly rubs.',
  'A robber tried to escape on a scooter. Honestly, the chase looked more adorable than dangerous.',
  'I arrested a guy for stealing batteries. I charged him immediately.',
  'The robber said he was innocent. Meanwhile, he still had the cash register in his backpack.',
  'Someone asked why police officers love donuts. Easy - they fit perfectly in the cup holder.',
  'A robber hid inside a bakery. We found him because he left flour footprints everywhere.',
  'I told the criminal to freeze. He asked if room temperature was okay.',
  'The suspect ran into a gym during the chase. Worst mistake ever - now he does cardio daily in prison.',
  'A robber tried to bribe me with pizza. I almost accepted... until I saw pineapple on it.',
];

export const robberJokes = [
  'I tried robbing a bank once, but the loan manager offered me a job instead.',
  'The police said I was surrounded. Nice of them to support my social life.',
  'I wore a mask during the robbery and someone still tagged me on social media.',
  'My escape plan was perfect until I forgot where I parked the getaway car.',
  'I stole a calendar yesterday. I got twelve months.',
  'The cop asked why I robbed the bakery. I told him I needed the dough.',
  'I tried hiding from the police in a clown costume. Unfortunately, I was still the least funny person there.',
  'The officer said I had the right to remain silent. That was hard because I really wanted to explain my genius plan.',
  'I robbed a gym once. Turns out carrying all that equipment is actual exercise.',
  'The police caught me because I stopped for coffee during the chase. Priorities matter.',
];

export const jokes: Joke[] = [
  ...policeJokes.map((text, index) => ({
    id: `police-${index}`,
    side: 'police' as const,
    text,
  })),
  ...robberJokes.map((text, index) => ({
    id: `robber-${index}`,
    side: 'robber' as const,
    text,
  })),
];
