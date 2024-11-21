import bcrypt from 'bcrypt';

export async function verifyPassword(
  enteredPassword: string,
  storedPasswordHash: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, storedPasswordHash);
}
