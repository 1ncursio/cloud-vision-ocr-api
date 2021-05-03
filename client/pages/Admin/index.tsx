import { css } from '@emotion/react';
import useInput from '@hooks/useInput';
import axios from 'axios';
import React, { useCallback } from 'react';

const Admin = () => {
  const [entry, onChangeEntry] = useInput('あたり');
  const [showEntry, onChangeShowEntry] = useInput('あたり');
  const [level, onChangeLevel] = useInput(1);
  const [pron, onChangePron] = useInput('当(た)り');

  const createWord = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('http://localhost:3050/words', { entry, showEntry, level, pron });
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    },
    [entry, showEntry, level, pron],
  );

  return (
    <form onSubmit={createWord} css={layout}>
      <input type="text" value={entry} onChange={onChangeEntry} placeholder="히라가나" />
      <input type="text" value={showEntry} onChange={onChangeShowEntry} placeholder="후리가나 - 오쿠리가나" />
      <input type="text" value={level} onChange={onChangeLevel} placeholder="JLPT 레벨" />
      <input type="text" value={pron} onChange={onChangePron} placeholder="품사" />
      <button type="submit">생성</button>
    </form>
  );
};

const layout = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  input,
  button {
    font-size: 1rem;
    padding: 0.5rem 0.8rem;
  }
`;

export default Admin;
