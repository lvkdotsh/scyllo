import Long from "long";
import { ScylloClient, selectOneFromRaw } from "../../lib";

type User = {
    username: string,
    uid: Long
}

let DB: ScylloClient<{ 'users': User }>;

beforeAll(async () => {
    DB = new ScylloClient({
        client: {
            contactPoints: [
                'localhost:9042'
            ],
            localDataCenter: 'datacenter1',
            keyspace: 'scyllojestsuite'
        }
    });
    await DB.awaitConnection();
});

it('Can switch keyspace', async () => {
    expect(DB.useKeyspace('scyllo'));
});

it('Can fetch every user from the database', async () => {
    expect(await DB.selectOneFrom('users', '*'));
});

it('Can fetch every user from the database with empty criteria object', async () => {
    expect(await DB.selectOneFrom('users', '*', {}));
});

it('Can request users using key', async () => {
    expect(await DB.selectOneFrom('users', '*', { uid: Long.fromString("720140462585020488") }, 'ALLOW FILTERING'));
});

it('Can request users using non-key and extra values', async () => {
    expect(await DB.selectOneFrom('users', '*', { username: 'lucemans' }, 'ALLOW FILTERING'));
});

afterAll(async () => {
    await DB.shutdown();
});