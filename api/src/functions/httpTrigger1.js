const { app, output } = require('@azure/functions');
const sendToCosmosDb = output.cosmosDB({
    databaseName: 'my-database',
    containerName: 'my-container',
    createIfNotExists: false,
    connection: 'CosmosDBConnectionString',
  });

app.http('httpTrigger1', {
    methods: ['GET', 'POST'],
    extraOutputs: [sendToCosmosDb],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        const name = request.query.get('name') || await request.text() || 'world';

        try {
            // Output to Database
            context.extraOutputs.set(sendToCosmosDb, {
            // create a random ID
            id: new Date().toISOString() + Math.random().toString().substring(2, 10),
            name: name,
            });
        } catch (error) {
            context.log(`Error: ${error}`);
            return { status: 500, body: 'Internal Server Error' };
        }

        return { jsonBody: { text: `Hello, ${name}!` } };
    }
});
