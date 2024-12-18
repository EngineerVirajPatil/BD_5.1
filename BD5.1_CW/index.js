const express = require('express');
const { resolve } = require('path');
let { track } = require('./models/track.model');
let { sequelize } = require('./lib/index');



const app = express();
const port = 3000;

app.use(express.json());

let movieData = [
  {
    name: 'Raabta',
    genre: 'Romantic',
    release_year: 2012,
    artist: 'Arjit Singh',
    album: 'Agent Vinod',
    duration: 4
  },
  {
    name: 'Naina Da Kya Kasoor',
    genre: 'Pop',
    release_year: 2010,
    artist: 'Amit Trivedi',
    album: 'Andhadhun',
    duration: 3
  },
  {
    name: 'Ghoomar',
    genre: 'Traditional',
    release_year: 2018,
    artist: 'Shreya Goshal',
    album: 'Padmavaat',
    duration: 3
  },
  {
    name: 'Hawa Banke',
    genre: 'Romantic',
    release_year: 2019,
    artist: 'Darshan Raval',
    album: 'Hawa Banke(Single)',
    duration: 3
  },
  {
    name: 'Ghungroo',
    genre: 'Dance',
    release_year: 2019,
    artist: 'Arjit Singh',
    album: 'War',
    duration: 5
  },
  {
    name: 'Makhna',
    genre: 'Hip-Hop',
    release_year: 2019,
    artist: 'Tanisk Bagchi',
    album: 'Drive',
    duration: 3
  }
]

async function fetchAllTracks() {
  let response = track.findAll();
  return response;
}

async function  fetchTrachById(id){
  let response=await track.findOne({where:{id}});
  return response;
}

async function fetchTrackByArtist(artist){
  let response=await track.findAll({where:{artist}});
  return response;
}

async function fetchTrackByOrderByReleaseYear(order){
  let response=await track.findAll({order:[['release_year',order]]});
  return response;
}

async function addNewTrack(newData){
  let newResponse=await track.create(newData);
  return newResponse;
}

app.get('/seed-data', async (req, res) => {
  try {
    await sequelize.sync({ force: true });

    await track.bulkCreate(movieData);
    res.status(200).json({ message: 'Data seeded successfully' })
  }
  catch (error) {
    res.status(500).json({ message: 'Error seeding the data', error: error.message });
  }
})

app.get('/tracks', async (req, res) => {
  try {
    let result = await fetchAllTracks();
    if (result.length === 0) {
      res.status(404).json({ message: 'Data not found' })
    }
    res.status(200).json(result)
  }
  catch (error) {
    res.status(500).json({
      message: 'Error in fetching Data',
      error: error.message
    })
  }
})

app.get('/tracks/id/:id', async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let result = await fetchTrachById(id);
    if(result.length===0||result===null){
    res.status(404).json({message:'No Data Found'})
    }
    res.status(200).json(result);
  }
  catch (error) {
    res.status(500).json({
      message: 'Error in fetching Data',
      error: error.message
    })
  }
})

app.get('/tracks/artist/:artist',async(req, res)=>{
  try{
    let artist=req.params.artist;
    let result=await fetchTrackByArtist(artist);
    if(result.length===0||result===null){
      res.status(404).json({message:'No Data Found'})
      }
      res.status(200).json(result);
  }
  catch(error){
    res.status(500).json({
      message: 'Error in fetching Data',
      error: error.message
    })
  }
})

app.get('/tracks/sort/release_year',async(req,res)=>{
  try{
    let order=req.query.order;
    let result=await fetchTrackByOrderByReleaseYear(order);
    if(result.length===0||result===null){
      res.status(404).json({message:'No Data Found'});
      }
      res.status(200).json(result);
  }
  catch(error){
    res.status(500).json({
      message: 'Error in fetching Data',
      error: error.message
    })
  }
})

app.post('/tracks/new',async(req, res)=>{
try{
  let newData=req.body.newTrack;
  let response= await addNewTrack(newData);
  res.status(200).json(response);
}
catch(error){
  res.status(500).json({
    message: 'Error in fetching Data',
    error: error.message
  })
}
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
