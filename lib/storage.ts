import { MongoClient } from 'mongodb';

const url = 'mongodb+srv://nikandr:passwordtelegram@cluster0.m9vc0.mongodb.net/toolbox_data?retryWrites=true&w=majority&appName=Cluster0';
const dbName = 'referral-system';

const client = new MongoClient(url);

const db = client.db(dbName);
const referralsCollection = db.collection('referrals');
const referredByCollection = db.collection('referredBy');

export function saveReferral(userId: string, referrerId: string) {
  referralsCollection.updateOne({ _id: referrerId }, { $push: { referrals: userId } }, { upsert: true });
  referredByCollection.updateOne({ _id: userId }, { $set: { referrer: referrerId } }, { upsert: true });
}

export function getReferrals(userId: string): string[] {
  const referrals = await referralsCollection.findOne({ _id: userId });
  return referrals?.referrals || [];
}

export function getReferrer(userId: string): string | null {
  const referrer = await referredByCollection.findOne({ _id: userId });
  return referrer?.referrer || null;
}
