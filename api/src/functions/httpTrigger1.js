const { app, input } = require('@azure/functions');
const cosmosInput = input.cosmosDB({
    databaseName: 'my-database',
    collectionName: 'my-container',
    id: '9982a992-ef92-44a2-b01c-e2be586208ae',
    partitionKey: '/id',
    connectionStringSetting: 'MyAccount_COSMOSDB',
});

app.http('httpTrigger1', {
    methods: ['GET', 'POST'],
    extraInputs: [cosmosInput],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        const name = request.query.get('name') || await request.text() || 'world';

        try {
            // Output to Database
            const doc = context.extraInputs.get(cosmosInput);
        } catch (error) {
            context.log(`Error: ${error}`);
            return { status: 500, body: 'Internal Server Error' };
        }

        return { jsonBody: { text: `Hello, ${name}!` } };
    }
});
