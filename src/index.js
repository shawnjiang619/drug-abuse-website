

// You can require libraries
const d3 = require('d3')
// const fullpage = require('fullpage.js')

// You can include local JS files:
const MyClass = require('./my-class');
const myClassInstance = new MyClass();
myClassInstance.sayHi();

const MyPie = require('./pie');
const pie = new MyPie();

// You can load JSON files directly via require.
// Note this does not add a network request, it adds
// the data directly to your JavaScript bundle.
const exampleData = require('./example-data.json');


// Anything you put in the static folder will be available
// over the network, e.g.
d3.csv('carbon-emissions.csv')
  .then((data) => {
    console.log('Dynamically loaded CSV data', data);
  })

// Initializing it
// var fullPageInstance = new fullpage('#myFullpage', {
//   navigation: true,
//   sectionsColor:['#ff5f45', '#0798ec', '#fc6c7c', 'grey']
// });
