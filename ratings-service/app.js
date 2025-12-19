const express = require("express");
const app = express();
app.use(express.json());

// const swaggerUi = require("swagger-ui-express"); 
// const swaggerFile = require("./swagger-output.json"); 
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));


let ratings = [
  { id: 1, fairId: 1, userId: 2, rating: 5 },
  { id: 2, fairId: 3, userId: 1, rating: 4 },
  { id: 3, fairId: 2, userId: 1, rating: 3 }
];

// Get all ratings, optionally filtered by fairId
app.get("/ratings", (req, res) => {
  /* #swagger.tags = ['Ratings'] 
  #swagger.description = 'Get all ratings or filter by fairId'
  #swagger.parameters['fairId'] = { description: 'Filter by Fair ID', type: 'integer' }
  #swagger.responses[200] = { 
      description: 'Ratings found successfully', 
      schema: { $ref: '#/definitions/GetRating'} 
  } 
  */

  const { fairId } = req.query;
  if (fairId) {
    const filteredRatings = ratings.filter(r => r.fairId === parseInt(fairId));
    return res.json(filteredRatings);
  }
  res.json(ratings);
});

// Get a rating by ID
app.get("/ratings/:id", (req, res) => {
   /* #swagger.tags = ['Ratings'] 
  #swagger.description = 'Get a specific rating by ID'
  #swagger.responses[200] = { 
      description: 'Rating found successfully', 
      schema: { $ref: '#/definitions/GetRating'} 
  } 
  #swagger.responses[404] = { description: 'Rating not found' } 
  */

  const rating = ratings.find(r => r.id === parseInt(req.params.id));
  rating ? res.json(rating) : res.status(404).json({ error: "Rating not found" });
});

// Create a new rating
app.post("/ratings", (req, res) => {
  /* #swagger.tags = ['Ratings'] 
  #swagger.description = 'Create a new rating'
  #swagger.parameters['body'] = { 
    in: 'body', 
    description: 'New Rating object', 
    required: true, 
    schema: { $ref: '#/definitions/CreateRating' } 
  } 
  #swagger.responses[201] = { 
      description: 'Rating created successfully', 
      schema: { $ref: '#/definitions/GetRating'} 
  } 
  */

  const new_rating = { 
    id: ratings.length > 0 ? ratings[ratings.length - 1].id + 1 : 1, 
    fairId: req.body.fairId, 
    userId: req.body.userId, 
    rating: parseInt(req.body.rating) 
  };
  
  ratings.push(new_rating);
  return res.status(201).json(new_rating);
});

// Update a rating
app.put('/ratings/:id', (req, res) => {
  /* #swagger.tags = ['Ratings'] 
    #swagger.description = 'Update an existing rating'
    #swagger.parameters['body'] = { 
      in: 'body', 
      description: 'Update a Rating', 
      required: true, 
      schema: { $ref: '#/definitions/CreateRating' } 
    } 
    #swagger.responses[200] = { 
        description: 'Rating updated successfully', 
        schema: { $ref: '#/definitions/GetRating'} 
    } 
    #swagger.responses[404] = { description: 'Rating not found' } 
    */

  const id = parseInt(req.params.id);
  const index = ratings.findIndex(r => r.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Rating not found" });
  }

  // Atualiza apenas os campos enviados no body
  if (req.body.fairId) ratings[index].fairId = req.body.fairId;
  if (req.body.userId) ratings[index].userId = req.body.userId;
  if (req.body.rating) ratings[index].rating = parseInt(req.body.rating);

  return res.status(200).json(ratings[index]);
})

// Delete a rating
app.delete('/ratings/:id', (req, res) => {
  /* #swagger.tags = ['Ratings'] 
    #swagger.description = 'Delete a rating'
    #swagger.responses[204] = { description: 'Rating deleted successfully'} 
    #swagger.responses[404] = { description: 'Rating not found' } 
  */

  const id = parseInt(req.params.id);
  const index = ratings.findIndex(r => r.id === id);
  if (index === -1) {
    return res.status(404).json({error: "Rating not found!"});
  }
  ratings.splice(index, 1);
  return res.status(204).send(); 
})

app.listen(3002, () => console.log("Ratings service running on port 3002"));