import Realm from 'realm';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const UserSchema = {
    name: 'User',
    properties: {
        _id: 'uuid',
        username: 'string',
        password: 'string'
    },
    primaryKey: '_id',
};

const convertToRealmUUID = (uuidString) => {
    return new Realm.BSON.UUID(uuidString);
};

let realm;

const connectDB = async () => {
    realm = await Realm.open({
        path: 'myrealm',
        schema: [UserSchema]
    });
};

const registerUser = async (username, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        let user;
        realm.write(() => {
            user = realm.create('User', {
                _id: convertToRealmUUID(uuidv4()),
                username: username,
                password: hashedPassword
            });
        });
        return user;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
};

const findUser = async (username) => {
    return realm.objects('User').filtered(`username = "${username}"`)[0];
};

export { connectDB, registerUser, findUser };
