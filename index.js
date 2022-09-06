const express = require('express')
const path = require('path')
const { engine } = require('express-handlebars')

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.engine('handlebars', engine({
    defaultLayout: 'main'
}))

app.set('view engine', 'handlebars')
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => res.render('index'))

const LISTICLE_DATA = [
    { id: 0, title: 'Top 10 Movies', 1: 'Donnie Darko', 2: 'Mr. Nobody', 3: 'The Butterfly Effect', 4: 'Source Code', 5: 'Eternal Sunshine of the Spotless Mind', 6: 'Ex Machina', 7: 'The Truman Show', 8: 'V for Vendetta', 9: 'Edge Of Tomorrow', 10: 'The Lord of the Rings' },
    { id: 1, title: 'Top 10 Shows', 1: 'How I Met Your Mother', 2: 'South Park', 3: 'The End of the F***ing World', 4: 'Genius', 5: 'Family Guy', 6: 'Hannibal', 7: 'Naruto', 8: 'The Mentalist', 9: 'Silicon Valley', 10: 'American Vandal' }
]

app.get('/listicles', (req, res) => res.json(LISTICLE_DATA))

// POST

app.post('/new', (req, res) => {
    try {
        const newList = req.body
        const find = LISTICLE_DATA.find(i => newList.title === i.title ? i : '')
        console.log(find)
        if (find) {
            res.status(404).json({
                success: false,
                error: `We can't upload because it already exists in our DB`
            })
        } else {
            for (let i = 0; i < (LISTICLE_DATA.length + 1); i++) {
                if (LISTICLE_DATA[i] === undefined) {
                    LISTICLE_DATA.push(Object.assign({ id: i }, newList))
                    break;
                }
            }
            console.log(LISTICLE_DATA)
            res.json({
                success: true
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            error: `We can't upload the user`
        })
    }
})

app.listen(3000)