type UserInput = {
  id: string;
  email: string;
  name: string;
  googleId?: string;
  faculty: string | null;
  department: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export function getFirstNameAndLastName(name: string) {
  const splitName = name.split(' ');
  return [splitName[0], splitName[splitName.length - 1]];
}

export function convertUserInfo(user: UserInput) {
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
