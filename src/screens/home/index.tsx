/* @jsx jsx */
import { jsx } from '@emotion/core';

import { SyntheticEvent, useEffect } from 'react';
import { navigate } from '@reach/router';
import { Input, PrimaryButton, IsolatedContainer } from '../../shared/pattern';

function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
  e.preventDefault();
  const userInput = e.currentTarget.elements.namedItem('username');

  if (userInput && userInput instanceof RadioNodeList) {
    const username = userInput.value.trim();
    navigate(`/${username}`);
  }
}

function Home() {
  useEffect(() => {
    import('../user');
  }, []);
  return (
    <IsolatedContainer>
      <form
        onSubmit={handleSubmit}
        css={{
          display: 'flex',
          justifyContent: 'center',
          maxWidth: 240,
          margin: 'auto',
        }}
      >
        <Input
          type="text"
          name="username"
          placeholder="Enter a GitHub username"
          autoFocus
          css={{
            borderRight: 'none',
            borderTopRightRadius: '0',
            borderBottomRightRadius: '0',
            minWidth: 190,
          }}
        />
        <PrimaryButton
          css={{
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          }}
          type="submit"
        >
          Go
        </PrimaryButton>
      </form>
    </IsolatedContainer>
  );
}

export default Home;
