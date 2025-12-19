//db
import fairs from './config/db.js';

const resolvers = {
    Query: {
        fairs: () => {
            console.log(`Getting all fairs`);
            return fairs
        },

        fair: (_, { id }) => {
            console.log(`Getting fair with ID ${id}`)
            return fairs.find(fair => fair.id === parseInt(id))
        },
    },
    Mutation: {
        addFair: (_, args) => {
            const new_fair = {
                ...args,
                id: fairs.length + 1,
                sellers: [],
                ratings: []
            };
            fairs.push(new_fair);

            console.log(`Added a new fair with the ID of ${new_fair.id}`);

            return new_fair;
        },
        updateFair: (_, {id,...args} ) => { 
            const index = fairs.findIndex(f => f.id == id);
            if (index === -1) {
                throw new Error(`Fair with ID ${id} not found.`);
            }
            const updatedFair = {
                ...fairs[index],  // 1. Pega em TUDO o que já existia na feira antiga
                ...args           // 2. Substitui APENAS o que veio novo no "args"
            };

            fairs[index] = updatedFair;
            return updatedFair;
        },
        deleteFair: (_, { id }) => {

            const index = fairs.findIndex(fair => fair.id === parseInt(id));
            if (index === -1) {
                throw new Error(`Fair with ID ${id} not found.`);
            }
            fairs.splice(index, 1);

            console.log(`Deleted fair with id ${id}`)
            return true;
        },

        addCategoryToFair: (_, { fairId, category }) => {
            const fair = fairs.find(fair => fair.id === parseInt(fairId));
            if (!fair) {
                throw new Error(`Fair with ID ${fairId} not found.`);
            }
            if (!fair.categories.includes(category)) {
                fair.categories.push(category);
            }
            return fair;
        },
        removeCategoryFromFair: (_, { fairId, category }) => {
            const fair = fairs.find(f => f.id === parseInt(fairId));
            if (!fair) {
                throw new Error(`Fair with ID ${fairId} not found.`);
            }
            fair.categories = fair.categories.filter(c => c !== category);
            return fair;
        }
    }};

export default resolvers;