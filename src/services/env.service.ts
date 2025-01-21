import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config({ path: "../.env" });

export const envSchema = z.object({
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string().optional().default('secret dog'),
    PORT: z.string().optional().transform((value) => Number(value)),
});

export type Env = z.infer<typeof envSchema>;

export const EnvConfig = {
    port: process.env.PORT || 3000,
    jwtsecret: process.env.JWT_SECRET_KEY || 'secret_dog_key_123'
};

export class EnvConfigClass {

    constructor() {
        const env: Env = envSchema.parse(process.env);
        this.env = env;
    }

    private env: Env;

    get database() {
        return this.env.DATABASE_URL;
    }

    get jwtsecret() {
        return this.env.JWT_SECRET;
    }

    get port() {
        return this.env.PORT;
    }
}

export const EnvConfigClassInstance = new EnvConfigClass();