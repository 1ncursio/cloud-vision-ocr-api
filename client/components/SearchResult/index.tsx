import { ISearchResult } from '@typings/ISearchResult';
import React, { FC } from 'react';

interface searchResultProps {
  data: ISearchResult;
}

const SearchResult: FC<searchResultProps> = ({ data }: searchResultProps) => {
  const { slug, jlpt } = data;

  return (
    <>
      <div>뜻 : {slug}</div>
      <div>JLPT 급수 : {jlpt[0]}</div>
    </>
  );
};

export default SearchResult;
