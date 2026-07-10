"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypt = encrypt;
exports.decrypt = decrypt;
exports.createSession = createSession;
exports.getSession = getSession;
exports.deleteSession = deleteSession;
exports.requireRole = requireRole;
const jose_1 = require("jose");
const headers_1 = require("next/headers");
const SECRET = new TextEncoder().encode(process.env.SESSION_SECRET || 'amandes_super_secret_jwt_key_at_least_32_characters_long');
async function encrypt(payload) {
    return await new jose_1.SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('2h')
        .sign(SECRET);
}
async function decrypt(token) {
    try {
        const { payload } = await (0, jose_1.jwtVerify)(token, SECRET);
        return payload;
    }
    catch (error) {
        return null;
    }
}
async function createSession(payload) {
    const jwt = await encrypt(payload);
    const cookieStore = await (0, headers_1.cookies)();
    cookieStore.set('session', jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7200, // 2 hours
    });
}
async function getSession() {
    const cookieStore = await (0, headers_1.cookies)();
    const token = cookieStore.get('session')?.value;
    if (!token)
        return null;
    return await decrypt(token);
}
async function deleteSession() {
    const cookieStore = await (0, headers_1.cookies)();
    cookieStore.delete('session');
}
async function requireRole(allowedRoles) {
    const session = await getSession();
    if (!session) {
        throw new Error('Unauthorized');
    }
    if (!allowedRoles.includes(session.role)) {
        throw new Error('Forbidden');
    }
    return session;
}
