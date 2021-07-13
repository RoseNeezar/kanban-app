# Kanban App

Kanban application that contains the mvp  features of a generic task management app.

![kanban-app-demo](https://github.com/RoseNeezar/kanban-app/blob/master/demo.gif)

## Features
- Login
- Register
- Logout
- Google login
- Create and Delete board
- Create, Update and Delete List
- Create, Update and Delete task cards
- Reorder List in a board
- Reorder task card within a list
- Reorder task card with different list
- Markdown based task cards descriptions
- Pomodoro timer on each task cards
## Tech Stack
### Frontend
- Nextjs
- Typescript
- Tailwind css
- React router dom
- Mobx
- Firebase auth

### Backend
- Nestjs
- Typescript
- Typegoose
- Mongodb
- Firebase auth

### Devops
- Nginx
- Docker
- Docker compose
- Travis ci

## Installation

To start run, add firebase credentials. Use the env.example file to know which variable is needed from firebase.

```bash
cp .env.example .env
```

```bash
yarn start
```

App runs by default at http://localhost:3030

## Helpers
Install lazydocker on your system. This tool can help visualise container logs.

## License
[MIT](https://choosealicense.com/licenses/mit/)
