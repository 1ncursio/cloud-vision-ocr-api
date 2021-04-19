import { ISearchResult } from '@typings/ISearchResult';
import React, { FC } from 'react';

interface searchResultProps {
  data: ISearchResult;
}

const SearchResult: FC<searchResultProps> = ({ data }: searchResultProps) => {
  const {
    jlpt,
    japanese: [{ word, reading }],
    senses: [{ english_definitions: definitions }],
  } = data;

  return (
    <>
      <div>단어 : {`${word} (${reading})`}</div>
      <div>뜻 : {definitions[0]}</div>
      {jlpt[0] && <div>{`JLPT 급수 : ${jlpt[0]}`}</div>}
    </>
  );
};

export default SearchResult;
