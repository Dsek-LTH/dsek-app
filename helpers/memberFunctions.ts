import { MeHeaderQuery, Member, MemberPageQuery, MemberPageQueryResult } from '~/generated/graphql';

export const getFullName = (
  member: Member | MeHeaderQuery['me'] | MemberPageQuery['memberById'],
  useNickname = true
) =>
  `${member.first_name} ${member.nickname && useNickname ? `"${member.nickname}"` : ''} ${
    member.last_name
  }`;

export const getClassYear = (member: Member | MemberPageQuery['memberById']) =>
  `${member.class_programme}${member.class_year ? member.class_year % 100 : ''}`;
