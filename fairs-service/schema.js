const typeDefs = `#graphql

type Fair {
    id: ID!
    name: String!                # Ex: "Mercado do Bolhão"
    description: String!         # O texto "Uma das feiras mais..."
    imageUrl: String!            # O URL da imagem de capa grande
    address: String!             # Ex: "Rua Formosa 305..."
    latitude: Float!             # Essencial para o botão "Ver no Mapa" e calcular "8.5km"
    longitude: Float!            # Essencial para o botão "Ver no Mapa"
    openingHours: String!        # Ex: "Todos os dias 8:00 - 00:00"
    categories: [String!]!     # Substitui "ProductType" (Alimentação, Vestuário)
    
    # Relações
    sellers: [Seller!]!          # "Os nossos participantes"
    ratings: [Rating!]                # Média de estrelas (Ex: 4.5)
    
  }

  type Seller {
    id: ID!
    name: String!                # Ex: "Joaquim"
   
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
    #fairsByCategory(categoryId: ID!): [Fair!]! 
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
