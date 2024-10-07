import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017';
const dbName = 'referral-system';

const client = new MongoClient(url);

const db = client.db(dbName);
const referralsCollection = db.collection('referrals');
const referredByCollection = db.collection('referredBy');

export async function saveReferral(userId: string, referrerId: string) {
  await referralsCollection.updateOne({ _id: referrerId }, { $push: { referrals: userId } }, { upsert: true });
  await referredByCollection.updateOne({ _id: userId }, { $set: { referrer: referrerId } }, { upsert: true });
}

export async function getReferrals(userId: string): Promise<string[]> {
  const referrals = await referralsCollection.findOne({ _id: userId });
  return referrals?.referrals || [];
}

export async function getReferrer(userId: string): Promise<string | null> {
  const referrer = await referredByCollection.findOne({ _id: userId });
  return referrer?.referrer || null;
}
