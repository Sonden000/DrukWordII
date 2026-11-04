
export type VocabularyWord = {
    id: string;
    dzongkha: string;
    transliteration: string;
    meaning: string;
    partOfSpeech: string;
    exampleDzongkha: string;
    exampleEnglish: string;
  };
  
  export const vocabulary: VocabularyWord[] = [
    {
      id: 'tashi',
      dzongkha: 'བཀྲ་ཤིས',
      transliteration: 'Tashi',
      meaning: 'Good luck • Blessing',
      partOfSpeech: 'Noun',
      exampleDzongkha: 'ཁྱོད་ལུ་བཀྲ་ཤིས་བདེ་ལེགས།',
      exampleEnglish: 'Tashi Delek to you. / Good luck and blessings.',
    },
    {
      id: 'chu',
      dzongkha: 'ཆུ',
      transliteration: 'Chu',
      meaning: 'Water',
      partOfSpeech: 'Noun',
      exampleDzongkha: 'ཆུ།',
      exampleEnglish: 'Water.',
    },
    {
      id: 'ama',
      dzongkha: 'ཨ་མ',
      transliteration: 'Ama',
      meaning: 'Mother',
      partOfSpeech: 'Noun',
      exampleDzongkha: 'ཨ་མ།',
      exampleEnglish: 'Mother.',
    },
    {
      id: 'apa',
      dzongkha: 'ཨ་པ',
      transliteration: 'Apa',
      meaning: 'Father',
      partOfSpeech: 'Noun',
      exampleDzongkha: 'ཨ་པ།',
      exampleEnglish: 'Father.',
    },
    {
      id: 'khim',
      dzongkha: 'ཁྱིམ',
      transliteration: 'Khim',
      meaning: 'House • Home',
      partOfSpeech: 'Noun',
      exampleDzongkha: 'ཁྱིམ།',
      exampleEnglish: 'House or home.',
    },
  ];
  