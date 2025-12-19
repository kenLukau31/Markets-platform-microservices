const typeDefs = `#graphql

type Fair {
    id: ID!
    name: String!                
    description: String!         
    imageUrl: String!            
    address: String!             
    latitude: Float!           
    longitude: Float!           
    openingHours: String!       
    categories: [String!]!   
    
    # Relations
    sellers: [Seller!]!          
    ratings: [Rating!]              
    
  }
  type Seller {
    id: ID!
    name: String!               
   
  }
  type Rating {
    id: ID!
    userId: String!
    fairId: ID!
    rating: Float!
  }
  type Query {
    fairs: [Fair!]!
    fair(id: ID!): Fair
  }
  type Mutation {
    addFair(
      name: String!, 
      description: String!, 
      imageUrl: String!, 
      address: String!, 
      latitude: Float!, 
      longitude: Float!, 
      openingHours: String!,
      categories: [String!]!): Fair

    updateFair(
      id: ID!, 
      name: String, 
      description: String, 
      imageUrl: String, 
      address: String, 
      latitude: Float, 
      longitude: Float, 
      openingHours: String,): Fair

    deleteFair(id: ID!): Boolean 
    
    addCategoryToFair(fairId: ID!, category: String!): Fair
    removeCategoryFromFair(fairId: ID!, category: String!): Fair
  }
`;

export default typeDefs;
