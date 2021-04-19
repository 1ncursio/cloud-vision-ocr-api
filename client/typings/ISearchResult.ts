export interface ISearchResult {
  slug: string;
  is_common: boolean;
  tags: string[];
  jlpt: string[];
  japanese: IJapanese[];
  senses: ISenses[];
  attribution: {
    jmdict: boolean;
    jmnedict: boolean;
    dbpedia: boolean;
  };
}

interface IJapanese {
  word: string;
  reading: string;
}

interface ISenses {
  english_definitions: string[];
  parts_of_speech: string[];
  links: string[];
  tags: string[];
  restrictions: string[];
  see_also: string[];
  antonyms: string[];
  source: string[];
  info: string[];
}
