import PropTypes from 'prop-types';
import React from 'react';
import { Section, Input } from '../../../shared/pattern';

export default RepoFilter;

interface Props {
  filter: string;
  onUpdate: (s: string) => void;
}

function RepoFilter({ filter, onUpdate }: Props) {
  return (
    <Section>
      <Input
        type="text"
        aria-label="Filter repositories"
        value={filter}
        placeholder="Filter repositories..."
        onChange={({ target: { value } }) => onUpdate(value)}
      />
    </Section>
  );
}
