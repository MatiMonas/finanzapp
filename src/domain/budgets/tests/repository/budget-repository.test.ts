import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { DatabaseError } from 'errors';
import { TESTING_DATABASE_PARAMS } from 'utils/constants';
import { cleanDatabase } from 'utils/helpers/cleanDatabase';

jest.mock('utils/env.ts', () => TESTING_DATABASE_PARAMS);

const prisma = new PrismaClient();
