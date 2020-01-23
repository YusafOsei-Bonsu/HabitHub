const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 4000;
const seedData = require("./seed.js");
const {
    readAllUsers,
    readUser,
    addUser,
    addHabit,
    updateHabit
} = require("./database.js");
const {
    summary
} = require('date-streaks');
app.use(cors());
app.use(bodyParser.json());

// connection.once('open', function() {
//     console.log("MongoDB database connection established successfully")
// })

//seed data
app.get('/seed', (req, res) => {
    seedData();
    res.send("Data seeded.");
})



// Get all users
app.get("/readAllUsers", (req, res) => {
    readAllUsers().then((response, err) => {
        //remove habits as this call will be used to validate user login, so habits not needed
        //removes habits from user record when sent
        response.map(user => {
            user.habits = null
        })
        res.json(response)
    })
})



const isToday = (someDate) => {
    const today = new Date()
    return someDate.getDate() == today.getDate() &&
        someDate.getMonth() == today.getMonth() &&
        someDate.getFullYear() == today.getFullYear()
}


const checkStreak = (habits) => {
        
        //uses american dates
       habits.map(habit => {
           if(habit.lastCompleted != null && !isToday(habit.lastCompleted))
           {
            const dates = [
                habit.lastCompleted
            ];
            if (summary({dates}).currentStreak === 1)
                habit.streak++;
            else if (summary({dates}).currentStreak === 0)
                habit.streak = 0;
           }
                
            })
        return habits
        }


        //get one users habits
        app.get("/readUserHabits/:id", (req, res) => {
            let id = req.params.id;
            readUser(id).then((response, err) => {

                    let habits = checkStreak(response.habits)

                    res.json(habits)
                })
                .catch(err => {
                    res.json(err)
                })

        })

        //add new user
        app.post("/addUser", (req, res) => {
            let username = req.body.username;
            let password = req.body.password;

            //validation?
            addUser(username, password).then(data => {
                res.send({
                    success: true
                })
            }).catch(err => {
                res.send({
                    success: false
                })
            })


        })
        //add one habit
        app.post("/addHabit/:id", (req, res) => {
            let id = req.params.id;
            let name = req.body.name;
            let completed = req.body.completed;
            console.log(id, name, completed)
            res.send(addHabit(id, name, completed))
        })

        //update habit completed
        app.post("/updateHabits/:userId", (req, res) => {
            let userId = req.params.userId;
            let habits = req.body.habits;
            updateHabit(userId, habits);
            res.send("shush postman");
        })

        //remove habit


        app.listen(PORT, function () {
            console.log("Server is running on Port: " + PORT);
        });