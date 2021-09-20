# webshop
 MB's webbshop  
 https://next-webshop.vercel.app/
 
A demo web shop built with NextJS, MongoDB, Webpack, jsonwebtokens.

For the client side i used functional components with Hooks. Instead of using Redux i used a combination of useReducer, useContext, Router v5 and Hooks.  
-Hooks\
-useReducer\
-useContext\
-Router v5  

It uses a MongoDB database.  
-MongoDB  

There are no sessions. Normal users login with password that is hashed in the database. Their user info is then stored in the client and in localstorage until they log out. Admins receive a jsonwebtoken when logging in that is checked on every request to the server. Their info is not stored in local storage. There is protected routing for the admin page although it should be more secure on the client side.  
-Login\
-hashed password\
-Local storage\
-jsonwebtokens  

Things yet to be implemented\
-a checkout page\
-animation for frontpage carousel\
-a seller's page\
-more form validation  

--------------------------------------------------------------------------------------------------------  
En fiktiv webbshop byggd som arbetsprov gjord med React, Server-Side Rendering, NodeJS, GraphQL, MongoDB, Webpack, jsonwebtokens.

I klientdelen använder jag functional components med Hooks. Istället för Redux använder jag useReducer, useContext, Router v5 och Hooks tillsammans.\
-Hooks\
-useReducer\
-useContext\
-Router v5  

Appen använder en MongoDB databas.  
-MongoDB  

Appen använder inga sessions. Vanliga användare loggar in med lösenord som är hashat i databasen. Dens info sparas sen i localstorage tills de loggar ut. Admins får en jsonwebtoken när de loggar in som kollas varje gång de utför ett kommando mot servern. Deras info sparas inte i localstorage. Routing till adminsidan är skyddad även om det kunde varit hårdare koll i klienten.  
-Login\
-hashed password\
-Local storage\
-jsonwebtokens  


