const DailyPrompts = () => {
  const dailyPrompts = [
    {
      day: 1,
      dailyPrompt:
        "Write a 150 word story in the comedy genre. It's about a philosopher and should include a football. Also use the sentence 'Is anyone there?' Bonus prompt: The story involves a fight.",
    },
    {
      day: 2,
      dailyPrompt:
        "Write a 350 word story in the drama genre. It's about an art director and should include a crown. Also use the sentence 'It's too warm.' Bonus prompt: There is a great storm.",
    },
    {
      day: 3,
      dailyPrompt:
        "Write a 300 word story in the military genre. It's about an emperor and should include a steam boat. Also use the sentence 'Whoopsidaisies!' Bonus prompt: Your character is hated by everyone.",
    },
    {
      day: 4,
      dailyPrompt:
        "Write a 100 word story in the adventure genre. It's about a dog breeder and should include a certificate. Also use the sentence 'He can change.' Bonus prompt: Your character is loved by everyone.",
    },
    {
      day: 5,
      dailyPrompt:
        "Write a 400 word story in the military genre. It's about a cowardly fireman and should include a piece of paper. Also use the sentence 'I love you.' Bonus prompt: Your character is hated by everyone.",
    },
    {
      day: 6,
      dailyPrompt:
        "Write a 150 word story in the science fiction genre. It's about a hot-shot ceo and should include coloring pencils. Also use the sentence 'Don't trust everything you see.' Bonus prompt: The Sun is failing.",
    },
    {
      day: 7,
      dailyPrompt:
        "Write a 100 word story in the military genre. It's about a pilot and should include a time machine. Also use the sentence 'Not for you.' Bonus prompt: The story takes place in a desert.",
    },
    {
      day: 8,
      dailyPrompt:
        "Write a 700 word story in the children genre. It's about a fat baker and should include a milkshake. Also use the sentence 'Run!' Bonus prompt: The story takes place two-hundred years from now.",
    },
    {
      day: 9,
      dailyPrompt:
        "Write a 450 word story in the romance genre.It's about a dog breeder and should include a computer. Also use the sentence 'You have my permission.' Bonus prompt: Your story involves a damsel in distress.",
    },
    {
      day: 10,
      dailyPrompt:
        "Write a 900 word story in the magical realism genre. It's about a barista and should include a fridge. Also use the sentence 'Leave me alone!' Bonus prompt: Your character is very shy.",
    },
    {
      day: 11,
      dailyPrompt:
        "Write a 750 word story in the epic genre. It's about an unsuccessful policeman and should include glass. Also use the sentence 'He can change.' Bonus prompt: There is a great storm.",
    },
    {
      day: 12,
      dailyPrompt:
        "Write a 200 word story in the adventure genre. It's about a fat baker and should include a pillow. Also use the sentence 'Thanks for nothing.' Bonus prompt: Your character is shipwrecked.",
    },
    {
      day: 13,
      dailyPrompt:
        "Write a 650 word story in the comedy genre. It's about a liar and should include a pencil. Also use the sentence 'Thanks for nothing.' Bonus prompt: Your character is dying.",
    },
    {
      day: 14,
      dailyPrompt:
        "Write a 150 word story in the drama genre. It's about a scientist and should include coloring pencils. Also use the sentence 'Aren't you afraid?' Bonus prompt: The story takes place in a desert.",
    },
    {
      day: 15,
      dailyPrompt:
        "Write a 800 word story in the comedy genre. It's about a druid and should include fire. Also use the sentence 'What problem?' Bonus prompt: Your character has a world-changing idea.",
    },
    {
      day: 16,
      dailyPrompt:
        "Write a 600 word story in the military genre. It's about a politician and should include not enough money. Also use the sentence 'I'll deal with you later.' Bonus prompt: Your character is shipwrecked.",
    },
    {
      day: 17,
      dailyPrompt:
        "Write a 900 word story in the comedy genre. It's about a politician and should include a watch. Also use the sentence 'I'd like a day without punishing you.' Bonus prompt: The story involves a fight.",
    },
    {
      day: 18,
      dailyPrompt:
        "Write a 950 word story in the children genre. It's about a demon and should include a ripped-up bank note. Also use the sentence 'I'll deal with you later.' Bonus prompt: Your character is shipwrecked.",
    },
    {
      day: 19,
      dailyPrompt:
        "Write a 850 word story in the suspense genre. It's about a fascist and should include a flag. Also use the sentence 'Whoopsidaisies!' Bonus prompt: Your character has just met the love of his/her life.",
    },
    {
      day: 20,
      dailyPrompt:
        "Write a 900 word story in the science fiction genre. It's about a film producer and should include a dictionary. Also use the sentence 'There is no time.' Bonus prompt: Your story involves a damsel in distress.",
    },
    {
      day: 21,
      dailyPrompt:
        "Write a 50 word story in the magical realism genre. It's about a dog breeder and should include a motor bike. Also use the sentence 'It is required of you.' Bonus prompt: Your story involves a damsel in distress.",
    },
    {
      day: 22,
      dailyPrompt:
        "Write a 50 word story in the fantasy genre. It's about a truck driver and should include a football. Also use the sentence 'You have my permission.' Bonus prompt: Your character is shipwrecked.",
    },
    {
      day: 23,
      dailyPrompt:
        "Write a 550 word story in the suspense genre. It's about an archivist and should include a fridge. Also use the sentence 'Whoopsidaisies!' Bonus prompt: Your character is loved by everyone.",
    },
    {
      day: 24,
      dailyPrompt:
        "Write a 150 word story in the drama genre. It's about an addict and should include an umbrella. Also use the sentence 'It's your fault.' Bonus prompt: The story takes place in a desert.",
    },
    {
      day: 25,
      dailyPrompt:
        "Write a 1000 word story in the crime genre. It's about a famous musician and should include headphones. Also use the sentence 'I will end you for this.' Bonus prompt: Your character is very shy.",
    },
    {
      day: 26,
      dailyPrompt:
        "Write a 250 word story in the magical realism genre. It's about a dictator and should include a wooden cross. Also use the sentence 'You will take the fall for this.' Bonus prompt: Your character is dying.",
    },
    {
      day: 27,
      dailyPrompt:
        "Write a 1000 word story in the adventure genre. It's about a bank counter and should include a set of binoculars. Also use the sentence 'You shouldn't have heard that.' Bonus prompt: Your character is dying.",
    },
    {
      day: 28,
      dailyPrompt:
        "Write a 150 word story in the suspense genre. It's about a gamer and should include a watch. Also use the sentence 'Not for you.' Bonus prompt: There is a great storm.",
    },
    {
      day: 29,
      dailyPrompt:
        "Write a 100 word story in the magical realism genre. It's about a struggling musician and should include ice cream. Also use the sentence 'Leave me alone!' Bonus prompt: Your character has just met the love of his/her life.",
    },
    {
      day: 30,
      dailyPrompt:
        "Write a 550 word story in the magical realism genre. It's about an acupuncturist and should include a painting. Also use the sentence 'Never.' Bonus prompt: The story takes place in a desert.",
    },
    {
      day: 31,
      dailyPrompt:
        "Write a 500 word story in the children genre. It's about a penniless writer and should include a window. Also use the sentence 'I will end you for this.' Bonus prompt: Your character has a world-changing idea.",
    },
  ];

  return dailyPrompts;
};

export default DailyPrompts;
