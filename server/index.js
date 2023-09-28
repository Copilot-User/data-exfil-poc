import Fastify from 'fastify';
import strategySelector from './strategies/strategySelector';
import saveChunk from './persistence/defaultPersistence';

const fastify = Fastify({
    logger: true
});

async function middleware(request, reply) {
    const userAgent = request.headers['user-agent'];

    const strategy = strategySelector(userAgent);

    return strategy(saveChunk, request, reply);
}

fastify.post('*', middleware);
fastify.get('*', middleware);
fastify.put('*', middleware);

fastify.delete('*', middleware);
fastify.patch('*', middleware);

fastify.listen({ port: 3001 }, function (err, address) {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }

});
