export const getCountrySEKQuery = country => ({
    query: `{\r
    country(name: "${country.name}") {\r
        currencies {\r
            code,
            SEKConversion\r
        }\r
    }\r
}`
});

export const deleteCountryQuery = (id) => ({
    query: `mutation {\r
            deleteCountry(id:  "${id}"){\r
              name\r
            }\r
     }\r`, "variables": {}
})

export const editCountryQuery = (country) => ({
    "query": `mutation { 
            editCountry(\r
             id: "${country.id}",\r
             name: "${country.name}", \r
             currencies: ${JSON.stringify(country.currencies).replace(/"([^"]+)":/g, '$1:')},\r  
             population: ${Number(country.population)}\r
            ){\r
               name\r
             }\r
        }\r`,
    "variables": {}
})
export const saveCountryQuery = (country) => ({
    "query": `mutation { 
            addCountry(\r
             name: "${country.name}", \r
             currencies: ${JSON.stringify(country.currencies).replace(/"([^"]+)":/g, '$1:')},\r  
             population: ${Number(country.population)}\r
            ){\r
               name\r
             }\r
        }\r`,
    "variables": {}
})

export const getCountriesQuery = {
    "query": "{\r\n    countries {id\r\n        name,\r\n        currencies {\r\n            code,\r\n            name,\r\n            symbol\r\n        },\r\n        population\r\n    }\r\n}",
    "variables": {}
};

export const getCountriesQueryByName = name => ({
    "query": `{\r
    countries  (name: "${name}") {
        id\r
        name,\r
        currencies {\r
            code,\r
            name,\r
            symbol\r
        },\r
        population\r
    }\r
}`,
    "variables": {}
})
