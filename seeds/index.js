
const mongoose = require('mongoose');
const Campground = require('../models/campground.js')
const cities = require('./cities.js')
const { descriptors, places } = require('./seedHelpers.js')




mongoose.connect('mongodb://localhost:27017/Yelp-Camp', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log('Mongo cenetction open')
    })
    .catch((err) => {
        console.log('oh no Mongo error!!', err)
    })


const sample = array => array[Math.floor(Math.random() * array.length)];

// console.log(sample(places))

const seeddb = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 50; i++) {
        const price = Math.floor(Math.random() * 30) + 10;
        const camp = new Campground({
            author: '5fe9a3591a0612108b6845cf',
            location:
                `${sample(cities).city} ${sample(cities).state}`,
            title:
                `${sample(descriptors)} ${sample(places)}`,
            price,
            geometry: {
                coordinates: [
                    sample(cities).longitude,
                    sample(cities).latitude
                ],
                type: 'Point'
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dhz3fae76/image/upload/v1609500542/YelpCamp/kvn9rthlcn5rs4xtj4ds.jpg',
                    filename: 'YelpCamp/kvn9rthlcn5rs4xtj4ds'
                },
                {
                    url: 'https://res.cloudinary.com/dhz3fae76/image/upload/v1609500540/YelpCamp/psdcaw4ebvbf3dww7arl.jpg',
                    filename: 'YelpCamp/psdcaw4ebvbf3dww7arl'
                }
            ],
            description: 'ipsum dolor, sit amet consectetur adipisicing elit. Esse eveniet, quibusdam voluptate laboriosam a nisi officiis. Mollitia corrupti voluptas ullam, eius numquam fuga a maiores quod iusto illum, quo neque'

        })
        await camp.save()
    }
}

seeddb().then(() => {
    mongoose.connection.close()
})