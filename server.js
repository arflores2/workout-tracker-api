var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema, GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLString } = require('graphql');

var schema = buildSchema(`
  type Query {
    workouts: [Workout]
  }

  type Workout {
    name: String
    date: String
    blocks: [Block]
  }

  type Block {
    name: String
  }
`)

var root = {
  workouts: () => {
    const d = new Date();
    return [{
      name: `Workout ${d.toString()}`,
      date: d.toString(),
      blocks: [{ name: 'custom block' }]
    }];
  }
}


var app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
}));

app.post('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: false,
}));

app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));