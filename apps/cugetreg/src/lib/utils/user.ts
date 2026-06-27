import type { UserInputSchema } from '@cugetreg/zod-schemas';

export function getFirstNameAndLastName(name: string) {
  const splitName = name.split(' ');
  return [splitName[0], splitName[splitName.length - 1]];
}

export function convertUserInfo(user: UserInputSchema) {
  const [firstName, lastName] = getFirstNameAndLastName(user.name);

  return {
    name: user.name,
    username: user.id,
    firstName,
    lastName,
    faculty: user.faculty ?? '',
    department: user.department ?? '',
    accountProvider: 'Google',
    accountEmail: user.email,
  };
}
