import algoliasearch from 'algoliasearch';
import dotenv from 'dotenv';
dotenv.config();



const appId = process.env.APP_ID as string;
const appKey = process.env.APP_KEY as string;

export const searchClient = algoliasearch('D5QYNOIPF7', '5cfa3b355ff16c00a2ceb34c11bb6c0b');
