const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const request = require('request');
const nodemailer = require('nodemailer');
const mysql = require('mysql');
const Sequelize = require('sequelize');

const apiKey = '04a28ed626c455e1e15da0403ef5c81b';          //'682d666b2ab407f5c8bb6104ab7a1bc8';

var sender = {
    username: 'omertasci.ce@gmail.com',
    pass: 'omertasci+D6GKTA',
	fromName: 'Ömer Taşcı'
  };

app.locals.weather = '';
app.locals.error = '';

app.locals.firstname = '';
app.locals.lastname = '';

app.locals.reciever = '';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs')


var con = mysql.createConnection({
  host: "localhost",
  user: "om2m",
  password: "om2m",
  database: "nodejsdb"
});
/*
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to mysql!");
});
*/

app.get('/', function (req, res) {
  res.render('index');
})

app.get('/sendMail', function (req, res) {
  res.render('sendMail');
})

/*
app.post('/', function (req, res) {
  res.render('index');
  console.log(req.body.city);
})
*/
app.post('/', function (req, res) {
	
	let city = req.body.city;
	let url = 'http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey';
	
	request(url, function (err, response, body) {
	
		if(err){
		  res.render('index', {weather: null, error: 'Error, please try again'});
		} else {
			
			let weather = JSON.parse(body)
			console.log(weather);
			
			if(weather.main == undefined){
				res.render('index', {weather: null, error: 'Error, please try again'});
			} else {
				let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
				res.render('index', {weather: weatherText, error: null});
			}
		}
	});
})

/*
app.post('/savePerson', function (req, res) {
	let firstnameInput = req.body.firstnameInput;	
	let lastnameInput = req.body.lastnameInput;	
	let ageInput = req.body.ageInput;	
	let jobInput = req.body.jobInput;	
	let salaryInput = req.body.salaryInput;	
	
	var lastId = 1;
	con.connect(function(err) {
		if (err) throw err;
		console.log("Connected!");
		con.query("SELECT max(id) as id FROM person", function (err, result, fields) {
			if (err) throw err;
			console.log("Result : " + result);
			console.log("Result 0 : " + result[0]);
			console.log("Result 0 . id: " +  parseInt(result[0].id ,10));
			console.log("Result 0 . id + 5 : " + ( parseInt(result[0].id ,10)+ 5) );
			lastId = parseInt(result[0].id ,10);
			lastId += 1; 
			
		}); 
		
		console.log("LastId :"  + lastId);
		//lastId += 1; 
	 
		var sql = "INSERT INTO person (id, firstname, lastname, age, job, salary) VALUES (" + lastId + ", '" + firstnameInput +"', '" + lastnameInput + "', " + ageInput + ", '"+ jobInput + "', " + salaryInput + ")";//(1, 'Ömer', 'Taşcı', 29, 'Developer', 3434)";	  //
		con.query(sql, function (err, result) {
			if (err) throw err;
			console.log("1 record inserted");
		});
		
		
	});
	
	res.render('index', {firstname: firstnameInput, lastname: lastnameInput});
		
})
*/

const sequelize = new Sequelize('nodejsdb', 'om2m', 'om2m', {
  host: 'localhost',
  dialect: 'mysql',
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
  
const User = sequelize.define('user', {
  firstName: {
    type: Sequelize.STRING
  },
  lastName: {
    type: Sequelize.STRING
  }
});

const Person = sequelize.define('person', {
  firstName: {
    type: Sequelize.STRING
  },
  lastName: {
    type: Sequelize.STRING
  },
  age: {
    type: Sequelize.INTEGER
  },
  job: {
    type: Sequelize.STRING
  },
  salary: {
    type: Sequelize.DOUBLE
  },
  isMarried: {
    type: Sequelize.BOOLEAN
  }
});

// force: true will drop the table if it already exists
User.sync({force: true}).then(() => {
  // Table created
  console.log("User table is created.");
  /*return User.create({
    firstName: 'John',
    lastName: 'Hancock'
  });*/
});

// force: true will drop the table if it already exists
Person.sync({force: true}).then(() => {
  // Table created
  console.log("Person table is created.");
}); 

app.post('/saveUser', function (req, res) {
	let firstnameInput = req.body.firstnameInput;	
	let lastnameInput = req.body.lastnameInput;	
	
	User.create({ firstName: firstnameInput, lastName: lastnameInput }).then(user => {
		console.log(user.get(	{plain: true}	));
	});
	
	 User.findAll().then(users => {
	  console.log(users);
	})

});

app.post('/savePerson', function (req, res) {
	let firstnameInputP = req.body.firstnameInputP;	
	let lastnameInputP = req.body.lastnameInputP;
	let ageInputP = req.body.ageInputP;	
	let jobInputP = req.body.jobInputP;	
	let salaryInputP = req.body.salaryInputP;	
	let marriedInputP = req.body.marriedInputP;	
	
	Person.create({ firstName: firstnameInputP, lastName: lastnameInputP }).then(person => {
		console.log(person.get(	{plain: true}	));
	});
	
	 Person.findAll().then(person => {
	  console.log(person);
	})

	res.render('index', {firstname: firstnameInputP, lastname: lastnameInputP});
});



  /*---------------------------*/

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: sender.username,  //'omertasci.ce@gmail.com',
    pass: sender.pass //'omertasci+D6GKTA'
  }
});


app.post('/sendMail', function (req, res) {
	let toInp = req.body.toInput;	
	let subjectInp = req.body.subjectInput;	
	let textInp = req.body.textInput;
	
	var mailOptions = {
	  from: sender.fromName, //'youremail@gmail.com',
	  to: toInp,
	  subject: subjectInp,
	  text: textInp
	};
	
	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
		console.log(error);
	  } else {
		console.log('Email sent: ' + info.response);
	  }
	});
	
	
	res.render('sendMail', {reciever: toInp});
		
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})