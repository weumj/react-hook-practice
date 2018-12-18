/* @jsx jsx */
import { jsx } from '@emotion/core';

import React from 'react';
import { Section, Text, Image } from '../../../shared/pattern';
import UserContext from '../user-context';
import { Repo } from './repo-list';

export interface Organization {
  id: string;
  avatarUrl: string;
  login: string;
  url?: string;
}
export interface User {
  avatarUrl: string;
  name: string;
  login: string;
  followersCount: number;
  repositoriesCount: number;
  followingCount: number;
  organizations: Organization[];
  repositories: Repo[];
}

type Props = { user: User };

function Profile({ user }: Props) {
  return (
    <div>
      <Section>
        <Image responsive rounded alt="User Avatar" src={user.avatarUrl} />
        <Text size="heading">{user.name}</Text>
        <Text size="standard" tint="faded" css={{ fontWeight: 300, fontSize: 20 }}>
          {user.login}
        </Text>
      </Section>
      <ProfileStatsSection user={user} />
      {user.organizations.length ? <OrganizationsSection orgs={user.organizations} /> : null}
    </div>
  );
}

function ProfileStatsSection({ user }: Props) {
  return (
    <Section css={{ textAlign: 'center' }}>
      <ProfileStat value={user.followersCount} label="followers" />
      <ProfileStat value={user.repositoriesCount} label="repositories" />
      <ProfileStat value={user.followingCount} label="following" />
    </Section>
  );
}

function ProfileStat({ value, label }: { value: number; label: string }) {
  return (
    <div
      css={{
        display: 'inline-block',
        width: 80,
      }}
    >
      <Text size="heading" css={{ margin: 0 }}>
        {value}
      </Text>
      <Text tint="fadedExtra">
        <small>{label}</small>
      </Text>
    </div>
  );
}

function OrganizationsSection({ orgs }: { orgs: User['organizations'] }) {
  return (
    <Section>
      <Text size="superstandard">Organizations</Text>
      {orgs.map(org => (
        <a key={org.id} href={org.url} data-tooltip={org.login}>
          <Image
            src={org.avatarUrl}
            alt={`${org.login} Avatar`}
            css={{
              borderRadius: 3,
              margin: 5,
              width: 42,
              height: 42,
            }}
          />
        </a>
      ))}
    </Section>
  );
}

function ProfileUserConsumer() {
  return <UserContext.Consumer>{user => <Profile user={user} />}</UserContext.Consumer>;
}

export default ProfileUserConsumer;
