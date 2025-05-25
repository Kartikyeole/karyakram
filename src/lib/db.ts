import mongoose from 'mongoose';

type ConnectionObject = {
    isConnected?: number;
};


const connection: ConnectionObject = { }
const MONGOSTRING = process.env.MONGODB_STRING as string;


async function dbConnect(): Promise<void> {
    if(connection.isConnected) {
        console.log('Using existing connection');
        return;
    }
    try {
        const db = await mongoose.connect(MONGOSTRING,{
            dbName: 'next-auth',
        })
        connection.isConnected = db.connections[0].readyState;
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
        // Consider a better error handling strategy instead of process.exit
        // Maybe throw the error and handle it at a higher level
        throw new Error(`Failed to connect to database: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export default dbConnect;
