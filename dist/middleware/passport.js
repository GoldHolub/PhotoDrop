import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PhotographerRepository } from '../repositories/PhotographerRepository.js';
import { ClientRepository } from '../repositories/ClientRepository.js';
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret',
};
const photographerRepository = new PhotographerRepository();
const clientRepository = new ClientRepository();
export default passport.use(new Strategy(opts, async (jwt_payload, done) => {
    try {
        if (jwt_payload.role === 'photographer') {
            const user = await photographerRepository.findPhotographerByUsername(jwt_payload.username);
            if (user) {
                return done(null, user);
            }
        }
        else if (jwt_payload.role === 'client') {
            const user = await clientRepository.findClientByPhone(jwt_payload.phoneNumber);
            if (user) {
                return done(null, user);
            }
        }
        return done(null, false);
    }
    catch (err) {
        return done(err, false);
    }
}));
//# sourceMappingURL=passport.js.map