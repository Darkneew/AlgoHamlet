const express = require('express');
const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
        res.redirect('/menu');
});

app.post('/', function (req, res) {
        res.cookie("infos", JSON.stringify(req.body));
        res.redirect('/game');
})

app.listen(3000, () => {
        console.log('server started');
});